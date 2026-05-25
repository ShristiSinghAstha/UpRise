import { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
    Tag,
    Plus,
    Trash2,
    Layers,
    Search,
    BookOpen,
    Info,
    ChevronRight,
    Type
} from 'lucide-react';

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [token] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await api.post('/categories', { name: newName, description: newDesc }, { headers: { Authorization: `Bearer ${token}` } });
            setNewName('');
            setNewDesc('');
            fetchCategories();
        } catch (err) {
            console.error("Failed to create category", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? Courses in this category will become uncategorized.")) return;
        try {
            await api.delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchCategories();
        } catch (err) {
            console.error("Failed to delete category", err);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Category Catalog</h1>
                <p className="text-slate-400 mt-1">Organize and classify your course offerings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Category Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-3xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Plus className="text-indigo-400" size={20} />
                            Create Category
                        </h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Category Name</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        placeholder="e.g. Web Development"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description (Optional)</label>
                                <textarea
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    placeholder="Brief details about this category..."
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                            >
                                <Plus size={20} />
                                Add Category
                            </button>
                        </form>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-600/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Info size={20} />
                            </div>
                            <h3 className="font-bold">Pro Tip</h3>
                        </div>
                        <p className="text-sm text-indigo-50/80 leading-relaxed">
                            Well-organized categories help students find relevant courses 40% faster. Use clear, descriptive names.
                        </p>
                    </div>
                </div>

                {/* Categories Display */}
                <div className="lg:col-span-2 space-y-6 text-slate-200">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <div key={cat._id} className="group bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                <Layers size={24} />
                                            </div>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
                                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                            {cat.description || "No description provided for this category."}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/30">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            <BookOpen size={14} className="text-indigo-400/60" />
                                            <span>{cat.courseCount || 0} Courses</span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700 flex flex-col items-center justify-center">
                                <Tag size={40} className="text-slate-700 mb-4" />
                                <p className="text-slate-500 font-medium">No categories found matching your search</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
