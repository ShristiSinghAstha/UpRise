import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [
        {
            text: {
                type: String,
                required: true,
            },
            isCorrect: {
                type: Boolean,
                required: true,
            }
        }
    ],
    correctAnswer: {
        type: String, // Can store the correct option text or index
        required: false
    }
});

const quizSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        questions: [questionSchema],
    },
    {
        timestamps: true,
    }
);

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
