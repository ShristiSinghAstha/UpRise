import asyncHandler from 'express-async-handler';
import Lesson from '../models/Lesson.model.js';
import Course from '../models/Course.model.js';

// @desc    Add lesson to a course
// @route   POST /api/lessons
// @access  Private Admin
const addLesson = asyncHandler(async (req, res) => {
    const { title, youtubeVideoId, order, course: courseId, content, duration } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const lesson = await Lesson.create({
        title,
        youtubeVideoId,
        order,
        course: courseId,
        content,
        duration
    });

    // Push lesson to course's lesson array
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
});

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private Admin
const updateLesson = asyncHandler(async (req, res) => {
    const { title, youtubeVideoId, order, content, duration } = req.body;
    const lesson = await Lesson.findById(req.params.id);

    if (lesson) {
        lesson.title = title || lesson.title;
        lesson.youtubeVideoId = youtubeVideoId || lesson.youtubeVideoId;
        lesson.order = order || lesson.order;
        lesson.content = content !== undefined ? content : lesson.content;
        lesson.duration = duration || lesson.duration;

        const updatedLesson = await lesson.save();
        res.json(updatedLesson);
    } else {
        res.status(404);
        throw new Error('Lesson not found');
    }
});

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private Admin
const deleteLesson = asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);

    if (lesson) {
        // Remove from course
        await Course.updateOne(
            { _id: lesson.course },
            { $pull: { lessons: lesson._id } }
        );

        await lesson.deleteOne();
        res.json({ message: 'Lesson removed' });
    } else {
        res.status(404);
        throw new Error('Lesson not found');
    }
});

// @desc    Get lessons for a course (Admin view typically, or public if needed separately)
// @route   GET /api/courses/:courseId/lessons
// @access  Private Admin (or public if we want decoupled fetching)
const getLessonsByCourse = asyncHandler(async (req, res) => {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ order: 1 });
    res.json(lessons);
});


export { addLesson, updateLesson, deleteLesson, getLessonsByCourse };
