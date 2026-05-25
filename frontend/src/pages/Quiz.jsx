import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Award, Loader } from 'lucide-react';
import { courses } from '../data/quiz';
import api from '../api/axios';

const Quiz = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [passed, setPassed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [certificate, setCertificate] = useState(null);

    const loadQuiz = async () => {
        setLoading(true);
        try {
            // Fetch dynamically randomized quiz from backend
            const response = await api.get(`/quiz/${courseId}`);
            
            // Format expected by UI:
            // response.data.questions is an array of questions.
            // Add a title based on the API response or static data fallback
            const quizTitle = response.data.title || courses[courseId]?.title || "Course Quiz";
            
            setQuizData({
                title: quizTitle,
                questions: response.data.questions
            });
            setError(null);
        } catch (err) {
            console.error("Failed to load quiz from API:", err);
            // Fallback: try to load directly from params if it happens to be a static key
            if (courses[courseId]?.quiz) {
                setQuizData(courses[courseId].quiz);
            } else {
                setError(err.response?.data?.message || "Quiz not found for this course.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuiz();
    }, [courseId]);

    const handleOptionSelect = (questionId, optionIndex) => {
        if (submitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const calculateScore = () => {
        let correctCount = 0;
        quizData.questions.forEach(q => {
            const selectedOptionIndex = answers[q._id];
            if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex].isCorrect) {
                correctCount++;
            }
        });
        return correctCount;
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < quizData.questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setLoading(true);
        try {
            const correctCount = calculateScore();
            const totalQuestions = quizData.questions.length;

            // Send result to backend
            const response = await api.post('/quiz/submit', {
                courseId,
                score: correctCount,
                totalQuestions
            });

            setScore(correctCount);
            setPassed(response.data.data.passed);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to submit quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCertificate = async () => {
        setLoading(true);
        try {
            const courseName = courses[courseId]?.title || courseId;
            const response = await api.post('/certificates/generate', {
                courseId,
                courseName
            });
            const certData = response.data.data;
            setCertificate(certData);

            // Navigate to certificate view
            navigate(`/course/${courseId}/certificate`, {
                state: { certificate: certData }
            });

        } catch (err) {
            // If already exists (409), handle gracefully
            if (err.response?.status === 409) {
                const existingCert = err.response.data.data;
                setCertificate(existingCert);
                // Navigate to certificate view with existing data
                navigate(`/course/${courseId}/certificate`, {
                    state: { certificate: existingCert }
                });
            } else {
                console.error(err);
                setError(err.response?.data?.message || "Failed to generate certificate.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center flex-col p-4">
                <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-800 rounded hover:bg-gray-700">
                    Go Back
                </button>
            </div>
        );
    }

    if (!quizData) {
        return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Loading Quiz...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 font-sans">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Course
                </button>

                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold mb-2">{quizData.title}</h1>
                    <p className="text-gray-400">Answer all questions correctly to get certified.</p>
                </header>

                <div className="space-y-8">
                    {quizData.questions.map((q, qIndex) => (
                        <div key={q._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                <span className="text-blue-500 mr-2">{qIndex + 1}.</span>
                                {q.questionText}
                            </h3>
                            <div className="space-y-3">
                                {q.options.map((option, oIndex) => {
                                    const isSelected = answers[q._id] === oIndex;
                                    let optionClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ";

                                    if (submitted) {
                                        if (option.isCorrect) {
                                            optionClass += "bg-green-900/30 border-green-500/50 text-green-200";
                                        } else if (isSelected && !option.isCorrect) {
                                            optionClass += "bg-red-900/30 border-red-500/50 text-red-200";
                                        } else {
                                            optionClass += "bg-gray-800/50 border-gray-700 opacity-50";
                                        }
                                    } else {
                                        if (isSelected) {
                                            optionClass += "bg-blue-900/30 border-blue-500 text-blue-200";
                                        } else {
                                            optionClass += "bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600";
                                        }
                                    }

                                    return (
                                        <button
                                            key={oIndex}
                                            onClick={() => handleOptionSelect(q._id, oIndex)}
                                            disabled={submitted}
                                            className={optionClass}
                                        >
                                            <span>{option.text}</span>
                                            {submitted && option.isCorrect && <CheckCircle size={18} className="text-green-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 mb-20 text-center">
                    {!submitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                            {loading ? <Loader className="animate-spin" /> : "Submit Quiz"}
                        </button>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 inline-block min-w-[300px]">
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Your Score</h3>
                                <div className="text-5xl font-extrabold mb-2">
                                    <span className={passed ? "text-green-400" : "text-red-400"}>
                                        {Math.round((score / quizData.questions.length) * 100)}%
                                    </span>
                                </div>
                                <p className={passed ? "text-green-400" : "text-red-400"}>
                                    {passed ? "You Passed!" : "Please try again"}
                                </p>
                            </div>

                            {passed && !certificate && (
                                <div>
                                    <button
                                        onClick={handleGenerateCertificate}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-yellow-500/25 transition-all flex items-center gap-2 mx-auto"
                                    >
                                        <Award size={24} />
                                        {loading ? "Generating..." : "Get Certificate"}
                                    </button>
                                </div>
                            )}

                            {certificate && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg text-green-300">
                                        Certificate Issued: {certificate.certificateId}
                                    </div>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        View in Profile
                                    </button>
                                </div>
                            )}

                            {!passed && (
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setScore(null);
                                        setAnswers({});
                                        window.scrollTo(0, 0);
                                        // Refetch to get newly randomized questions
                                        setQuizData(null);
                                        loadQuiz();
                                    }}
                                    className="text-gray-400 hover:text-white underline mt-4"
                                >
                                    Retake Quiz
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
