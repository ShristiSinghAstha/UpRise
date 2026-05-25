import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, ShieldCheck, User } from "lucide-react";

export default function Login() {
  const { login: authLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/courses", { replace: true });
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState("student"); // student or admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "student") {
        // Student login
        const res = await api.post("/login", { email, password });
        authLogin(res.data.accessToken, res.data.user);
        navigate("/courses", { replace: true });
      } else {
        // Admin login
        const res = await api.post("/admin/login", { email, password });
        
        // Store admin token and info
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem(
          "adminInfo",
          JSON.stringify({ 
            username: res.data.username, 
            email: res.data.email, 
            _id: res.data._id 
          })
        );
        
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to continue learning
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("student")}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "student"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <User size={16} className="mr-2" />
              Student
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "admin"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ShieldCheck size={16} className="mr-2" />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="w-full bg-gray-950 border border-gray-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 placeholder-gray-500"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full bg-gray-950 border border-gray-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 placeholder-gray-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-blue-600 rounded-lg hover:bg-blue-700 focus:z-10 focus:ring-4 focus:ring-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : activeTab === "student" ? "Sign In as Student" : "Sign In as Admin"}
              {!loading && <ArrowRight className="ml-2" size={18} />}
            </button>
          </form>

          {activeTab === "student" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-500 hover:text-blue-400 underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}