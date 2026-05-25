
import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    passed: {
        type: Boolean,
        required: true,
    },
    attemptedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("QuizResult", quizResultSchema);
