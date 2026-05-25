import asyncHandler from 'express-async-handler';
import Category from '../models/Category.model.js';
import Course from '../models/Course.model.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ name: 1 });

    // Add course count to each category
    const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
        const courseCount = await Course.countDocuments({ category: cat.name });
        return {
            ...cat._doc,
            courseCount
        };
    }));

    res.json(categoriesWithCount);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private Admin
const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({
        name,
        description,
    });

    res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

export { getCategories, createCategory, deleteCategory };
