import Course from './models/Course.model.js';
import Quiz from './models/Quiz.model.js';
import { logger } from './utils/logger.js';

const coursesData = [
    {
        title: "Basic Electrical",
        description: "Learn fundamental electrical concepts, wiring, and safety procedures essential for any aspiring electrician.",
        category: "electrical",
        level: "Beginner",
        isPublished: true,
        isActive: true,
        thumbnail: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=2669",
        youtubePlaylist: "https://www.youtube.com/playlist?list=PLWv9VM947MKi_7yJ0_FCjzTBXcb0bFR59" // Example
    },
    {
        title: "Basic Plumbing",
        description: "Master the essentials of plumbing systems, pipe fitting, and maintenance for residential and commercial applications.",
        category: "plumbing",
        level: "Beginner",
        isPublished: true,
        isActive: true,
        thumbnail: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=2670",
        youtubePlaylist: "https://www.youtube.com/playlist?list=PLWv9VM947MKi_7yJ0_FCjzTBXcb0bFR59" // Example
    },
    {
        title: "Computer Skills",
        description: "Develop essential computer literacy, software proficiency, and digital communication skills for the modern workplace.",
        category: "computer",
        level: "Beginner",
        isPublished: true,
        isActive: true,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2670",
        youtubePlaylist: "https://www.youtube.com/playlist?list=PLWv9VM947MKi_7yJ0_FCjzTBXcb0bFR59" // Example
    },
    {
        title: "English Language Skills",
        description: "Improve your professional English communication, both written and spoken, to excel in diverse work environments.",
        category: "english",
        level: "Beginner",
        isPublished: true,
        isActive: true,
        thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2670",
        youtubePlaylist: "https://www.youtube.com/playlist?list=PLWv9VM947MKi_7yJ0_FCjzTBXcb0bFR59" // Example
    }
];

// Sample Quiz data (Pool of > 5 questions for each to test the $sample functionality)
const quizzesData = {
    electrical: [
        { questionText: "What does AC stand for in electricity?", options: [{ text: "Alternating Current", isCorrect: true }, { text: "Active Current", isCorrect: false }, { text: "Ampere Current", isCorrect: false }, { text: "Actual Charge", isCorrect: false }] },
        { questionText: "What is the unit of electrical resistance?", options: [{ text: "Ohm", isCorrect: true }, { text: "Volt", isCorrect: false }, { text: "Ampere", isCorrect: false }, { text: "Watt", isCorrect: false }] },
        { questionText: "Which instrument is used to measure electrical current?", options: [{ text: "Ammeter", isCorrect: true }, { text: "Voltmeter", isCorrect: false }, { text: "Ohmmeter", isCorrect: false }, { text: "Barometer", isCorrect: false }] },
        { questionText: "What color wire is typically used for ground in the US?", options: [{ text: "Green or bare", isCorrect: true }, { text: "Black", isCorrect: false }, { text: "White", isCorrect: false }, { text: "Red", isCorrect: false }] },
        { questionText: "Which device breaks a circuit during an overload?", options: [{ text: "Circuit breaker", isCorrect: true }, { text: "Resistor", isCorrect: false }, { text: "Capacitor", isCorrect: false }, { text: "Transformer", isCorrect: false }] },
        { questionText: "What does DC stand for?", options: [{ text: "Direct Current", isCorrect: true }, { text: "Dual Current", isCorrect: false }, { text: "Data Cable", isCorrect: false }, { text: "Direct Charge", isCorrect: false }] },
        { questionText: "V=IR is known as?", options: [{ text: "Ohm's Law", isCorrect: true }, { text: "Faraday's Law", isCorrect: false }, { text: "Newton's Law", isCorrect: false }, { text: "Coulomb's Law", isCorrect: false }] }
    ],
    plumbing: [
        { questionText: "What material is commonly used for modern residential water supply pipes?", options: [{ text: "PEX", isCorrect: true }, { text: "Lead", isCorrect: false }, { text: "Cast Iron", isCorrect: false }, { text: "Galvanized Steel", isCorrect: false }] },
        { questionText: "What is the purpose of a P-trap?", options: [{ text: "To prevent sewer gases from entering the building", isCorrect: true }, { text: "To catch solid objects", isCorrect: false }, { text: "To increase water pressure", isCorrect: false }, { text: "To filter water", isCorrect: false }] },
        { questionText: "Which tool is best for tightening pipes without scratching them?", options: [{ text: "Strap wrench", isCorrect: true }, { text: "Pipe wrench", isCorrect: false }, { text: "Pliers", isCorrect: false }, { text: "Screwdriver", isCorrect: false }] },
        { questionText: "What is PVC primarily used for in plumbing?", options: [{ text: "Drainage and venting", isCorrect: true }, { text: "Hot water supply", isCorrect: false }, { text: "Gas lines", isCorrect: false }, { text: "High-pressure systems", isCorrect: false }] },
        { questionText: "What stops a toilet tank from overflowing?", options: [{ text: "Float ball and fill valve", isCorrect: true }, { text: "Flapper", isCorrect: false }, { text: "Overflow tube", isCorrect: false }, { text: "Handle", isCorrect: false }] },
        { questionText: "What substance is used to seal threaded pipe joints?", options: [{ text: "Teflon tape / pipe dope", isCorrect: true }, { text: "Duct tape", isCorrect: false }, { text: "Super glue", isCorrect: false }, { text: "Caulk", isCorrect: false }] }
    ],
    computer: [
        { questionText: "What does CPU stand for?", options: [{ text: "Central Processing Unit", isCorrect: true }, { text: "Computer Personal Unit", isCorrect: false }, { text: "Central Print Unit", isCorrect: false }, { text: "Control Process Unit", isCorrect: false }] },
        { questionText: "Which of these is considered volatile memory?", options: [{ text: "RAM", isCorrect: true }, { text: "Hard Drive", isCorrect: false }, { text: "ROM", isCorrect: false }, { text: "SSD", isCorrect: false }] },
        { questionText: "What is an IP address?", options: [{ text: "A unique network identifier", isCorrect: true }, { text: "A computer's physical location", isCorrect: false }, { text: "A type of firewall", isCorrect: false }, { text: "An operating system", isCorrect: false }] },
        { questionText: "Which shortcut typically copies selected text?", options: [{ text: "Ctrl+C", isCorrect: true }, { text: "Ctrl+V", isCorrect: false }, { text: "Ctrl+X", isCorrect: false }, { text: "Ctrl+P", isCorrect: false }] },
        { questionText: "What does HTML stand for?", options: [{ text: "HyperText Markup Language", isCorrect: true }, { text: "HyperText Machine Language", isCorrect: false }, { text: "HighTech Modern Logic", isCorrect: false }, { text: "Hyperlink Text Modules", isCorrect: false }] },
        { questionText: "Which of these is an operating system?", options: [{ text: "Linux", isCorrect: true }, { text: "Microsoft Word", isCorrect: false }, { text: "Google Chrome", isCorrect: false }, { text: "Java", isCorrect: false }] }
    ],
    english: [
        { questionText: "Which of the following is a synonym for 'fast'?", options: [{ text: "Quick", isCorrect: true }, { text: "Slow", isCorrect: false }, { text: "Lethargic", isCorrect: false }, { text: "Sluggish", isCorrect: false }] },
        { questionText: "Choose the correct sentence:", options: [{ text: "They're going to the store.", isCorrect: true }, { text: "Their going to the store.", isCorrect: false }, { text: "There going to the store.", isCorrect: false }, { text: "They going to the store.", isCorrect: false }] },
        { questionText: "What is an antonym for 'brave'?", options: [{ text: "Cowardly", isCorrect: true }, { text: "Courageous", isCorrect: false }, { text: "Fearless", isCorrect: false }, { text: "Valiant", isCorrect: false }] },
        { questionText: "Identify the noun in this sentence: 'The red car sped away.'", options: [{ text: "car", isCorrect: true }, { text: "red", isCorrect: false }, { text: "sped", isCorrect: false }, { text: "away", isCorrect: false }] },
        { questionText: "Which punctuation mark ends a question?", options: [{ text: "?", isCorrect: true }, { text: ".", isCorrect: false }, { text: "!", isCorrect: false }, { text: ",", isCorrect: false }] },
        { questionText: "Choose the correct spelling:", options: [{ text: "Receive", isCorrect: true }, { text: "Recieve", isCorrect: false }, { text: "Receve", isCorrect: false }, { text: "Receipt", isCorrect: false }] }
    ]
};

const seedDatabase = async () => {
    try {
        const count = await Course.countDocuments();
        if (count === 0) {
            logger.info("No courses found in DB. Seeding initial courses and quizzes...");
            for (let courseData of coursesData) {
                // Insert Course
                const course = new Course(courseData);
                const savedCourse = await course.save();
                logger.info(`Seeded Course: ${savedCourse.title}`);

                // Insert Quiz for the Course
                if (quizzesData[courseData.category]) {
                    const quiz = new Quiz({
                        courseId: savedCourse._id,
                        questions: quizzesData[courseData.category]
                    });
                    await quiz.save();
                    logger.info(`Seeded Quiz for: ${savedCourse.title}`);
                }
            }
            logger.info("Database seeded successfully.");
        }
    } catch (error) {
        logger.error("Error seeding database:", error);
    }
};

export default seedDatabase;
