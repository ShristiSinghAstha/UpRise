// import { Link, useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function Navbar() {
//   const { accessToken, user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="w-full bg-[#0f0f0f] text-white shadow-md px-6 py-4 flex items-center justify-between">
//       {/* Logo */}
//       <Link to="/" className="text-2xl font-bold text-blue-400">
//         UpRise
//       </Link>

//       <div className="flex items-center gap-6">
//         {!accessToken && (
//           <>
//             <Link
//               to="/login"
//               className="text-gray-300 hover:text-white transition"
//             >
//               Login
//             </Link>

//             <Link
//               to="/register"
//               className="text-gray-300 hover:text-white transition"
//             >
//               Register
//             </Link>
//           </>
//         )}

//         {accessToken && (
//           <>
//             <Link
//               to="/profile"
//               className="text-gray-300 hover:text-white transition"
//             >
//               Profile
//             </Link>

//             <button
//               onClick={handleLogout}
//               className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md transition text-sm"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }



import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, User, BookOpen } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? "text-blue-400 bg-blue-500/10" : "text-gray-400 hover:text-white hover:bg-gray-800";
    };

    return (
        <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="p-2 rounded-lg bg-blue-900/20 group-hover:bg-blue-900/40 transition-colors">
                            <GraduationCap className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            UpRise
                        </span>
                    </Link>

                    <div className="flex items-center space-x-1">
                        <Link
                            to="/"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/')}`}
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>

                        <Link
                            to="/courses"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/courses')}`}
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Courses</span>
                        </Link>

                        <Link
                            to="/profile"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/profile')}`}
                        >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
