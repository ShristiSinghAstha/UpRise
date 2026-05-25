import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const adminToken = localStorage.getItem('adminToken');

    // Simple check. Real app might verify token validity via API or decoding expiry.
    return adminToken ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
