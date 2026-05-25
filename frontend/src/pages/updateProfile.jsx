import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  User,
  Mail,
  ArrowLeft,
  Save,
  Shield,
  CheckCircle,
  UserCircle,
  Loader2
} from "lucide-react";

export default function UpdateProfile() {
  const { accessToken, user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user && !accessToken) {
      navigate("/login");
      return;
    }
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user, accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await api.put(
        "/update-profile",
        { username, email },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      login(accessToken, res.data.user);
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-xl relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <div className="p-2 bg-slate-800/50 rounded-xl group-hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-bold uppercase tracking-widest text-xs">Back to Profile</span>
        </button>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <UserCircle size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Update Profile</h1>
              <p className="text-slate-500 font-medium">Modify your public identity</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3">
              <Shield size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm font-bold flex items-center gap-3">
              <CheckCircle size={18} />
              Profile synchronized successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Display Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium placeholder-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Electronic Mail
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium placeholder-slate-700"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} />
                    Commit Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
