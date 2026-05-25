import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { PlayCircle, CheckCircle, Lock, Trophy, Award, ArrowLeft } from 'lucide-react';

import coursesData from '../data/courses';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [courseTitle, setCourseTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load Completion Status specific to THIS course
    const [completedLessonIds, setCompletedLessonIds] = useState([]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await api.get(`/courses/${courseId}`);
                console.log("Course fetched:", response.data);

                let fetchedLessons = response.data.lessons || [];

                // Fallback to static data if no lessons found from API
                if (fetchedLessons.length === 0 && response.data.category) {
                    const categoryKey = response.data.category.toLowerCase();
                    if (coursesData[categoryKey]) {
                        console.log("Using static fallback data for lessons");
                        fetchedLessons = coursesData[categoryKey].lessons.map(l => ({
                            ...l,
                            // Ensure compatibility
                            youtubeVideoId: l.videoUrl, // Map videoUrl to youtubeVideoId expected by components
                            _id: l._id // Keep static IDs
                        }));
                    }
                }

                setLessons(fetchedLessons);
                setCourseTitle(response.data.title || "Course");

                // Get current user to namespace local storage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const userId = user._id || user.id;

                // Set completion status from backend if available, else localStorage
                if (response.data.completedLessonIds && Array.isArray(response.data.completedLessonIds)) {
                    // Convert to strings to ensure matching
                    const backendCompleted = response.data.completedLessonIds.map(id => String(id));

                    // Merge with local storage to be safe (if offline progress happened)
                    // Use USER-SPECIFIC key
                    let stored = [];
                    if (userId) {
                        stored = JSON.parse(localStorage.getItem(`completed_${userId}_${courseId}`) || '[]');
                    }
                    const merged = [...new Set([...backendCompleted, ...stored])];
                    setCompletedLessonIds(merged);
                } else {
                    let stored = [];
                    if (userId) {
                        stored = JSON.parse(localStorage.getItem(`completed_${userId}_${courseId}`) || '[]');
                    }
                    setCompletedLessonIds(stored);
                }

            } catch (error) {
                console.error("Failed to fetch course", error);
                navigate('/'); // Redirect on error
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, navigate]);

    const allLessonsCompleted = lessons.length > 0 && lessons.every(l => completedLessonIds.includes(String(l._id)));

    if (loading) {
        return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading Course...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Courses
                </button>

                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-2">
                        {courseTitle}
                    </h1>
                    <p className="text-gray-400">Complete all {lessons.length} lessons to unlock the certification quiz.</p>
                </header>

                <div className="grid gap-4 mb-12">
                    {lessons.map((lesson, index) => {
                        const isCompleted = completedLessonIds.includes(lesson._id);
                        // Unlock all for dev/preview so user can click any video
                        // const isLocked = index > 0 && !completedLessonIds.includes(lessons[index - 1]._id);
                        const isLocked = false;

                        return (
                            <div
                                key={lesson._id}
                                className={`p-5 rounded-xl border transition-all duration-300 flex items-center justify-between
                            ${isLocked
                                        ? 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed'
                                        : 'bg-gray-900 border-gray-700 hover:border-blue-500 hover:bg-gray-800 cursor-pointer'
                                    }`}
                                onClick={() => !isLocked && navigate(`/course/${courseId}/lesson/${lesson._id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 font-mono text-sm">{(index + 1).toString().padStart(2, '0')}</span>
                                    <div>
                                        <h3 className={`font-bold ${isCompleted ? 'text-green-400 line-through decoration-green-500/50' : 'text-gray-100'}`}>
                                            {lesson.title}
                                        </h3>
                                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                                    </div>
                                </div>

                                <div>
                                    {isCompleted ? <CheckCircle className="text-green-500" size={20} /> :
                                        isLocked ? <Lock className="text-gray-600" size={18} /> :
                                            <PlayCircle className="text-blue-500" size={20} />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* QUIZ SECTION - LOCKED UNTIL COMPLETION */}
                <div className={`rounded-2xl border-2 p-8 text-center transition-all duration-500
             ${allLessonsCompleted
                        ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'bg-gray-900 border-gray-800 opacity-60'}`}>

                    <Trophy className={`w-12 h-12 mx-auto mb-4 ${allLessonsCompleted ? 'text-yellow-400 animate-bounce' : 'text-gray-600'}`} />

                    <h2 className="text-2xl font-bold text-white mb-2">Final Certification Quiz</h2>
                    <p className="text-gray-400 mb-6">
                        {allLessonsCompleted
                            ? "Congratulations! You've unlocked the quiz. Score 50% or higher to get certified."
                            : "Complete all lessons above to unlock the quiz."}
                    </p>

                    {allLessonsCompleted ? (
                        <button
                            onClick={() => navigate(`/course/${courseId}/quiz`)}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105"
                        >
                            Start Quiz
                        </button>
                    ) : (
                        <button
                            disabled
                            className="px-8 py-3 bg-gray-800 text-gray-500 rounded-lg font-bold cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                            <Lock size={16} /> Locked
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
