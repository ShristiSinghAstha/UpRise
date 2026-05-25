import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { BookOpen, Save, Plus, Trash2, Youtube, Image, CheckCircle, Circle, ArrowLeft, HelpCircle } from 'lucide-react';

export default function CourseEditor() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const isEdit = !!courseId;
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [formData, setFormData] = useState({
        title: '', 
        description: '', 
        category: '', 
        level: 'Beginner', 
        thumbnail: '', 
        isPublished: false
    });
    const [lessons, setLessons] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // New Lesson State
    const [newLesson, setNewLesson] = useState({ 
        title: '', 
        youtubeVideoId: '', 
        order: 0, 
        duration: '' 
    });

    // Quiz State
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: ''
    });

    useEffect(() => {
        // Fetch categories for dropdown
        api.get('/categories')
            .then(({ data }) => setCategories(data))
            .catch(err => {
                console.error("Failed to load categories", err);
                alert("Failed to load categories");
            });

        if (isEdit) {
            setLoading(true);
            Promise.all([
                api.get(`/courses/${courseId}`, config),
                api.get(`/quiz/admin/${courseId}`, config).catch(() => ({ data: { questions: [] } }))
            ])
                .then(([courseRes, quizRes]) => {
                    const data = courseRes.data;
                    setFormData({
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        level: data.level,
                        thumbnail: data.thumbnail || '',
                        isPublished: data.isPublished
                    });
                    setLessons(data.lessons || []);
                    setNewLesson(prev => ({ 
                        ...prev, 
                        order: (data.lessons?.length || 0) + 1 
                    }));
                    setQuestions(quizRes.data.questions || []);
                })
                .catch(err => {
                    console.error("Failed to load course", err);
                    alert("Failed to load course");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [courseId, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/courses/${courseId}`, formData, config);
                alert("Course updated successfully!");
            } else {
                const { data } = await api.post('/courses', formData, config);
                alert("Course created successfully!");
                navigate(`/admin/courses/edit/${data._id}`); // Redirect to edit mode to add lessons
            }
        } catch (err) {
            console.error("Save failed", err);
            alert("Save failed: " + (err.response?.data?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        if (!isEdit) return alert("Save course first!");
        if (!newLesson.title || !newLesson.youtubeVideoId) {
            return alert("Please fill in all required lesson fields");
        }
        
        setLoading(true);
        try {
            const { data } = await api.post('/lessons', {
                ...newLesson,
                course: courseId
            }, config);
            setLessons([...lessons, data]);
            setNewLesson({ 
                title: '', 
                youtubeVideoId: '', 
                order: lessons.length + 2, 
                duration: '' 
            });
            alert("Lesson added successfully!");
        } catch (err) {
            console.error("Failed to add lesson", err);
            alert("Failed to add lesson: " + (err.response?.data?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) return;
        setLoading(true);
        try {
            await api.delete(`/lessons/${lessonId}`, config);
            setLessons(lessons.filter(l => l._id !== lessonId));
            alert("Lesson deleted successfully!");
        } catch (err) {
            console.error("Failed to delete lesson", err);
            alert("Failed to delete lesson: " + (err.response?.data?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!isEdit) return alert("Save course first!");
        
        if (!newQuestion.questionText || newQuestion.options.some(opt => !opt) || !newQuestion.correctAnswer) {
            return alert("Please fill all question fields and select the correct answer");
        }

        const formattedOptions = newQuestion.options.map(opt => ({
            text: opt,
            isCorrect: opt === newQuestion.correctAnswer
        }));

        setLoading(true);
        try {
            const { data } = await api.post(`/quiz/admin/${courseId}/questions`, {
                questionText: newQuestion.questionText,
                options: formattedOptions,
                correctAnswer: newQuestion.correctAnswer
            }, config);
            
            setQuestions(data.quiz.questions);
            setNewQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: '' });
            alert("Question added successfully!");
        } catch (err) {
            console.error("Failed to add question", err);
            alert("Failed to add question: " + (err.response?.data?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        setLoading(true);
        try {
            const { data } = await api.delete(`/quiz/admin/${courseId}/questions/${questionId}`, config);
            setQuestions(data.quiz.questions);
            alert("Question deleted successfully!");
        } catch (err) {
            console.error("Failed to delete question", err);
            alert("Failed to delete question: " + (err.response?.data?.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/admin/courses');
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-3 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Courses</span>
                    </button>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BookOpen className="text-blue-400" size={32} />
                        {isEdit ? 'Edit Course' : 'Create New Course'}
                    </h1>
                    <p className="text-gray-400 mt-2">
                        {isEdit ? 'Update course details and manage lessons' : 'Create a new course for students to learn'}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/50 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                {isEdit ? 'Update Course' : 'Create Course'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Course Details Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BookOpen className="text-blue-400" size={20} />
                    Course Details
                </h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
                        <input 
                            type="text" 
                            placeholder="Enter course title" 
                            value={formData.title} 
                            onChange={e => setFormData({ ...formData, title: e.target.value })} 
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea 
                            placeholder="Enter course description" 
                            value={formData.description} 
                            onChange={e => setFormData({ ...formData, description: e.target.value })} 
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={e => setFormData({ ...formData, category: e.target.value })} 
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c.name}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                        <select 
                            value={formData.level} 
                            onChange={e => setFormData({ ...formData, level: e.target.value })} 
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail URL</label>
                        <div className="flex">
                            <div className="flex items-center px-3 bg-gray-800 border border-gray-700 rounded-l-lg border-r-0">
                                <Image className="text-gray-500" size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="https://example.com/image.jpg" 
                                value={formData.thumbnail} 
                                onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} 
                                className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isPublished} 
                                    onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} 
                                    className="sr-only"
                                />
                                <div className={`block w-14 h-7 rounded-full ${formData.isPublished ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.isPublished ? 'transform translate-x-7' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-gray-300 font-medium">Publish Course</div>
                        </label>
                    </div>
                </form>
            </div>

            {/* Lessons Section (only shown when editing) */}
            {isEdit && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Youtube className="text-red-400" size={20} />
                        Course Lessons
                    </h2>
                    
                    {lessons.length > 0 ? (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-300 mb-4">Existing Lessons</h3>
                            <div className="space-y-3">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-blue-400 text-sm font-medium">{lesson.order}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{lesson.title}</div>
                                                <div className="text-sm text-gray-400 flex items-center gap-2">
                                                    <Youtube className="text-red-400" size={14} />
                                                    {lesson.youtubeVideoId}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => handleDeleteLesson(lesson._id)}
                                            className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                            <span className="hidden sm:inline">Delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 mb-8">
                            <Youtube className="mx-auto h-12 w-12 text-gray-600" />
                            <h3 className="mt-2 text-sm font-medium text-gray-300">No lessons yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Add your first lesson to get started.</p>
                        </div>
                    )}

                    <h3 className="text-lg font-medium text-gray-300 mb-4">Add New Lesson</h3>
                    <form onSubmit={handleAddLesson} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Lesson Title</label>
                            <input 
                                type="text" 
                                placeholder="Enter lesson title" 
                                value={newLesson.title} 
                                onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} 
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">YouTube Video ID</label>
                            <div className="flex">
                                <div className="flex items-center px-3 bg-gray-800 border border-gray-700 rounded-l-lg border-r-0">
                                    <Youtube className="text-red-400" size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Video ID" 
                                    value={newLesson.youtubeVideoId} 
                                    onChange={e => setNewLesson({ ...newLesson, youtubeVideoId: e.target.value })} 
                                    required
                                    className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                            <input 
                                type="number" 
                                placeholder="Lesson order" 
                                value={newLesson.order} 
                                onChange={e => setNewLesson({ ...newLesson, order: parseInt(e.target.value) || 0 })} 
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="md:col-span-2 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-900/50 text-white font-medium rounded-lg transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add Lesson
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Quiz Section (only shown when editing) */}
            {isEdit && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6 mt-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <HelpCircle className="text-purple-400" size={20} />
                        Course Quiz
                    </h2>
                    
                    {questions.length > 0 ? (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-300 mb-4">Existing Questions</h3>
                            <div className="space-y-4">
                                {questions.map((q, index) => (
                                    <div key={q._id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="font-medium text-white flex gap-2">
                                                <span className="text-purple-400">Q{index + 1}.</span>
                                                {q.questionText}
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteQuestion(q._id)}
                                                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                            {q.options.map((opt, i) => (
                                                <div key={i} className={`p-2 rounded border ${opt.isCorrect ? 'bg-green-900/20 border-green-700/50 text-green-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                                                    {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 mb-8">
                            <HelpCircle className="mx-auto h-12 w-12 text-gray-600" />
                            <h3 className="mt-2 text-sm font-medium text-gray-300">No questions yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Add questions to create a quiz for this course.</p>
                        </div>
                    )}

                    <h3 className="text-lg font-medium text-gray-300 mb-4">Add New Question</h3>
                    <form onSubmit={handleAddQuestion} className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Question Text</label>
                            <input 
                                type="text" 
                                placeholder="Enter question" 
                                value={newQuestion.questionText} 
                                onChange={e => setNewQuestion({ ...newQuestion, questionText: e.target.value })} 
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i}>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Option {i + 1}</label>
                                    <input 
                                        type="text" 
                                        placeholder={`Option ${i + 1}`} 
                                        value={newQuestion.options[i]} 
                                        onChange={e => {
                                            const newOpts = [...newQuestion.options];
                                            newOpts[i] = e.target.value;
                                            setNewQuestion({ ...newQuestion, options: newOpts });
                                        }} 
                                        required
                                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer</label>
                            <select 
                                value={newQuestion.correctAnswer} 
                                onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} 
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Select correct option...</option>
                                {newQuestion.options.filter(opt => opt.trim() !== '').map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/50 text-white font-medium rounded-lg transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add Question
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}