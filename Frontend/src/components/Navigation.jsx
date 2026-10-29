import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Check user auth state on route change
    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                const res = await axios.get(getApiUrl("/api/users/me"));
                if (isMounted && res.status === 200 && res.data?.user) {
                    setUser(res.data.user);
                    localStorage.setItem("isLoggedIn", "true");
                }
            } catch (err) {
                if (isMounted) {
                    setUser(null);
                    localStorage.removeItem("isLoggedIn");
                }
            }
        };

        fetchUser();

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await axios.post(getApiUrl("/api/auth/logout"));
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("isLoggedIn");
            setUser(null);
            navigate("/auth?tab=login");
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ======================================================== */}
            {/* 1. DESKTOP: LEFT DOCKED VERTICAL RAIL (md:flex)          */}
            {/* Instagram Web / Render Console Style (Full Screen Height)*/}
            {/* ======================================================== */}
            <aside className="hidden md:flex w-60 lg:w-64 shrink-0 h-screen sticky top-0 flex-col justify-between bg-black border-r border-zinc-800/80 z-40 select-none">
                {/* Top Section: Brand + Menu */}
                <div className="flex flex-col p-5 w-full">
                    {/* Brand Logo */}
                    <Link
                        to={user ? "/feed" : "/"}
                        className="flex items-center gap-3 mb-8 px-2 py-1 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#111113] border border-zinc-800 flex items-center justify-center text-white transition-colors group-hover:border-zinc-700">
                            <svg
                                className="w-4 h-4 text-white"
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
                        <div className="flex flex-col">
                            <span className="font-semibold text-lg tracking-tight text-white leading-none">
                                Frame
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-1">
                                Visual Archive
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Stack */}
                    <nav className="flex flex-col gap-1.5 w-full">
                        {/* Feed Link */}
                        <Link
                            to="/feed"
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive("/feed")
                                    ? "bg-[#18181b] text-white border border-zinc-800"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                            }`}
                        >
                            <svg
                                className="w-4 h-4 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="14" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                            </svg>
                            <span>Explore Feed</span>
                            {isActive("/feed") && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </Link>

                        {/* Create Post Action Button */}
                        <Link
                            to="/create-post"
                            className={`flex items-center justify-center gap-2 mt-3 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                                isActive("/create-post")
                                    ? "bg-zinc-200 text-black"
                                    : "bg-white text-black hover:bg-zinc-200 active:scale-[0.99]"
                            }`}
                        >
                            <svg
                                className="w-4 h-4 text-black"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Create Post</span>
                        </Link>
                    </nav>
                </div>

                {/* Bottom Section: Profile & Logout OR Login / Register */}
                <div className="flex flex-col border-t border-zinc-900 p-4 w-full bg-black">
                    {user ? (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#111113] border border-zinc-800/80">
                            {/* Profile Info */}
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-semibold text-white shrink-0 uppercase">
                                    {user.username ? user.username.slice(0, 2) : "U"}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-medium text-white truncate">
                                        {user.username}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-500 truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </div>

                            {/* Logout Action */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Sign Out"
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors shrink-0"
                                aria-label="Logout"
                            >
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/auth?tab=register"
                                className="w-full text-center bg-white text-black font-semibold py-2 px-3 rounded-lg text-xs hover:bg-zinc-200 transition-colors"
                            >
                                Register
                            </Link>
                            <Link
                                to="/auth?tab=login"
                                className="w-full text-center bg-[#111113] border border-zinc-800 text-zinc-300 font-medium py-2 px-3 rounded-lg text-xs hover:bg-zinc-800 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* ======================================================== */}
            {/* 2. MOBILE: TOP HEADER BRAND STRIP (< md)                 */}
            {/* ======================================================== */}
            <div className="md:hidden sticky top-0 z-40 w-full h-14 bg-black border-b border-zinc-800/80 px-4 flex items-center justify-between">
                <Link to={user ? "/feed" : "/"} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#111113] border border-zinc-800 flex items-center justify-center text-white">
                        <svg
                            className="w-3.5 h-3.5 text-white"
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
                    <span className="font-semibold text-base tracking-tight text-white">
                        Frame
                    </span>
                </Link>

                {user && (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-xs font-mono text-zinc-400 hover:text-white"
                    >
                        Sign Out
                    </button>
                )}
            </div>

            {/* ======================================================== */}
            {/* 3. MOBILE: DOCKED BOTTOM NAVIGATION (< md)               */}
            {/* ======================================================== */}
            <nav
                aria-label="Mobile Navigation"
                className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-zinc-800/90 z-50 flex items-center justify-around px-4 select-none"
            >
                {/* Feed Link */}
                <Link
                    to="/feed"
                    className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition-colors ${
                        isActive("/feed") ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                >
                    <div className="relative">
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="7" height="7" x="3" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="3" rx="1" />
                            <rect width="7" height="7" x="14" y="14" rx="1" />
                            <rect width="7" height="7" x="3" y="14" rx="1" />
                        </svg>
                        {isActive("/feed") && (
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                    </div>
                    <span className="text-[10px] font-medium tracking-tight">Explore</span>
                </Link>

                {/* Center Create Post (+) */}
                <Link
                    to="/create-post"
                    className="w-10 h-10 rounded-lg bg-white hover:bg-zinc-200 text-black flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-none"
                    aria-label="Create Post"
                >
                    <svg
                        className="w-5 h-5 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </Link>

                {/* Auth / Account */}
                {user ? (
                    <div className="flex flex-col items-center justify-center gap-1 w-16 py-1">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-white uppercase">
                            {user.username ? user.username.slice(0, 2) : "U"}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[60px]">
                            {user.username}
                        </span>
                    </div>
                ) : (
                    <Link
                        to="/auth?tab=login"
                        className="flex flex-col items-center justify-center gap-1 w-16 text-zinc-500 hover:text-white py-1 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21a8 8 0 0 0-16 0" />
                        </svg>
                        <span className="text-[10px] font-medium">Sign In</span>
                    </Link>
                )}
            </nav>
        </>
    );
};

export default Navigation;
