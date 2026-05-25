import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const questionSchema = new mongoose.Schema({
    questionText: String,
    options: [{ text: String, isCorrect: Boolean }],
    correctAnswer: String
});
const quizSchema = new mongoose.Schema({
    courseId: mongoose.Schema.Types.ObjectId,
    questions: [questionSchema]
});
const Quiz = mongoose.model('Quiz', quizSchema);

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // find a quiz
    const quiz = await Quiz.findOne();
    console.log("Found quiz:", quiz ? quiz._id : null, "with", quiz ? quiz.questions.length : 0, "questions");

    if (quiz) {
        const randomQuestions = await Quiz.aggregate([
            { $match: { _id: quiz._id } },
            { $unwind: "$questions" },
            { $sample: { size: 5 } },
            { $group: { _id: "$_id", courseId: { $first: "$courseId" }, questions: { $push: "$questions" } } }
        ]);
        console.log("Random questions:", JSON.stringify(randomQuestions, null, 2));
    }

    process.exit(0);
})();
