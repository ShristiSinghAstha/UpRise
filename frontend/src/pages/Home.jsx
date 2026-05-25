import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Smartphone } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 mb-8 animate-fade-in-up">
                            <Star className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Master New Skills Today</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                            Build Your Future With Practical Skills
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            Master essential trades and professional skills through our interactive, video-based learning platform. Get certified and ready for the workforce.
                        </p>
                        
                        {/* Main CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
                            <Link
                                to="/login"
                                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20 flex items-center"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link
                                to="/courses"
                                className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg transition-all transform hover:scale-105 border border-gray-700 flex items-center"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Choose UpRise?</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Our platform is designed to help you gain practical skills that matter in today's job market
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-blue-900/20 flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Industry Certified</h3>
                        <p className="text-gray-400">Our content is verified by industry experts to ensure you learn the most current standards.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-purple-900/20 flex items-center justify-center mb-6">
                            <Smartphone className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Learn Anywhere</h3>
                        <p className="text-gray-400">Access high-quality video lessons on any device, anytime, at your own pace.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 hover:border-green-500/50 transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-green-900/20 flex items-center justify-center mb-6">
                            <Star className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Skill Completion</h3>
                        <p className="text-gray-400">Earn certificates upon completion of courses to showcase your new skills.</p>
                    </div>
                </div>
            </div>

            {/* Final CTA Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-12 text-center border border-gray-800">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of learners who are already building their futures with UpRise
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            to="/register"
                            className="px-8 py-4 rounded-xl bg-white text-gray-900 font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 rounded-xl bg-transparent text-white font-bold text-lg transition-all border border-gray-700 hover:bg-gray-800 flex items-center"
                        >
                            I Have an Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;