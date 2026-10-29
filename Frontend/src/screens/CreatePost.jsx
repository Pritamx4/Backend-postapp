import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";

const CreatePost = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        axios.get(getApiUrl("/api/users/me"))
            .then(() => setAuthChecked(true))
            .catch(() => navigate("/auth?tab=login", { replace: true }));
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); setError("");
        const formData = new FormData(e.target);
        try {
            await axios.post(getApiUrl("/api/posts"), formData);
            navigate("/feed");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!authChecked) return null;

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <div style={{ width: "100%", maxWidth: 480 }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>
                            New Publication
                        </span>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: "#EDEDED", margin: 0 }}>
                        Upload Photo
                    </h1>
                    <p style={{ fontSize: 13, color: "#666", marginTop: 6, marginBottom: 0 }}>
                        Share a photograph with the community.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        marginBottom: 20, padding: "10px 14px", borderRadius: 8, fontSize: 12,
                        display: "flex", alignItems: "center", gap: 8,
                        backgroundColor: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#F87171",
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {error}
                    </div>
                )}

                <form style={{ display: "flex", flexDirection: "column", gap: 20 }} onSubmit={submitHandler}>

                    {/* Image upload */}
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: "#666", marginBottom: 8 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                            Image
                        </label>
                        <label
                            htmlFor="image-upload"
                            style={{
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                width: "100%", borderRadius: 16, cursor: "pointer",
                                backgroundColor: "#111", border: "1.5px dashed #1F1F1F",
                                minHeight: preview ? "auto" : 180,
                                transition: "border-color 0.15s", overflow: "hidden", boxSizing: "border-box",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "#333")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "#1F1F1F")}
                        >
                            {preview ? (
                                <div style={{ width: "100%" }}>
                                    <img src={preview} alt="Preview"
                                        style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderTop: "1px solid #1A1A1A" }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/>
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                        </svg>
                                        <span style={{ fontSize: 11, color: "#666", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName}</span>
                                        <span style={{ fontSize: 10, color: "#333", flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                            </svg>
                                            Change
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "40px 24px", textAlign: "center" }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="17 8 12 3 7 8"/>
                                            <line x1="12" y1="3" x2="12" y2="15"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: "#EDEDED", margin: "0 0 4px" }}>Click to select image</p>
                                        <p style={{ fontSize: 11, color: "#333", margin: 0 }}>PNG · JPG · WEBP</p>
                                    </div>
                                </div>
                            )}
                        </label>
                        <input id="image-upload" type="file" name="image" accept="image/*" required onChange={handleFileChange} style={{ display: "none" }} />
                    </div>

                    {/* Caption */}
                    <div>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: "#666", marginBottom: 8 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Caption
                            <span style={{ color: "#2E2E2E", fontWeight: 400 }}>— optional</span>
                        </label>
                        <textarea name="caption"
                            placeholder="Write a caption or photography notes…"
                            style={{
                                width: "100%", borderRadius: 12, padding: "12px 14px",
                                fontSize: 13, outline: "none", resize: "none",
                                backgroundColor: "#111", border: "1px solid #1F1F1F", color: "#EDEDED",
                                height: 88, boxSizing: "border-box", transition: "border-color 0.15s",
                                fontFamily: "inherit",
                            }}
                            onFocus={e => (e.target.style.borderColor = "#333")}
                            onBlur={e => (e.target.style.borderColor = "#1F1F1F")}
                        />
                    </div>

                    <div style={{ height: 1, backgroundColor: "#141414" }} />

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 10 }}>
                        <button type="button" onClick={() => navigate("/feed")} style={{
                            flex: 1, padding: "11px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                            cursor: "pointer", backgroundColor: "transparent",
                            border: "1px solid #1F1F1F", color: "#666",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            transition: "border-color 0.15s, color 0.15s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#EDEDED"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1F1F1F"; e.currentTarget.style.color = "#666"; }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Back
                        </button>
                        <button type="submit" disabled={loading} style={{
                            flex: 2, padding: "11px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                            cursor: loading ? "not-allowed" : "pointer",
                            backgroundColor: "#EDEDED", color: "#0A0A0A", border: "none",
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
                                    Publishing…
                                </>
                            ) : (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"/>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                    </svg>
                                    Publish to Feed
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CreatePost;
