import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, PlayCircle, BookOpen, Clock, Star, TrendingUp, Zap, Wrench, Languages, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

import coursesData from '../data/courses';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getIcon = (id) => {
        // Safe check if id is null or undefined
        const safeId = id ? id.toString() : '';
        switch (safeId) {
            case 'electrical': return <Zap className="w-8 h-8 text-yellow-500" />;
            case 'plumbing': return <Wrench className="w-8 h-8 text-blue-500" />;
            case 'english': return <Languages className="w-8 h-8 text-red-500" />;
            case 'computer': return <Monitor className="w-8 h-8 text-green-500" />;
            default: return <BookOpen className="w-8 h-8 text-purple-500" />;
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                let fetchedCourses = response.data || [];

                if (fetchedCourses.length === 0) {
                    console.log("Using static data for courses");
                    // Convert object to array and ensure _id matches what we need
                    fetchedCourses = Object.values(coursesData).map(c => ({
                        ...c,
                        _id: c._id || `static_${c.id}`, // Ensure an ID exists
                        lessons: c.lessons // Keep lessons
                    }));
                } else {
                    // Populate lessons length from static data if backend sends empty lessons array
                    fetchedCourses = fetchedCourses.map(course => {
                        if ((!course.lessons || course.lessons.length === 0) && course.category) {
                            const catKey = course.category.toLowerCase();
                            if (coursesData[catKey] && coursesData[catKey].lessons) {
                                course.lessons = coursesData[catKey].lessons;
                            }
                        }
                        return course;
                    });
                }

                setCourses(fetchedCourses);
            } catch (err) {
                console.error('Error fetching courses:', err);
                // Fallback on error too
                console.log("Using static data for courses (on error)");
                const staticCourses = Object.values(coursesData).map(c => ({
                    ...c,
                    _id: c._id || `static_${c.id}`,
                    lessons: c.lessons
                }));
                setCourses(staticCourses);
                // Don't show error to user if we have fallback
                // setError('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition font-medium"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
                {/* Hero Section */}
                <header className="mb-20 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in-up">
                        <Star className="w-3 h-3 fill-blue-400" />
                        Skills for the Future
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Courses</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                        Explore our comprehensive library of trade skills and professional development courses designed to elevate your career.
                    </p>
                </header>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            onClick={() => navigate(`/course/${course._id}`)}
                            className="group relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 opacity-60"></div>
                                <img
                                    src={course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2670"}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2670"; }}
                                />
                                {/* Category Icon Badge */}
                                <div className="absolute top-3 right-3 z-20">
                                    <div className="bg-gray-950/40 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-lg ring-1 ring-white/5">
                                        {React.cloneElement(getIcon(course.category ? course.category.toLowerCase() : ''), { className: getIcon(course.category).props.className.replace('w-8 h-8', 'w-5 h-5') })}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-grow relative">
                                <h3 className="text-xl font-bold text-white mb-3 mt-2 group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h3>

                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
                                    {course.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800/50">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium bg-gray-950/50 px-3 py-1.5 rounded-lg border border-gray-800">
                                        <BookOpen className="w-4 h-4 text-blue-400" />
                                        <span>{course.lessons?.length || 0} Lessons</span>
                                    </div>

                                    <button
                                        className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-blue-900/40 hover:shadow-blue-500/40 transition-all duration-300 transform group-hover:scale-105 flex items-center gap-2"
                                    >
                                        Start
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;
