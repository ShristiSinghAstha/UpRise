import Certificate from "../models/Certificate.model.js";
import QuizResult from "../models/QuizResult.model.js";
import Course from "../models/Course.model.js";

export const createCertificate = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        if (!courseId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Fetch course name dynamically from DB
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const courseName = course.title;
        const studentName = req.user.username; // Get username from authenticated user

        const passedQuiz = await QuizResult.findOne({
            userId,
            courseId,
            passed: true
        });

        if (!passedQuiz) {
            return res.status(400).json({ message: "You have not passed the quiz for this course." });
        }

        const existing = await Certificate.findOne({ userId, courseId }).populate('userId', 'username email');
        if (existing) {
            return res.status(409).json({ message: "Certificate already exists for this course.", data: existing });
        }

        const certificateId = `UPRISE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const certificate = await Certificate.create({
            certificateId,
            userId,
            courseId,
            courseName,
            studentName,
        });

        // Populate user for response consistency
        await certificate.populate('userId', 'username email');

        res.status(201).json({
            message: "Certificate generated successfully",
            data: certificate
        });
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getCertificate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const certificate = await Certificate.findOne({ certificateId: id }).populate('userId', 'username email');
        if (!certificate) return res.status(404).json({ message: "Certificate not found" });
        res.status(200).json({ data: certificate });
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getCertificatesByUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const certificates = await Certificate.find({ userId }).sort({ issuedAt: -1 }).populate('userId', 'username email');
        res.status(200).json({ data: certificates });
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};