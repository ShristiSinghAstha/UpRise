
import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    studentName: {
        type: String,
        required: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Certificate", certificateSchema);
