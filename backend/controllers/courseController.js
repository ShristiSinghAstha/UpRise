import asyncHandler from 'express-async-handler';
import Course from '../models/Course.model.js';
import CourseProgress from '../models/CourseProgress.model.js';
import Lesson from '../models/Lesson.model.js';
import Quiz from '../models/Quiz.model.js';

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ isActive: true })
        .select('-enrolledUsers') // Lightweight list, but include lessons for length check
        .sort({ createdAt: -1 });
    res.json(courses);
});

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public/Private (Conditional)
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate('lessons');

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    let completedLessonIds = [];
    let isEnrolled = false;

    if (req.user) {
        // Check enrollment
        isEnrolled = course.enrolledUsers.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        // Fetch progress
        const progress = await CourseProgress.findOne({
            user: req.user._id,
            course: course._id,
        });

        if (progress) {
            completedLessonIds = progress.completedLessons;
        }
    }

    // Return course with added progress info
    const courseData = course.toObject();
    courseData.isEnrolled = isEnrolled;
    courseData.completedLessonIds = completedLessonIds;

    // Hide sensitive enrolledUsers list from response
    delete courseData.enrolledUsers;

    res.json(courseData);
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private Admin
const createCourse = asyncHandler(async (req, res) => {
    const { title, description, category, level, isPublished, thumbnail } = req.body;
    // Note: lessons created separately or passed as IDs? 
    // Usually admin creates course shell, then adds lessons. 
    // Or if passing IDs:
    // const { lessons } = req.body; 

    const course = new Course({
        title,
        description,
        category, // String validation against Category model happens in frontend or separate check
        level,
        isPublished: isPublished || false,
        thumbnail: thumbnail || '',
        enrolledUsers: [],
        lessons: [] // Start empty, add lessons via Lesson management
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private Admin
const updateCourse = asyncHandler(async (req, res) => {
    const { title, description, category, level, isPublished, thumbnail } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;
        course.level = level || course.level;
        if (isPublished !== undefined) course.isPublished = isPublished;
        course.thumbnail = thumbnail || course.thumbnail;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private Admin
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        // Delete associated lessons
        await Lesson.deleteMany({ course: course._id });
        // Delete associated quiz
        await Quiz.deleteOne({ courseId: course._id });
        
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledUsers.find(
        (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyEnrolled) {
        res.status(400);
        throw new Error('Already enrolled');
    }

    // Add user to course
    course.enrolledUsers.push(req.user._id);
    await course.save();

    // Create initial progress record
    await CourseProgress.create({
        user: req.user._id,
        course: course._id,
        completedLessons: [],
        progressPercentage: 0,
    });

    res.status(200).json({ message: 'Enrolled successfully' });
});

// @desc    Get logged in user courses
// @route   GET /api/courses/my-courses
// @access  Private
const getMyCourses = asyncHandler(async (req, res) => {
    // Find courses where user ID is in enrolledUsers
    const courses = await Course.find({ enrolledUsers: req.user._id })
        .select('-lessons') // Maybe show some details? Or just basic info.
        .sort({ updatedAt: -1 });
    res.json(courses);
});

// @desc    Mark lesson as completed
// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @access  Private
const markLessonComplete = asyncHandler(async (req, res) => {
    const { id: courseId, lessonId } = req.params;
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Find progress or create (Auto-Enroll)
    let progress = await CourseProgress.findOne({
        user: userId,
        course: courseId,
    });

    if (!progress) {
        // Auto-enroll logic
        // Use string comparison for object IDs
        const isEnrolled = course.enrolledUsers.some(
            uid => uid.toString() === userId.toString()
        );

        if (!isEnrolled) {
            course.enrolledUsers.push(userId);
            await course.save();
        }

        progress = await CourseProgress.create({
            user: userId,
            course: courseId,
            completedLessons: [],
            progressPercentage: 0,
        });
    }

    // Check if lesson is already completed
    // Ensure lessonId is treated as string for comparison if stored as ID
    const isCompleted = progress.completedLessons.some(id => id.toString() === lessonId);

    if (!isCompleted) {
        progress.completedLessons.push(lessonId);

        // Recalculate percentage
        if (course.lessons && course.lessons.length > 0) {
            progress.progressPercentage = (progress.completedLessons.length / course.lessons.length) * 100;
        }

        await progress.save();
    }

    res.status(200).json({ message: 'Lesson marked as completed', progress });
});



export {
    getCourses,
    getCourseById,
    enrollCourse,
    getMyCourses,
    markLessonComplete,
    createCourse,
    updateCourse,
    deleteCourse
};
