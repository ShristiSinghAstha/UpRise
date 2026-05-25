import axios from "axios";

// Create Axios Instance
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://uprise-a-skill-learning-platform.onrender.com";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,  // Use centralized base URL
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});


// Intercept requests to add the token
api.interceptors.request.use(
    (config) => {
        if (config.url && config.url.startsWith('/admin')) {
            const adminToken = localStorage.getItem("adminToken");
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`;
            }
        } else {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;