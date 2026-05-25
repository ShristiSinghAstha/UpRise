import express from 'express';
import {
    getCourses,
    getCourseById,
    enrollCourse,
    getMyCourses,
    markLessonComplete,
    createCourse,
    updateCourse,
    deleteCourse
} from '../controllers/courseController.js';
import { protect, protectOptional } from '../middleware/authMiddleware.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public Routes (or Optional Auth)
router.get('/', getCourses);

// Protected Routes
router.get('/my-courses', protect, getMyCourses); // Specific path BEFORE parameterized path
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/lessons/:lessonId/complete', protect, markLessonComplete);

// Admin Routes
router.post('/', protectAdmin, createCourse);
router.put('/:id', protectAdmin, updateCourse);
router.delete('/:id', protectAdmin, deleteCourse);

// Parameterized Route (Must be last generally)
router.get('/:id', protectOptional, getCourseById);

export default router;
