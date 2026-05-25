import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Course from './models/Course.model.js';
import Quiz from './models/Quiz.model.js';

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const courses = await Course.find();
    console.log("Total courses:", courses.length);
    for (let c of courses) {
        console.log(`Course: ${c.title} (ID: ${c._id})`);
        const quiz = await Quiz.findOne({ courseId: c._id });
        if (quiz) {
            console.log(`  - Quiz found with ${quiz.questions.length} questions`);
        } else {
            console.log(`  - NO QUIZ FOUND`);
        }
    }

    process.exit(0);
})();
