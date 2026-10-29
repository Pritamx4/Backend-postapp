import axios from "axios";

// Globally enable cookies for all axios requests
axios.defaults.withCredentials = true;

// Automatically attach Bearer token to all requests if present in localStorage (fixes mobile Safari/Chrome cross-origin cookie blocks)
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Agar .env me VITE_API_URL hai to wo use hoga, warna dev me localhost:5000
const rawUrl =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:5000" : "");

export const API_BASE_URL = rawUrl.replace(/\/$/, "");

export const getApiUrl = (path = "") => {
    if (!path) return API_BASE_URL;
    // Ensure path starts with a single '/'
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
};
