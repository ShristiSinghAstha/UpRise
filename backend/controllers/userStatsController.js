import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import Course from '../models/Course.model.js';
import Certificate from '../models/Certificate.model.js';
import CourseProgress from '../models/CourseProgress.model.js';

// @desc    Get user statistics
// @route   GET /api/v1/user/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Get total enrolled courses
        const enrolledCoursesCount = await Course.countDocuments({ enrolledUsers: userId });

        // Get total certificates
        const certificatesCount = await Certificate.countDocuments({ userId });

        // Get all progress records to calculate total completed lessons
        const allProgress = await CourseProgress.find({ user: userId });

        let completedLessonsCount = 0;
        let completedCoursesCount = 0;
        allProgress.forEach(progress => {
            completedLessonsCount += progress.completedLessons.length;
            if (progress.progressPercentage === 100) {
                completedCoursesCount++;
            }
        });

        // Calculate points (10 XP per lesson, 50 XP per certificate)
        const points = (completedLessonsCount * 10) + (completedCoursesCount * 50);

        // Get average progress
        let avgProgress = 0;
        if (allProgress.length > 0) {
            const totalProgress = allProgress.reduce((sum, progress) => sum + progress.progressPercentage, 0);
            avgProgress = Math.round(totalProgress / allProgress.length);
        }

        // Get recent activity (last 5 courses accessed)
        const recentActivity = await CourseProgress.find({ user: userId })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('course', 'title category');

        res.json({
            stats: {
                enrolledCourses: enrolledCoursesCount,
                completedCourses: completedCoursesCount,
                completedLessons: completedLessonsCount,
                points: points,
                totalCertificates: certificatesCount,
                avgProgress: avgProgress
            },
            recentActivity
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500);
        throw new Error('Failed to fetch user statistics');
    }
});

// @desc    Get user enrolled courses with progress
// @route   GET /api/v1/user/courses
// @access  Private
const getUserCourses = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Get courses where user is enrolled
        const courses = await Course.find({ enrolledUsers: userId })
            .select('title category lessons isPublished isActive')
            .lean();

        // Get progress for each course
        const coursesWithProgress = await Promise.all(courses.map(async (course) => {
            const progress = await CourseProgress.findOne({
                user: userId,
                course: course._id
            });

            // Count completed lessons
            const lessonsCompleted = progress ? progress.completedLessons.length : 0;
            const totalLessons = course.lessons.length;
            const progressPercentage = totalLessons > 0
                ? Math.round((lessonsCompleted / totalLessons) * 100)
                : 0;

            return {
                ...course,
                lessonsCompleted,
                totalLessons,
                progressPercentage,
                isCompleted: progressPercentage === 100
            };
        }));

        res.json({
            courses: coursesWithProgress
        });
    } catch (error) {
        res.status(500);
        throw new Error('Failed to fetch user courses');
    }
});

export { getUserStats, getUserCourses };