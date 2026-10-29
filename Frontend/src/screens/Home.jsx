import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";

const Home = () => {
    const navigate = useNavigate();

    // Logged-in user ko direct feed par redirect karo
    useEffect(() => {
        axios
            .get(getApiUrl("/api/users/me"))
            .then((res) => {
                if (res.status === 200) {
                    navigate("/feed");
                }
            })
            .catch(() => {
                // User logged in nahi hai, home screen par hi rahega
            });
    }, [navigate]);

    return (
        <div className="flex relative items-center justify-center min-h-[calc(100vh-4rem)] bg-black text-white p-4">
            <div className="flex flex-col items-center justify-center gap-4 text-center max-w-sm">
                <div className="w-12 h-12 rounded-xl bg-[#111113] border border-zinc-800 flex items-center justify-center">
                    <svg
                        className="w-6 h-6 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Welcome to Frame</h1>
                <p className="text-xs text-zinc-400">Share your moments and explore visual stories</p>
                <div className="flex flex-col w-full gap-2.5 mt-2">
                    <button
                        className="w-full bg-white text-black font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors"
                        onClick={() => navigate("/auth?tab=register")}
                    >
                        Create Account
                    </button>
                    <button
                        className="w-full bg-[#111113] border border-zinc-800 text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
                        onClick={() => navigate("/auth?tab=login")}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
