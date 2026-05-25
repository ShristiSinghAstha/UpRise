import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        youtubeVideoId: {
            type: String,
            required: true,
            trim: true,
            // Helper to ensure we only store ID, not full URL if possible, though controller should handle processing
        },
        order: {
            type: Number,
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        content: {
            type: String, // Description or Markdown content
            default: '',
        },
        duration: {
            type: String, // e.g. "10:00"
            default: "00:00"
        }
    },
    {
        timestamps: true,
    }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
