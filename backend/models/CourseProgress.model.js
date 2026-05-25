import mongoose from 'mongoose';

const courseProgressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
        progressPercentage: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a user has only one progress record per course
courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

export default CourseProgress;
