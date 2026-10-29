import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import BrandIcon from "./BrandIcon";

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            try {
                const res = await axios.get(getApiUrl("/api/users/me"));
                if (isMounted && res.status === 200 && res.data?.user) {
                    setUser(res.data.user);
                    localStorage.setItem("isLoggedIn", "true");
                }
            } catch {
                if (isMounted) {
                    setUser(null);
                    localStorage.removeItem("isLoggedIn");
                }
            }
        };
        fetchUser();
        return () => { isMounted = false; };
    }, [location.pathname]);

    const handleLogout = async () => {
        try { await axios.post(getApiUrl("/api/auth/logout")); } catch (err) { console.error("Logout error:", err); }
        finally {
            localStorage.removeItem("isLoggedIn");
            setUser(null);
            navigate("/auth?tab=login");
        }
    };

    const isActive = (path) => location.pathname === path;
    const isExploreActive = location.pathname === "/" || location.pathname === "/feed";

    return (
        <>
            {/* ── DESKTOP SIDEBAR (Laser-Sharp Edgy Minimalist) ── */}
            <aside
                className="hidden md:flex w-56 lg:w-60 shrink-0 h-screen sticky top-0 flex-col justify-between z-40 select-none"
                style={{
                    backgroundColor: "#0A0A0A",
                    borderRight: "1px solid #1A1A1A",
                    borderRadius: 0,
                }}
            >
                {/* Top Section */}
                <div className="flex flex-col p-5 w-full">
                    {/* Brand Header — Borderless, Larger Free-standing Icon, Non-redirecting */}
                    <div className="flex items-center gap-3.5 mb-8 px-1 py-1 select-none">
                        <div
                            style={{
                                color: "#EDEDED",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <BrandIcon size={34} strokeWidth={1.6} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base tracking-tight leading-tight text-[#EDEDED]">
                                Frame
                            </span>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#555555] mt-0.5">
                                Visual Archive
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links — Laser Sharp Precision Bars */}
                    <nav className="flex flex-col gap-1 w-full">
                        <Link
                            to="/feed"
                            className="flex items-center gap-3 px-3.5 py-2.5 text-xs transition-all duration-150 text-decoration-none"
                            style={
                                isExploreActive
                                    ? {
                                          backgroundColor: "#121212",
                                          color: "#EDEDED",
                                          fontWeight: 600,
                                          border: "1px solid #242424",
                                          borderLeft: "2px solid #EDEDED",
                                          borderRadius: 0,
                                      }
                                    : {
                                          backgroundColor: "transparent",
                                          color: "#777777",
                                          fontWeight: 500,
                                          border: "1px solid transparent",
                                          borderLeft: "2px solid transparent",
                                          borderRadius: 0,
                                      }
                            }
                            onMouseEnter={e => {
                                if (!isExploreActive) {
                                    e.currentTarget.style.color = "#EDEDED";
                                    e.currentTarget.style.backgroundColor = "#0F0F0F";
                                    e.currentTarget.style.borderLeftColor = "#333333";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isExploreActive) {
                                    e.currentTarget.style.color = "#777777";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.borderLeftColor = "transparent";
                                }
                            }}
                        >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="7" height="7" x="3" y="3" />
                                <rect width="7" height="7" x="14" y="3" />
                                <rect width="7" height="7" x="14" y="14" />
                                <rect width="7" height="7" x="3" y="14" />
                            </svg>
                            <span>Explore</span>
                        </Link>

                        {!user && (
                            <Link
                                to="/auth?tab=login"
                                className="flex items-center gap-3 px-3.5 py-2.5 text-xs transition-all duration-150 text-decoration-none"
                                style={
                                    isActive("/auth")
                                        ? {
                                              backgroundColor: "#121212",
                                              color: "#EDEDED",
                                              fontWeight: 600,
                                              border: "1px solid #242424",
                                              borderLeft: "2px solid #EDEDED",
                                              borderRadius: 0,
                                          }
                                        : {
                                              backgroundColor: "transparent",
                                              color: "#777777",
                                              fontWeight: 500,
                                              border: "1px solid transparent",
                                              borderLeft: "2px solid transparent",
                                              borderRadius: 0,
                                          }
                                }
                                onMouseEnter={e => {
                                    if (!isActive("/auth")) {
                                        e.currentTarget.style.color = "#EDEDED";
                                        e.currentTarget.style.backgroundColor = "#0F0F0F";
                                        e.currentTarget.style.borderLeftColor = "#333333";
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive("/auth")) {
                                        e.currentTarget.style.color = "#777777";
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.borderLeftColor = "transparent";
                                    }
                                }}
                            >
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M20 21a8 8 0 0 0-16 0" />
                                </svg>
                                <span>Sign In</span>
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Bottom User Area — Sharp Monolithic Slate */}
                <div className="p-4" style={{ borderTop: "1px solid #1A1A1A", borderRadius: 0 }}>
                    {user ? (
                        <div
                            className="flex items-center justify-between p-2.5 transition-all"
                            style={{
                                backgroundColor: "#0D0D0D",
                                border: "1px solid #202020",
                                borderRadius: 0,
                            }}
                        >
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="flex items-center gap-2.5 min-w-0 bg-transparent border-none p-0 cursor-pointer text-left flex-1"
                                title="View Profile"
                            >
                                {/* Rounded Initial Avatar */}
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold uppercase shrink-0"
                                    style={{
                                        backgroundColor: "#161616",
                                        border: "1px solid #282828",
                                        color: "#EDEDED",
                                    }}
                                >
                                    {user.username?.slice(0, 2) ?? "U"}
                                </div>
                                <div className="flex flex-col min-w-0 pr-1">
                                    <span className="text-xs font-semibold truncate text-[#EDEDED]">
                                        {user.username}
                                    </span>
                                    <span className="text-[9px] font-mono truncate text-[#555555]">
                                        {user.email}
                                    </span>
                                </div>
                            </button>

                            {/* Direct Logout Icon — No Border */}
                            <button
                                onClick={handleLogout}
                                className="w-7 h-7 flex items-center justify-center shrink-0 transition-colors bg-transparent border-none cursor-pointer p-0"
                                style={{ color: "#777777" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#F87171")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#777777")}
                                title="Sign Out"
                                aria-label="Sign Out"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="px-2 py-1">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#444444]">
                                Guest Session
                            </span>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── MOBILE BOTTOM BAR (Laser-Sharp Edgy) ── */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50 flex items-center justify-around px-4 select-none"
                style={{ backgroundColor: "#0A0A0A", borderTop: "1px solid #1A1A1A", borderRadius: 0 }}
            >
                {/* Explore */}
                <Link
                    to="/feed"
                    className={`flex flex-col items-center gap-1 w-14 py-1 transition-colors text-decoration-none ${isExploreActive ? "text-[#EDEDED]" : "text-[#555555]"}`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="7" x="3" y="3" />
                        <rect width="7" height="7" x="14" y="3" />
                        <rect width="7" height="7" x="14" y="14" />
                        <rect width="7" height="7" x="3" y="14" />
                    </svg>
                    <span className="text-[9px] font-mono uppercase tracking-wide">Explore</span>
                </Link>

                {/* Center Create Post (+) Sharp Square */}
                {user && (
                    <Link
                        to="/create-post"
                        className="w-8 h-8 flex items-center justify-center transition-all active:scale-95 text-decoration-none"
                        style={{ backgroundColor: "#EDEDED", color: "#0A0A0A", borderRadius: 0 }}
                        aria-label="Upload"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </Link>
                )}

                {/* Profile Drawer Opener (or Sign In) */}
                {user ? (
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className={`flex flex-col items-center gap-1 w-14 py-1 bg-transparent border-none cursor-pointer transition-colors ${
                            showProfileModal ? "text-[#EDEDED]" : "text-[#777777]"
                        }`}
                        title="Profile"
                        aria-label="Profile"
                    >
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold uppercase"
                            style={{ backgroundColor: "#141414", border: "1px solid #282828", color: "#EDEDED" }}
                        >
                            {user.username?.slice(0, 2) ?? "U"}
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-wide truncate max-w-[56px]">
                            Profile
                        </span>
                    </button>
                ) : (
                    <Link
                        to="/auth?tab=login"
                        className={`flex flex-col items-center gap-1 w-14 transition-colors text-decoration-none ${isActive("/auth") ? "text-[#EDEDED]" : "text-[#555555]"}`}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21a8 8 0 0 0-16 0" />
                        </svg>
                        <span className="text-[9px] font-mono uppercase tracking-wide">Sign In</span>
                    </Link>
                )}
            </nav>

            {/* ── PROFILE MODAL (Laser-Sharp Monolithic Architectural) ── */}
            {showProfileModal && user && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
                    onClick={() => setShowProfileModal(false)}
                >
                    <div
                        className="w-full sm:max-w-xs p-6 flex flex-col items-center select-none"
                        style={{
                            backgroundColor: "#0D0D0D",
                            border: "1px solid #222222",
                            borderRadius: 0,
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Rounded Avatar */}
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold uppercase mb-4"
                            style={{ backgroundColor: "#141414", border: "1px solid #2E2E2E", color: "#EDEDED" }}
                        >
                            {user.username?.slice(0, 2) ?? "U"}
                        </div>

                        <h3 className="text-sm font-bold tracking-tight mb-0.5 text-[#EDEDED]">
                            {user.username}
                        </h3>
                        <p className="text-[11px] font-mono mb-4 text-[#777777]">
                            {user.email}
                        </p>

                        <div
                            className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider mb-6 flex items-center gap-1.5"
                            style={{ backgroundColor: "#111111", border: "1px solid #242424", borderRadius: 0, color: "#888888" }}
                        >
                            <span style={{ width: 4, height: 4, backgroundColor: "#EDEDED", display: "inline-block" }} />
                            <span>Community Member</span>
                        </div>

                        <button
                            onClick={() => {
                                setShowProfileModal(false);
                                handleLogout();
                            }}
                            className="w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            style={{
                                backgroundColor: "rgba(220,38,38,0.1)",
                                border: "1px solid rgba(220,38,38,0.3)",
                                borderRadius: 0,
                                color: "#F87171",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(220,38,38,0.2)")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(220,38,38,0.1)")}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span>Sign Out</span>
                        </button>

                        <button
                            onClick={() => setShowProfileModal(false)}
                            className="w-full mt-2 py-2 text-xs transition-colors cursor-pointer text-[#666666] hover:text-[#EDEDED]"
                            style={{ backgroundColor: "transparent", border: "none", borderRadius: 0 }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navigation;
