import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import YouTubePlayer from '../components/YouTubePlayer';
import { ArrowLeft } from 'lucide-react';

import coursesData from '../data/courses';

const Lesson = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nextLessonId, setNextLessonId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await api.get(`/courses/${courseId}`);
                // response.data is the course, .lessons is the array
                let lessons = response.data.lessons || [];

                // Fallback check
                if (lessons.length === 0 && response.data.category) {
                    const categoryKey = response.data.category.toLowerCase();
                    if (coursesData[categoryKey]) {
                        lessons = coursesData[categoryKey].lessons.map(l => ({
                            ...l,
                            youtubeVideoId: l.videoUrl // Ensure mapping
                        }));
                    }
                }

                const foundIndex = lessons.findIndex(l => String(l._id) === String(lessonId));
                if (foundIndex !== -1) {
                    setLesson(lessons[foundIndex]);
                    // Determine next lesson
                    if (foundIndex + 1 < lessons.length) {
                        setNextLessonId(lessons[foundIndex + 1]._id);
                    } else {
                        setNextLessonId(null);
                    }
                } else {
                    console.warn(`Lesson ${lessonId} not found in course ${courseId}. Available:`, lessons.map(l => l._id));
                    navigate(`/course/${courseId}`);
                }
            } catch (error) {
                console.error("Error fetching lesson", error);
                setError("Failed to load lesson. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [courseId, lessonId, navigate]);

    const handleLessonComplete = async () => {
        try {
            // FIXED: Correct route is /courses/:id/lessons/:lessonId/complete
            await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);

            // Update local storage for THIS COURSE AND USER
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user._id || user.id;

            if (userId) {
                const key = `completed_${userId}_${courseId}`;
                const stored = JSON.parse(localStorage.getItem(key) || '[]');
                if (!stored.includes(lessonId)) {
                    localStorage.setItem(key, JSON.stringify([...stored, lessonId]));
                }
            }


            if (nextLessonId) {
                navigate(`/course/${courseId}/lesson/${nextLessonId}`);
            } else {
                // Last lesson completed -> Go to Quiz
                navigate(`/course/${courseId}/quiz`);
            }
        } catch (error) {
            console.error("Failed to complete lesson", error);
            // Even if API fails, try local nav
            if (nextLessonId) {
                navigate(`/course/${courseId}/lesson/${nextLessonId}`);
            } else {
                // Last lesson fallback -> Go to Quiz
                navigate(`/course/${courseId}/quiz`);
            }
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Loading Lesson...</div>;
    if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;
    if (!lesson) return <div className="text-white text-center mt-20">Lesson not found.</div>;

    // Model stores youtubeVideoId, assume it might be a full URL or just ID.
    // If it's a full URL, we parse it. If it's an ID, we use it.
    // Helper to extract YouTube ID from various URL formats
    const getVideoId = (urlOrId) => {
        if (!urlOrId) return '';

        // Regex to match YouTube URL patterns
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = urlOrId.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        }

        // If no URL match, assume it's a direct ID if it looks like one (approx length)
        // or return as-is as a fallback
        return urlOrId;
    };

    const videoId = getVideoId(lesson.youtubeVideoId);
    console.log("Playing Video ID:", videoId, "from URL:", lesson.youtubeVideoId);

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Lesson List
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                            <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                Video Lesson
                            </span>
                        </div>

                        {videoId ? (
                            <YouTubePlayer videoId={videoId} onEnd={handleLessonComplete} />
                        ) : (
                            <div className="aspect-video bg-gray-800 flex items-center justify-center rounded-xl">Video Unavailable</div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-6">
                            <h3 className="font-bold text-lg mb-4 text-gray-200">Instructions</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Watch the entire video to automatically mark this lesson as complete.
                            </p>

                            {/* Dev Tool: Skip Button */}
                            <button
                                onClick={handleLessonComplete}
                                className="w-full py-2 bg-purple-900/40 border border-purple-500/30 text-purple-300 rounded hover:bg-purple-900/60 transition-colors text-sm font-mono"
                            >
                                [DEV] Skip Video
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lesson;

