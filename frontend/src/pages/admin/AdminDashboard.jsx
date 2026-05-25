import { useEffect, useState } from 'react';
import api from '../../api/axios';
import {
    Users,
    BookOpen,
    Tag,
    TrendingUp,
    Award,
    Clock,
    Eye,
    ChevronRight,
    ArrowUpRight,
    Plus
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalCategories: 0,
        recentUserRegistrations: 0,
        registrationTrend: [],
        categoryStats: []
    });
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await api.get('/admin/dashboard', config);
                setStats(data);
                setRecentCourses(data.recentCourses || []);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-64 bg-slate-800/50 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-slate-800/40 border border-slate-700/30 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-[400px] bg-slate-800/40 border border-slate-700/30 rounded-2xl animate-pulse"></div>
                    <div className="h-[400px] bg-slate-800/40 border border-slate-700/30 rounded-2xl animate-pulse"></div>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium">{title}</p>
                    <h3 className="text-white text-3xl font-bold mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-slate-400">
                    {trend && (
                        <span className="flex items-center text-emerald-400 mr-2 font-medium">
                            <ArrowUpRight size={14} className="mr-0.5" />
                            {trend}
                        </span>
                    )}
                    <span>{subtext}</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
                    <p className="text-slate-400 mt-1">Real-time insights and platform metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/courses/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                    >
                        <Plus size={18} />
                        New Course
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.totalUsers}
                    subtext="Registered users"
                    icon={Users}
                    color="indigo"
                    trend={`${stats.recentUserRegistrations} new`}
                />
                <StatCard
                    title="Courses"
                    value={stats.totalCourses}
                    subtext="Across all categories"
                    icon={BookOpen}
                    color="emerald"
                />
                <StatCard
                    title="Categories"
                    value={stats.totalCategories}
                    subtext="Skill domains"
                    icon={Tag}
                    color="purple"
                />
                <StatCard
                    title="Active Sessions"
                    value="-- "
                    subtext="Real-time monitoring"
                    icon={Eye}
                    color="orange"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registration Trend */}
                <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-white">Student Registration Trend</h2>
                            <p className="text-sm text-slate-400">Last 7 days registration activity</p>
                        </div>
                        <TrendingUp className="text-indigo-400" size={24} />
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.registrationTrend}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => val === 0 ? '0' : val}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        borderColor: '#334155',
                                        borderRadius: '12px',
                                        color: '#f8fafc'
                                    }}
                                    itemStyle={{ color: '#818cf8' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-white">Course Distribution</h2>
                            <p className="text-sm text-slate-400">By Category</p>
                        </div>
                        <Award className="text-purple-400" size={24} />
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.categoryStats}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {stats.categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        borderColor: '#334155',
                                        borderRadius: '12px',
                                        color: '#f8fafc'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {stats.categoryStats.slice(0, 4).map((cat, index) => (
                            <div key={cat.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-xs text-slate-300">{cat.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-white">{cat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-white">Latest Course Releases</h2>
                        <p className="text-sm text-slate-400">Recently published learning materials</p>
                    </div>
                    <Link to="/admin/courses" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                        View All
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-3 font-medium">Course Title</th>
                                <th className="px-6 py-3 font-medium">Category</th>
                                <th className="px-6 py-3 font-medium text-right">Published Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {recentCourses.length > 0 ? (
                                recentCourses.map((course) => (
                                    <tr key={course._id} className="hover:bg-slate-700/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                    <BookOpen size={16} />
                                                </div>
                                                <span className="text-white font-medium">{course.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-tight">
                                                {course.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400 text-sm">
                                            {new Date(course.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                        No courses recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
