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
    
    // create fake quiz with 1 question
    const fakeId = new mongoose.Types.ObjectId();
    const fakeQuiz = new Quiz({
        courseId: fakeId,
        questions: [{ questionText: 'Q1', options: [{text: 'A', isCorrect: true}, {text: 'B', isCorrect: false}] }]
    });
    await fakeQuiz.save();

    const randomQuestions = await Quiz.aggregate([
        { $match: { _id: fakeQuiz._id } },
        { $unwind: "$questions" },
        { $sample: { size: 5 } },
        { $group: { _id: "$_id", courseId: { $first: "$courseId" }, questions: { $push: "$questions" } } }
    ]);
    console.log("Random questions:", JSON.stringify(randomQuestions, null, 2));

    await Quiz.deleteOne({ _id: fakeQuiz._id });
    process.exit(0);
})();
