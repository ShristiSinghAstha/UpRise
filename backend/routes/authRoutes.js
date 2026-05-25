import express from 'express';
import { authUser, registerUser, getMe, logout, updateUserProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

export default router;
