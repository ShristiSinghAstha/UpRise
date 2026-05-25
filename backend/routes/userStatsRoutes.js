import express from 'express';
import { getUserStats, getUserCourses } from '../controllers/userStatsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getUserStats);
router.get('/courses', protect, getUserCourses);

export default router;