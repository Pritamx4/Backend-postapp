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
        setMessage(""); setIsError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage(""); setIsError(false);
        const endpoint = isLogin ? getApiUrl("/api/auth/login") : getApiUrl("/api/auth/register");
        const payload = isLogin
            ? { username: formData.username, email: formData.username.includes("@") ? formData.username : undefined, password: formData.password }
            : formData;
        try {
            const response = await fetch(endpoint, {
                method: "POST", headers: { "Content-Type": "application/json" },
                credentials: "include", body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Request failed");
            if (isLogin) {
                if (data.token) localStorage.setItem("token", data.token);
                localStorage.setItem("isLoggedIn", "true");
                setMessage("Login successful! Redirecting…");
                setTimeout(() => navigate("/feed"), 1000);
            } else {
                setMessage("Account created! Please log in.");
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
        width: "100%", borderRadius: 10, padding: "10px 14px 10px 38px",
        fontSize: 13, outline: "none", boxSizing: "border-box",
        backgroundColor: "#0D0D0D", border: "1px solid #1F1F1F", color: "#EDEDED",
        transition: "border-color 0.15s", fontFamily: "inherit",
    };
    const iconStyle = { position: "absolute", left: 12, pointerEvents: "none", color: "#444" };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{
                width: "100%", maxWidth: 380,
                backgroundColor: "#111", border: "1px solid #1A1A1A",
                borderRadius: 20, padding: "32px 28px",
            }}>
                {/* Brand — Borderless, Larger Free-standing Icon */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, userSelect: "none" }}>
                    <div style={{
                        color: "#EDEDED",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <BrandIcon size={34} strokeWidth={1.6} />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#EDEDED", letterSpacing: "-0.02em", lineHeight: 1.1 }}>Frame</div>
                        <div style={{ fontSize: 9, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "#555555", marginTop: 2 }}>Visual Archive</div>
                    </div>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: 20, fontWeight: 700, color: "#EDEDED", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                    {isLogin ? "Welcome back" : "Create account"}
                </h1>
                <p style={{ fontSize: 12, color: "#555", margin: "0 0 22px" }}>
                    {isLogin ? "Sign in to continue to Frame" : "Join the photography community"}
                </p>

                {/* Tab switcher */}
                <div style={{
                    display: "flex", backgroundColor: "#0D0D0D",
                    border: "1px solid #1F1F1F", borderRadius: 10, padding: 3, marginBottom: 20,
                }}>
                    {[{ key: "login", label: "Sign In", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg> },
                     { key: "register", label: "Register", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> }
                    ].map(({ key, label, icon }) => {
                        const active = (key === "login") === isLogin;
                        return (
                            <button key={key} onClick={() => handleTabChange(key === "login")} style={{
                                flex: 1, padding: "7px 0", borderRadius: 7, fontSize: 12, fontWeight: 500,
                                border: "none", cursor: "pointer", transition: "all 0.15s",
                                backgroundColor: active ? "#1E1E1E" : "transparent",
                                color: active ? "#EDEDED" : "#555",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                            }}>
                                {icon} {label}
                            </button>
                        );
                    })}
                </div>

                {/* Message banner */}
                {message && (
                    <div style={{
                        marginBottom: 16, padding: "10px 12px", borderRadius: 8, fontSize: 12,
                        display: "flex", alignItems: "center", gap: 8,
                        backgroundColor: isError ? "rgba(220,38,38,0.08)" : "rgba(34,197,94,0.08)",
                        border: `1px solid ${isError ? "rgba(220,38,38,0.2)" : "rgba(34,197,94,0.2)"}`,
                        color: isError ? "#F87171" : "#86EFAC",
                    }}>
                        {isError
                            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        }
                        {message}
                    </div>
                )}

                {/* Form */}
                <form style={{ display: "flex", flexDirection: "column", gap: 14 }} onSubmit={handleSubmit}>

                    {/* Username */}
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#555", marginBottom: 6 }}>
                            {isLogin ? "Username or Email" : "Username"}
                        </label>
                        <div style={inputWrap}>
                            <span style={iconStyle}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>
                                </svg>
                            </span>
                            <input type="text" name="username"
                                placeholder={isLogin ? "username or email" : "choose a username"}
                                value={formData.username} onChange={handleChange} required
                                style={inputStyle}
                                onFocus={e => (e.target.style.borderColor = "#333")}
                                onBlur={e => (e.target.style.borderColor = "#1F1F1F")}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    {!isLogin && (
                        <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#555", marginBottom: 6 }}>Email</label>
                            <div style={inputWrap}>
                                <span style={iconStyle}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </span>
                                <input type="email" name="email" placeholder="your@email.com"
                                    value={formData.email} onChange={handleChange} required
                                    style={inputStyle}
                                    onFocus={e => (e.target.style.borderColor = "#333")}
                                    onBlur={e => (e.target.style.borderColor = "#1F1F1F")}
                                />
                            </div>
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#555", marginBottom: 6 }}>Password</label>
                        <div style={inputWrap}>
                            <span style={iconStyle}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"} name="password"
                                placeholder="••••••••"
                                value={formData.password} onChange={handleChange} required
                                style={{ ...inputStyle, paddingRight: 40 }}
                                onFocus={e => (e.target.style.borderColor = "#333")}
                                onBlur={e => (e.target.style.borderColor = "#1F1F1F")}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                position: "absolute", right: 12, background: "none", border: "none",
                                cursor: "pointer", color: "#444", padding: 2, display: "flex",
                                transition: "color 0.15s",
                            }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#EDEDED")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                            >
                                {showPassword
                                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading} style={{
                        width: "100%", padding: "11px 16px", borderRadius: 10, border: "none", marginTop: 2,
                        fontSize: 13, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                        backgroundColor: "#EDEDED", color: "#0A0A0A",
                        opacity: loading ? 0.5 : 1,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        transition: "background 0.15s",
                    }}
                        onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = "#FFF")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#EDEDED")}
                    >
                        {loading ? (
                            <>
                                <div style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#0A0A0A", animation: "spin 0.8s linear infinite" }} />
                                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                                Please wait…
                            </>
                        ) : isLogin ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                                </svg>
                                Sign In
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                                </svg>
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #1A1A1A", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "#555", margin: 0 }}>
                        {isLogin ? "New here? " : "Already a member? "}
                        <button type="button" onClick={() => handleTabChange(!isLogin)} style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontSize: 12, fontWeight: 600, color: "#EDEDED",
                            textDecoration: "underline", padding: 0,
                        }}>
                            {isLogin ? "Create account" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
