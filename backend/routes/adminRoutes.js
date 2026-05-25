import express from 'express';
import { loginAdmin, getDashboardStats, getAllUsers, deleteUser } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/dashboard', protectAdmin, getDashboardStats);
router.get('/users', protectAdmin, getAllUsers);
router.delete('/users/:id', protectAdmin, deleteUser);

export default router;
