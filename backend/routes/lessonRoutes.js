import express from 'express';
import { addLesson, updateLesson, deleteLesson, getLessonsByCourse } from '../controllers/lessonController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Note: /api/v1/lessons
router.post('/', protectAdmin, addLesson);
router.put('/:id', protectAdmin, updateLesson);
router.delete('/:id', protectAdmin, deleteLesson);

// Additional: Get lessons by course might be useful here or under courses
// router.get('/course/:courseId', getLessonsByCourse);

export default router;
