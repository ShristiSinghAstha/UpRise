import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded Pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const UpdateProfile = lazy(() => import("./pages/updateProfile"));
const ChangePassword = lazy(() => import("./pages/changePassword"));
const Home = lazy(() => import("./pages/Home"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Lesson = lazy(() => import("./pages/Lesson"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Certificate = lazy(() => import("./pages/Certificate"));

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageCategories = lazy(() => import("./pages/admin/ManageCategories"));
const ManageCourses = lazy(() => import("./pages/admin/ManageCourses"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const CourseEditor = lazy(() => import("./pages/admin/CourseEditor"));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white font-sans">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* User & Public Routes (wrapped in UserLayout to show Navbar) */}
            <Route element={<UserLayout />}>
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/course/:courseId/lesson/:lessonId" element={<Lesson />} />
              <Route path="/course/:courseId/quiz" element={<Quiz />} />
              <Route path="/course/:courseId/certificate" element={<Certificate />} />
            </Route>

            {/* User Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/updateProfile" element={<UpdateProfile />} />
              <Route path="/changePassword" element={<ChangePassword />} />
            </Route>

            {/* Admin Routes (No Main Navbar, uses AdminLayout) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="courses/new" element={<CourseEditor />} />
                <Route path="courses/edit/:courseId" element={<CourseEditor />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;