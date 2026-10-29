import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getApiUrl } from "../config/api";

const Auth = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state from URL search params (prevents cascading re-render warnings)
    const isLogin = searchParams.get("tab") !== "register";

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (message) setMessage("");
    };

    const handleTabChange = (loginState) => {
        setSearchParams({ tab: loginState ? "login" : "register" });
        setMessage("");
        setIsError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        const endpoint = isLogin
            ? getApiUrl("/api/auth/login")
            : getApiUrl("/api/auth/register");

        const payload = isLogin
            ? {
                  username: formData.username,
                  email: formData.username.includes("@")
                      ? formData.username
                      : undefined,
                  password: formData.password,
              }
            : formData;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Request failed");
            }

            if (isLogin) {
                console.log("Login Success:", data);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                localStorage.setItem("isLoggedIn", "true");
                setMessage("Login successful! Redirecting to feed...");
                setTimeout(() => {
                    navigate("/feed");
                }, 1000);
            } else {
                console.log("Register Success:", data);
                setMessage("Account created! Please log in.");
                // Switch to login tab
                setSearchParams({ tab: "login" });
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setIsError(true);
            setMessage(
                error.message || "Something went wrong. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-4 antialiased">
            <div className="w-full max-w-95 bg-[#111113] border border-zinc-800/80 rounded-2xl p-7 sm:p-8 flex flex-col">
                {/* Brand / Logo */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                        <svg
                            className="w-5 h-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                                ry="2"
                            />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-white">
                        {isLogin ? "Welcome to Feed" : "Join the Community"}
                    </h1>
                    <p className="text-xs text-zinc-400 mt-1">
                        {isLogin
                            ? "Sign in to share and explore photos"
                            : "Create an account to start posting images"}
                    </p>
                </div>

                {/* Minimal Underline Tabs */}
                <div className="flex border-b border-zinc-800 mb-6">
                    <button
                        type="button"
                        onClick={() => handleTabChange(true)}
                        className={`flex-1 pb-2.5 text-xs font-medium transition-colors relative ${
                            isLogin ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        Sign In
                        {isLogin && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange(false)}
                        className={`flex-1 pb-2.5 text-xs font-medium transition-colors relative ${
                            !isLogin ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        Sign Up
                        {!isLogin && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                        )}
                    </button>
                </div>

                {/* Status Message */}
                {message && (
                    <div
                        className={`mb-4 px-3.5 py-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                            isError
                                ? "bg-red-950/30 border-red-900/50 text-red-300"
                                : "bg-emerald-950/30 border-emerald-900/50 text-emerald-300"
                        }`}
                    >
                        <span className="shrink-0">{isError ? "✕" : "✓"}</span>
                        <span className="flex-1">{message}</span>
                    </div>
                )}

                {/* Simple Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-xs font-medium text-zinc-300 mb-1.5"
                        >
                            {isLogin ? "Username or Email" : "Username"}
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder={
                                isLogin
                                    ? "Enter your username or email"
                                    : "Choose a username"
                            }
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-medium text-zinc-300 mb-1.5"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#18181b] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                            />
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-xs font-medium text-zinc-300 mb-1.5"
                        >
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#18181b] border border-zinc-800 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-2.5 px-4 bg-white text-black font-semibold rounded-lg text-sm hover:bg-zinc-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                              ? "Sign In"
                              : "Create Account"}
                    </button>
                </form>

                {/* Footer Switcher */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
                    <p className="text-xs text-zinc-500">
                        {isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => handleTabChange(!isLogin)}
                            className="text-white font-medium hover:underline focus:outline-none"
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
