import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <div className="h-16 w-16 absolute top-0 left-0 bg-amber-200 flex items-center justify-center rounded-full border-2 border-gray-400">
                <h1>Logo</h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Welcome to Post app</h1>
                <button className="bg-amber-200 text-black px-4 py-2 rounded-md"
                onClick={() => navigate("/register")}>Create Account</button>
                <button className="bg-gray-200 text-black px-4 py-2 rounded-md"
                onClick={() => navigate("/login")}>Login</button>
            </div>
        </div>
    );
};

export default Home;
