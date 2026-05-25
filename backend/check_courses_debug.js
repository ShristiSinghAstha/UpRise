
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.model.js';

dotenv.config();

const checkCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/uprise");
        console.log("Connected to DB");

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses.`);
        courses.forEach(c => {
            console.log(`- ${c.title} (isActive: ${c.isActive}) (isPublished: ${c.isPublished})`);
        });

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkCourses();
