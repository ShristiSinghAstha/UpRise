import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
    BookOpen,
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    Filter,
    LayoutGrid,
    List as ListIcon,
    ChevronRight,
    Star,
    Layers
} from 'lucide-react';

export default function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [token] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/courses');
            setCourses(data);
            setFilteredCourses(data);
        } catch (err) {
            console.error("Failed to fetch courses", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        let filtered = courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(course => course.category === selectedCategory);
        }
        setFilteredCourses(filtered);
    }, [searchTerm, selectedCategory, courses]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
        try {
            await api.delete(`/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchCourses();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const categories = ['all', ...new Set(courses.map(c => c.category))];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium">Loading catalog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Course Management</h1>
                    <p className="text-slate-400 mt-1">Total {courses.length} courses in your library</p>
                </div>
                <Link
                    to="/admin/courses/new"
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
                >
                    <Plus size={20} />
                    Create New Course
                </Link>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-12 pr-10 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer capitalize"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/30">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <ListIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 shadow-xl flex flex-col">
                            <div className="relative h-48 bg-slate-700 overflow-hidden">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-indigo-900/30">
                                        <BookOpen size={48} className="text-slate-600/50" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                        {course.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                            </div>

                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-bold text-white line-clamp-1 mb-2">{course.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{course.description}</p>

                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-tight">
                                    <div className="flex items-center gap-1.5 text-indigo-400">
                                        <Star size={12} fill="currentColor" />
                                        <span>{course.level || 'Beginner'}</span>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded-full ${course.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {course.isActive ? 'Active' : 'Offline'}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/30 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Link to={`/admin/courses/edit/${course._id}`} className="p-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-600/30">
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="p-2 bg-slate-700/50 hover:bg-red-500/20 text-white hover:text-red-400 rounded-xl transition-all border border-slate-600/30"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <Link
                                    to={`/course/${course._id}`}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl font-bold transition-all"
                                >
                                    Preview
                                    <Eye size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Course Info</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filteredCourses.map((course) => (
                                    <tr key={course._id} className="hover:bg-slate-700/20 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-16 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-indigo-500/10">
                                                            <BookOpen size={16} className="text-indigo-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold line-clamp-1">{course.title}</p>
                                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">ID: {course._id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-indigo-400 text-sm font-medium">{course.level || 'Beginner'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${course.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                {course.isActive ? 'Active' : 'Draft'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/admin/courses/edit/${course._id}`} className="text-slate-400 hover:text-indigo-400 transition-colors">
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(course._id)} className="text-slate-400 hover:text-red-400 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                                <Link to={`/course/${course._id}`} className="text-slate-400 hover:text-white transition-colors">
                                                    <ChevronRight size={20} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredCourses.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                    <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 mb-4">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No courses match your criteria</h3>
                    <p className="text-slate-400 text-center max-w-xs mb-6">Try adjusting your filters or search terms to find what you're looking for.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
