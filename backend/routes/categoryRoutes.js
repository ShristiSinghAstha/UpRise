import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protectAdmin, createCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;
