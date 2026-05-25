
import mongoose from 'mongoose';
import Course from './models/Course.model.js';

// Skip dotenv to rely on hardcoded URI for debugging
const checkCourses = async () => {
    try {
        const uri = "mongodb://127.0.0.1:27017/UpRise"; // CamelCase
        console.log(`Connecting to ${uri}...`);
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses in UpRise.`);
        courses.forEach(c => {
            console.log(`- ${c.title}`);
        });

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkCourses();
