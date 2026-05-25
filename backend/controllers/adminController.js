import asyncHandler from 'express-async-handler';
import Admin from '../models/Admin.model.js';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import Category from '../models/Category.model.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth admin & get token
// @route   POST /api/v1/admin/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    if (email) email = email.trim().toLowerCase();

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
        res.json({
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid Admin Credentials');
    }
});

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/dashboard
// @access  Private Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get recently added courses
    const recentCourses = await Course.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title category createdAt');

    // Get user registration stats (last 7 days trend)
    const registrationTrend = [];
    for (let i = 6; i >= 0; i--) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - i);

        const end = new Date();
        end.setHours(23, 59, 59, 999);
        end.setDate(end.getDate() - i);

        const count = await User.countDocuments({
            createdAt: { $gte: start, $lte: end }
        });

        registrationTrend.push({
            date: start.toLocaleDateString('en-US', { weekday: 'short' }),
            users: count
        });
    }

    // Category distribution
    const categories = await Category.find({});
    const categoryStats = await Promise.all(categories.map(async (cat) => {
        const count = await Course.countDocuments({ category: cat.name });
        return { name: cat.name, count };
    }));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUserRegistrations = await User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
        totalUsers,
        totalCourses,
        totalCategories,
        recentCourses,
        recentUserRegistrations,
        registrationTrend,
        categoryStats
    });
});

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Private Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { loginAdmin, getDashboardStats, getAllUsers, deleteUser };