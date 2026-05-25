import QuizResult from "../models/QuizResult.model.js";
import Quiz from "../models/Quiz.model.js";

export const submitQuizResult = async (req, res, next) => {
    try {
        const { courseId, score, totalQuestions } = req.body;
        const userId = req.user.id;

        if (!courseId || score === undefined || !totalQuestions) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const percentage = (score / totalQuestions) * 100;
        const passed = percentage >= 50;

        const quizResult = await QuizResult.create({
            userId,
            courseId,
            score,
            percentage,
            passed,
        });

        res.status(201).json({
            message: "Quiz submitted successfully",
            data: quizResult,
        });
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getQuizResults = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const results = await QuizResult.find({ userId }).sort({ attemptedAt: -1 });
        res.status(200).json({ data: results });
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getQuizByCourseId = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const quiz = await Quiz.findOne({ courseId });
        
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found for this course" });
        }

        // Use aggregation on the specific quiz document's questions array to sample 5 random questions
        const randomQuestions = await Quiz.aggregate([
            { $match: { _id: quiz._id } },
            { $unwind: "$questions" },
            { $sample: { size: 5 } },
            { $group: { _id: "$_id", courseId: { $first: "$courseId" }, questions: { $push: "$questions" } } }
        ]);

        if (!randomQuestions.length) {
             return res.status(404).json({ message: "No questions found in this quiz" });
        }

        res.status(200).json({
            title: "Course Quiz",
            questions: randomQuestions[0].questions
        });

    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAdminQuizByCourseId = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const quiz = await Quiz.findOne({ courseId });
        
        if (!quiz) {
            return res.json({ title: "Course Quiz", questions: [] });
        }

        res.status(200).json(quiz);
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const addQuestionToQuiz = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { questionText, options, correctAnswer } = req.body;

        if (!questionText || !options || options.length < 2) {
            return res.status(400).json({ message: "Invalid question data" });
        }

        let quiz = await Quiz.findOne({ courseId });

        if (!quiz) {
            quiz = new Quiz({ courseId, questions: [] });
        }

        quiz.questions.push({ questionText, options, correctAnswer });
        await quiz.save();

        res.status(201).json({ message: "Question added", quiz });
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const deleteQuestionFromQuiz = async (req, res, next) => {
    try {
        const { courseId, questionId } = req.params;
        
        const quiz = await Quiz.findOne({ courseId });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        quiz.questions = quiz.questions.filter(q => q._id.toString() !== questionId);
        await quiz.save();

        res.status(200).json({ message: "Question removed", quiz });
    } catch (error) {
        if (next) next(error);
        else res.status(500).json({ message: "Server Error", error: error.message });
    }
};
