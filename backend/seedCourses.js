
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.model.js';
import Lesson from './models/Lesson.model.js';
import fs from 'fs';
import coursesData from './data/courses.js';

dotenv.config();

const log = (msg) => {
    console.log(msg);
    try {
        fs.appendFileSync('seed_log.txt', msg + '\n');
    } catch (e) { }
};

const getVideoId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
};

const seedCourses = async () => {
    try {
        fs.writeFileSync('seed_log.txt', 'Starting data seed...\n');

        // Use CamelCase UpRise matching existing DB
        const uri = "mongodb://127.0.0.1:27017/UpRise";

        log(`Connecting to ${uri}...`);
        await mongoose.connect(uri);
        log("Connected to DB");

        // Clear existing data
        await Lesson.deleteMany({});
        log("Cleared existing lessons");
        await Course.deleteMany({});
        log("Cleared existing courses");

        // Iterate over the courses object
        // Object.values(coursesData) gives us the array of course objects
        const coursesList = Object.values(coursesData);

        for (const courseData of coursesList) {
            try {
                // Create Course first (without lessons array initially)
                // Map fields from data to model
                const newCourse = new Course({
                    title: courseData.title,
                    description: courseData.description,
                    category: courseData.id, // Using id as category roughly maps (electrical, plumbing etc) -> adjust casing if needed?
                    // The model expects category capitalized preferably? logic in frontend looked for lowercase match in getIcon but model has no enum.
                    // Let's Capitalize it for display niceness if needed, or keep as is. Use Title Case for category?
                    // "electrical" -> "Electrical"
                    level: "Beginner", // Defaulting as data doesn't have it
                    thumbnail: courseData.thumbnail,
                    isPublished: true,
                    isActive: true
                });

                // Capitalize category
                newCourse.category = newCourse.category.charAt(0).toUpperCase() + newCourse.category.slice(1);

                const savedCourse = await newCourse.save();
                log(`Created Course: ${savedCourse.title}`);

                // Create Lessons
                if (courseData.lessons && courseData.lessons.length > 0) {
                    const lessonIds = [];
                    for (let i = 0; i < courseData.lessons.length; i++) {
                        const lessonItem = courseData.lessons[i];
                        const newLesson = new Lesson({
                            title: lessonItem.title,
                            youtubeVideoId: getVideoId(lessonItem.videoUrl),
                            order: i + 1,
                            course: savedCourse._id,
                            duration: lessonItem.duration || "00:00",
                            content: ""
                        });
                        const savedLesson = await newLesson.save();
                        lessonIds.push(savedLesson._id);
                        log(`  - Added Lesson: ${savedLesson.title}`);
                    }

                    // Update Course with lesson IDs
                    savedCourse.lessons = lessonIds;
                    await savedCourse.save();
                }

            } catch (err) {
                log(`Failed to create course ${courseData.title}: ${err.message}`);
                if (err.errors) {
                    Object.keys(err.errors).forEach(key => {
                        log(`- ${key}: ${err.errors[key].message}`);
                    });
                }
            }
        }

        log(`Seeding finished.`);

        const courseCount = await Course.countDocuments();
        const lessonCount = await Lesson.countDocuments();
        log(`FINAL COUNTS - Courses: ${courseCount}, Lessons: ${lessonCount}`);

        process.exit();
    } catch (error) {
        log(`General Error: ${error}`);
        process.exit(1);
    }
};

seedCourses();
