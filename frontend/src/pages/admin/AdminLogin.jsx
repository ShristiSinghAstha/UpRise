import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Mail, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/admin/login", { email, password });
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem(
                "adminInfo",
                JSON.stringify({ username: data.username, email: data.email, _id: data._id })
            );
            navigate("/admin/dashboard", { replace: true });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Invalid Admin Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="w-full max-w-[440px] relative">
                {/* Branding / Logo Area */}
                <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-12 group-hover:rotate-0 transition-transform duration-500 mb-6">
                        <ShieldCheck className="text-white -rotate-12" size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">UpRise <span className="text-indigo-500">Admin</span></h1>
                    <p className="text-slate-400 font-medium">Platform Management Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[32px] p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-500">
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-[18px] flex items-center gap-3 text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">
                                Administrator Identity
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="w-full bg-slate-950/50 border border-slate-800 text-white py-4 pl-12 pr-4 rounded-[18px] outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-slate-700 font-medium"
                                    placeholder="your-email@uprise.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[12px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">
                                Secure Key
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-slate-950/50 border border-slate-800 text-white py-4 pl-12 pr-12 rounded-[18px] outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-slate-700 font-medium"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-4 px-6 rounded-[20px] font-bold shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-10 text-slate-600 text-sm font-medium">
                    System protected by enterprise-grade encryption.
                </p>
            </div>
        </div>
    );
}
