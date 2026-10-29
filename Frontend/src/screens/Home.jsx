import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="flex relative items-center justify-center h-screen bg-black text-white">
            <div className="h-12 w-12 absolute top-0 left-0 flex items-center justify-center rounded-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M30 20h40c5.5 0 10 4.5 10 10v40c0 5.5-4.5 10-10 10H30c-5.5 0-10-4.5-10-10V30c0-5.5 4.5-10 10-10z" />
                    <path d="M30 40l20 15 20-15" />
                </svg>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Welcome to Post app</h1>
                <button
                    className="bg-amber-200 text-black px-4 py-2 rounded-md"
                    onClick={() => navigate("/auth?tab=register")}
                >
                    Create Account
                </button>
                <button
                    className="bg-gray-200 text-black px-4 py-2 rounded-md"
                    onClick={() => navigate("/auth?tab=login")}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Home;
