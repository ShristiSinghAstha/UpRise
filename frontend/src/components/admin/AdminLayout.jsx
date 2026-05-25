import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Layers,
    Users,
    LogOut,
    Menu,
    X,
    Settings,
    Bell,
    User,
    ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminName, setAdminName] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let admin = null;
        try {
            const adminInfoStr = localStorage.getItem('adminInfo');
            if (adminInfoStr) {
                admin = JSON.parse(adminInfoStr);
            }
        } catch (e) {
            console.error('Failed to parse adminInfo from localStorage', e);
            localStorage.removeItem('adminInfo');
        }
        
        const adminToken = localStorage.getItem('adminToken');
        if (!admin || !adminToken) {
            navigate('/admin/login');
        } else {
            setAdminName(admin.username || 'Admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/courses', icon: BookOpen, label: 'Manage Courses' },
        { path: '/admin/categories', icon: Layers, label: 'Manage Categories' },
        { path: '/admin/users', icon: Users, label: 'Manage Users' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-xl
                ${isSidebarOpen ? 'w-64' : 'w-20'} 
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/50">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">U</span>
                            </div>
                            {isSidebarOpen && (
                                <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent truncate">
                                    UpRise Admin
                                </span>
                            )}
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                                >
                                    <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                                    {isSidebarOpen && isActive && <ChevronRight size={16} className="ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-4 border-t border-slate-800/50">
                        {isSidebarOpen && (
                            <div className="mb-4 px-2 py-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                                        <User size={20} className="text-white" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-white truncate">{adminName}</p>
                                        <p className="text-xs text-slate-400 truncate">Administrator</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200
                            ${!isSidebarOpen && 'justify-center'}`}
                        >
                            <LogOut size={20} />
                            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-20 border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-xl px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/40 border border-slate-700/30 transition-all hidden lg:block"
                        >
                            <Menu size={20} />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/40 border border-slate-700/30 transition-all lg:hidden"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 text-xs font-medium text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Online
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0f172a]"></span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white rounded-lg transition-all">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Router Outlet */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </div>
    );
}
