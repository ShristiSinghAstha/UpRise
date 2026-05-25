import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Key,
  LogOut,
  Award,
  BookOpen,
  Trophy,
  Clock,
  AlertCircle,
  RefreshCw,
  Shield,
  ChevronRight,
  Star,
  Activity as LayoutIcon
} from 'lucide-react';

export default function Profile() {
  const { accessToken, user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [userStats, setUserStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    completedLessons: 0,
    points: 0
  });
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, statsRes, certRes, coursesRes] = await Promise.all([
          api.get("/me"),
          api.get("/user/stats").catch(() => ({ data: { stats: { enrolledCourses: 0, completedCourses: 0, completedLessons: 0, points: 0 } } })),
          api.get("/certificates/my").catch(() => ({ data: { data: [] } })),
          api.get("/user/courses").catch(() => ({ data: { courses: [] } }))
        ]);

        setProfile(profileRes.data.user);
        setUserStats(statsRes.data.stats || { enrolledCourses: 0, completedCourses: 0, completedLessons: 0, points: 0 });
        setCertificates(certRes.data.data || []);
        setUserCourses(coursesRes.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError({
          message: "Failed to load profile data",
          details: err.response?.data?.message || err.message || "Unknown error"
        });

        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [accessToken, navigate, logout]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log("Logout error", error);
    }
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-l-4 border-r-4 border-transparent animate-pulse delay-150"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[32px] p-10 text-center shadow-2xl">
          <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="text-red-400" size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 italic tracking-tight uppercase">Access Interrupted</h2>
          <p className="text-slate-400 mb-8 font-medium">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-white transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <RefreshCw size={20} />
            Initialize System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 font-sans pb-20">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 relative z-10">
        {/* Profile Hero Section */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          {/* User Card */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={120} />
              </div>

              <div className="relative flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-indigo-500 to-purple-600 p-[3px] rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-indigo-500/30">
                    <div className="w-full h-full bg-[#0f172a] rounded-[29px] flex items-center justify-center text-4xl font-black text-white">
                      {profile.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-2xl border-4 border-[#0f172a] flex items-center justify-center" title="Account Active">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                </div>

                <h1 className="text-3xl font-black text-white tracking-tight mb-1">{profile.username}</h1>
                <p className="text-slate-400 font-medium mb-6">{profile.email}</p>

                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <div className="px-4 py-2 bg-slate-800/50 rounded-[14px] border border-slate-700/30 flex items-center gap-2 text-sm font-bold">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span>Level 1 Student</span>
                  </div>
                  <div className="px-4 py-2 bg-indigo-500/10 rounded-[14px] border border-indigo-500/20 flex items-center gap-2 text-sm font-bold text-indigo-400">
                    <Trophy size={14} />
                    <span>{userStats.points} XP</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => navigate("/updateProfile")}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-slate-800/60 hover:bg-slate-700/60 rounded-2xl font-bold transition-all border border-slate-700/30"
                  >
                    <Settings size={18} /> Edit Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-bold transition-all border border-red-500/20"
                  >
                    <LogOut size={18} /> Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Courses', value: userStats.enrolledCourses, icon: BookOpen, color: 'indigo' },
                { label: 'Completed Courses', value: userStats.completedCourses || 0, icon: Shield, color: 'emerald' },
                { label: 'Lessons Finalized', value: userStats.completedLessons, icon: Clock, color: 'purple' },
                { label: 'Certifications', value: certificates.length, icon: Award, color: 'blue' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[32px] p-6 shadow-xl group hover:border-indigo-500/30 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-[14px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* My Learning Journey */}
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[40px] p-8 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <BookOpen className="text-purple-400" size={28} />
                  My Learning Journey
                </h2>
              </div>

              {userCourses.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-slate-500 max-w-sm mb-8 font-medium">You haven't enrolled in any courses yet.</p>
                  <button
                    onClick={() => navigate("/courses")}
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-purple-600/20"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userCourses.map((course) => (
                    <div
                      key={course._id}
                      className="group bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/50 p-6 rounded-[32px] transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{course.title}</h4>
                        {course.isCompleted && (
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                            Completed
                          </span>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                          <span>Progress</span>
                          <span>{course.progressPercentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000"
                            style={{ width: `${course.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/course/${course._id}`)}
                        className="w-full py-3 bg-slate-700/50 hover:bg-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/20"
                      >
                        {course.isCompleted ? 'Review Materials' : 'Continue Learning'}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Achievements */}
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[40px] p-8 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <Award className="text-indigo-400" size={28} />
                  My Achievements
                </h2>
                <div className="h-2 flex-grow mx-8 bg-slate-800/50 rounded-full hidden md:block">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${Math.min((certificates.length / 5) * 100, 100)}%` }}></div>
                </div>
              </div>

              {certificates.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600 mb-6">
                    <Trophy size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">The journey begins here</h3>
                  <p className="text-slate-500 max-w-sm mb-8 font-medium">Complete your first specialized course to unlock a professional certificate of completion.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert._id}
                      onClick={() => navigate(`/course/${cert.courseId}/certificate`)}
                      className="group bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/50 p-6 rounded-[24px] transition-all cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{cert.courseName}</h4>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 italic">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[32px] p-8 shadow-xl">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              Security Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-400">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Password</p>
                    <p className="text-sm font-bold text-slate-300">••••••••••••</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/changePassword")}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-xs font-black uppercase tracking-widest rounded-lg transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[32px] p-8 shadow-xl">
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <LayoutIcon size={18} className="text-purple-400" />
              Platform Stats
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex-1 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 text-center">
                <p className="text-2xl font-black text-indigo-400">{userStats.points}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total XP</p>
              </div>
              <div className="flex-1 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 text-center">
                <p className="text-2xl font-black text-purple-400">Top 5%</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Rank</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
