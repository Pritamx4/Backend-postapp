import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getApiUrl } from "../config/api";
import BrandIcon from "../components/BrandIcon";

const Auth = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const isLogin = searchParams.get("tab") !== "register";

    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        const endpoint = isLogin ? getApiUrl("/api/auth/login") : getApiUrl("/api/auth/register");
        const payload = isLogin
            ? { username: formData.username, email: formData.username.includes("@") ? formData.username : undefined, password: formData.password }
            : formData;
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Request failed");
            if (isLogin) {
                if (data.token) localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", "true");
                setMessage("Login successful. Redirecting…");
                setTimeout(() => navigate("/feed"), 800);
            } else {
                setMessage("Account created. You can now sign in.");
                setSearchParams({ tab: "login" });
            }
        } catch (error) {
            setIsError(true);
            setMessage(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const inputWrap = { position: "relative", display: "flex", alignItems: "center" };
    const inputStyle = {
        width: "100%",
        borderRadius: 0, // Laser sharp edgy design as requested
        padding: "12px 14px 12px 42px",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
        backgroundColor: "#0A0A0A",
        border: "1px solid #222222",
        color: "#EDEDED",
        transition: "border-color 0.15s ease",
        fontFamily: "inherit",
    };
    const iconStyle = { position: "absolute", left: 14, pointerEvents: "none", color: "#555555" };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0A0A0A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* ── SCATTERED STUDIO SILHOUETTES IN BACKGROUND (Same as Empty Canvas, Pure Minimalist) ── */}

            {/* 1. Top-Left: Tilted Folder */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "10%",
                    transform: "rotate(-14deg)",
                    opacity: 0.12,
                    pointerEvents: "none",
                }}
            >
                <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            </div>

            {/* 2. Top-Right: Camera with Strap */}
            <div
                style={{
                    position: "absolute",
                    top: "12%",
                    right: "12%",
                    transform: "rotate(16deg)",
                    opacity: 0.14,
                    pointerEvents: "none",
                }}
            >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3.5" />
                    <line x1="18.5" y1="9.5" x2="18.51" y2="9.5" />
                </svg>
            </div>

            {/* 3. Bottom-Left: Polaroid / Photo Frame */}
            <div
                style={{
                    position: "absolute",
                    bottom: "12%",
                    left: "12%",
                    transform: "rotate(12deg)",
                    opacity: 0.12,
                    pointerEvents: "none",
                }}
            >
                <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            </div>

            {/* 4. Bottom-Right: Film Roll / Negative Strip */}
            <div
                style={{
                    position: "absolute",
                    bottom: "14%",
                    right: "10%",
                    transform: "rotate(-18deg)",
                    opacity: 0.12,
                    pointerEvents: "none",
                }}
            >
                <svg width="78" height="78" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" />
                    <line x1="7" y1="3" x2="7" y2="21" />
                    <line x1="17" y1="3" x2="17" y2="21" />
                    <circle cx="5" cy="6" r="0.8" fill="#EDEDED" />
                    <circle cx="5" cy="12" r="0.8" fill="#EDEDED" />
                    <circle cx="5" cy="18" r="0.8" fill="#EDEDED" />
                    <circle cx="19" cy="6" r="0.8" fill="#EDEDED" />
                    <circle cx="19" cy="12" r="0.8" fill="#EDEDED" />
                    <circle cx="19" cy="18" r="0.8" fill="#EDEDED" />
                </svg>
            </div>

            {/* ── AUTH CONTAINER CARD (Clean, Sharp, Non-Cyberpunk) ── */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    maxWidth: 400,
                    backgroundColor: "#111111",
                    border: "1px solid #1E1E1E",
                    borderRadius: 0, // Laser-sharp 0px
                    padding: "36px 32px 32px",
                }}
            >
                {/* Brand Header — Borderless, Free-standing */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 28, userSelect: "none" }}>
                    <div
                        style={{
                            color: "#EDEDED",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 14,
                        }}
                    >
                        <BrandIcon size={44} strokeWidth={1.5} />
                    </div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: "#EDEDED", margin: 0, letterSpacing: "-0.03em" }}>
                        {isLogin ? "Welcome back" : "Create an account"}
                    </h1>
                    <p style={{ fontSize: 13, color: "#666666", marginTop: 6, marginBottom: 0 }}>
                        {isLogin ? "Sign in to explore your photography feed" : "Join the minimal visual archive"}
                    </p>
                </div>

                {/* Tab Switcher (Minimal, Laser-Sharp) */}
                <div
                    style={{
                        display: "flex",
                        backgroundColor: "#0A0A0A",
                        border: "1px solid #1F1F1F",
                        borderRadius: 0,
                        padding: 3,
                        marginBottom: 24,
                    }}
                >
                    {[
                        { key: "login", label: "Sign In" },
                        { key: "register", label: "Register" },
                    ].map(({ key, label }) => {
                        const active = (key === "login") === isLogin;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleTabChange(key === "login")}
                                style={{
                                    flex: 1,
                                    padding: "9px 0",
                                    borderRadius: 0,
                                    fontSize: 12,
                                    fontWeight: active ? 600 : 500,
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    backgroundColor: active ? "#1E1E1E" : "transparent",
                                    color: active ? "#EDEDED" : "#666666",
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Status Message */}
                {message && (
                    <div
                        style={{
                            marginBottom: 18,
                            padding: "10px 14px",
                            borderRadius: 0,
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: isError ? "rgba(220,38,38,0.08)" : "rgba(34,197,94,0.08)",
                            border: `1px solid ${isError ? "#7F1D1D" : "#14532D"}`,
                            color: isError ? "#FCA5A5" : "#86EFAC",
                        }}
                    >
                        <span>{isError ? "✕" : "✓"}</span>
                        <span>{message}</span>
                    </div>
                )}

                {/* Form Fields */}
                <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={handleSubmit}>
                    {/* Username or Email */}
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#777777", marginBottom: 6 }}>
                            {isLogin ? "Username or Email" : "Username"}
                        </label>
                        <div style={inputWrap}>
                            <span style={iconStyle}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M20 21a8 8 0 0 0-16 0" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                name="username"
                                placeholder={isLogin ? "Enter your username or email" : "Choose a username"}
                                value={formData.username}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = "#444444")}
                                onBlur={(e) => (e.target.style.borderColor = "#222222")}
                            />
                        </div>
                    </div>

                    {/* Email (Register only) */}
                    {!isLogin && (
                        <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#777777", marginBottom: 6 }}>
                                Email Address
                            </label>
                            <div style={inputWrap}>
                                <span style={iconStyle}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect width="20" height="16" x="2" y="4" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => (e.target.style.borderColor = "#444444")}
                                    onBlur={(e) => (e.target.style.borderColor = "#222222")}
                                />
                            </div>
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#777777", marginBottom: 6 }}>
                            Password
                        </label>
                        <div style={inputWrap}>
                            <span style={iconStyle}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect width="18" height="11" x="3" y="11" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{ ...inputStyle, paddingRight: 42 }}
                                onFocus={(e) => (e.target.style.borderColor = "#444444")}
                                onBlur={(e) => (e.target.style.borderColor = "#222222")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: 12,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#555555",
                                    padding: 4,
                                    display: "flex",
                                    transition: "color 0.15s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#EDEDED")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button (Laser-Sharp, Clean Contrast) */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px 18px",
                            borderRadius: 0,
                            border: "none",
                            marginTop: 4,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            backgroundColor: "#EDEDED",
                            color: "#0A0A0A",
                            opacity: loading ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "background-color 0.15s ease",
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#EDEDED")}
                    >
                        {loading ? (
                            <>
                                <div style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#0A0A0A", animation: "spin 0.8s linear infinite" }} />
                                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                                Please wait…
                            </>
                        ) : isLogin ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Footer Switcher */}
                <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid #1C1C1C", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "#666666", margin: 0 }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => handleTabChange(!isLogin)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#EDEDED",
                                textDecoration: "underline",
                                padding: 0,
                                fontFamily: "inherit",
                            }}
                        >
                            {isLogin ? "Register" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
