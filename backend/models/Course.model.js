import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: false, // Optional but recommended
        },
        category: {
            type: String,
            required: true,
        },
        youtubePlaylist: {
            type: String,
            required: false,
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            required: true,
        },
        lessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
            },
        ],
        enrolledUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isPublished: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;