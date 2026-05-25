import { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
    Users,
    Trash2,
    User,
    Mail,
    Calendar,
    Search,
    Filter,
    MoreVertical,
    Download
} from 'lucide-react';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [token] = useState(localStorage.getItem('adminToken'));
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` } });
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchUsers();
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-l-4 border-r-4 border-transparent animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-slate-400 mt-1">Manage and monitor platform participants</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-all border border-slate-700/50">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <select className="w-full pl-12 pr-4 py-3 bg-slate-800/40 border border-slate-700/30 rounded-2xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer">
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="instructor">Instructors</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-700/20 transition-all duration-200 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">{user.username}</p>
                                                    <p className="text-slate-400 text-sm flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-tighter border border-indigo-500/20">
                                                Student
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                    title="Remove user"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
                                                <Users size={32} />
                                            </div>
                                            <p className="text-slate-400 font-medium text-lg">No users found matching your search</p>
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="text-indigo-400 hover:underline"
                                            >
                                                Clear search filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700/30 flex items-center justify-between">
                    <p className="text-slate-500 text-sm">
                        Showing <span className="text-slate-300 font-bold">{filteredUsers.length}</span> of <span className="text-slate-300 font-bold">{users.length}</span> users
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-all disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
