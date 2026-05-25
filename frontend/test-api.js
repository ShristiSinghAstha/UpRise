import axios from 'axios';
(async () => {
    try {
        const loginRes = await axios.post('https://uprise-a-skill-learning-platform.onrender.com/api/v1/admin/login', {
            email: 'admin@uprise.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log("Logged in");

        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const courseId = '69f34cb090130c78d2ec1de0'; // 'designing' course
        const res = await axios.post(`https://uprise-a-skill-learning-platform.onrender.com/api/v1/quiz/admin/${courseId}/questions`, {
            questionText: "What is design?",
            options: [
                { text: "Art", isCorrect: true },
                { text: "Science", isCorrect: false },
                { text: "Math", isCorrect: false },
                { text: "History", isCorrect: false }
            ],
            correctAnswer: "Art"
        }, config);
        
        console.log("Question added!", res.status);
    } catch (e) {
        console.error("Error:", e.response ? JSON.stringify(e.response.data) : e.message);
    }
})();
