import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, GraduationCap, Zap, Wrench, Languages, Monitor } from 'lucide-react';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                setCourses(response.data.data);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const getIcon = (id) => {
        switch (id) {
            case 'electrical': return <Zap className="w-8 h-8 text-yellow-500" />;
            case 'plumbing': return <Wrench className="w-8 h-8 text-blue-500" />;
            case 'english': return <Languages className="w-8 h-8 text-red-500" />;
            case 'computer': return <Monitor className="w-8 h-8 text-green-500" />;
            default: return <BookOpen className="w-8 h-8 text-purple-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-800 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 text-center">
                    <div className="inline-block p-3 rounded-full bg-blue-900/30 mb-4 border border-blue-500/30">
                        <BookOpen className="w-10 h-10 text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Available Courses
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Browse our library of trade skills and start learning today.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="group relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 opacity-60"></div>
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                {/* Category Icon Badge */}
                                <div className="absolute top-3 right-3 z-20">
                                    <div className="bg-gray-950/40 backdrop-blur-md border border-white/10 p-2 rounded-xl shadow-lg ring-1 ring-white/5">
                                        {React.cloneElement(getIcon(course.id), { className: getIcon(course.id).props.className.replace('w-8 h-8', 'w-5 h-5') })}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-grow relative">
                                <h3 className="text-xl font-bold text-white mb-3 mt-2 group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h3>

                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-8 flex-grow">
                                    {course.description}
                                </p>

                                <button
                                    className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 hover:shadow-blue-500/40 transition-all duration-300 transform group-hover:scale-[1.02] flex items-center justify-center gap-2 tracking-wide"
                                >
                                    START LEARNING
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseList;
