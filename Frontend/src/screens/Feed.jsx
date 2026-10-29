import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import BrandIcon from "../components/BrandIcon";

// Dynamic editorial Bento pattern (36 distinct rhythms before repeating, ~5-6 viewport scroll cycles)
// Types inspired by your reference: 
// - Large Hero (2x2)
// - Wide Cinematic (2x1)
// - Tall Portrait (1x2)
// - Standard Cell (1x1)
const BENTO_CYCLE = [
    // --- Cluster 1 (Left Hero Anchor) ---
    { gridColumn: "span 2", gridRow: "span 2" }, // 0: Large 2x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 1: 1x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 2: 1x1
    { gridColumn: "span 1", gridRow: "span 2" }, // 3: Tall 1x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 4: 1x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 5: 1x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 6: 1x1
    { gridColumn: "span 2", gridRow: "span 1" }, // 7: Wide 2x1

    // --- Cluster 2 (Right-shifted Hero + Balance) ---
    { gridColumn: "span 1", gridRow: "span 1" }, // 8: 1x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 9: 1x1
    { gridColumn: "span 2", gridRow: "span 2" }, // 10: Large 2x2 (Right Hero)
    { gridColumn: "span 2", gridRow: "span 1" }, // 11: Wide 2x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 12: 1x1
    { gridColumn: "span 1", gridRow: "span 2" }, // 13: Tall 1x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 14: 1x1

    // --- Cluster 3 (Double Panoramic & Slender Towers) ---
    { gridColumn: "span 2", gridRow: "span 1" }, // 15: Wide 2x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 16: 1x1
    { gridColumn: "span 1", gridRow: "span 2" }, // 17: Tall 1x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 18: 1x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 19: 1x1
    { gridColumn: "span 2", gridRow: "span 1" }, // 20: Wide 2x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 21: 1x1

    // --- Cluster 4 (Center Focus Anchor) ---
    { gridColumn: "span 1", gridRow: "span 1" }, // 22: 1x1
    { gridColumn: "span 2", gridRow: "span 2" }, // 23: Large 2x2 (Center Hero)
    { gridColumn: "span 1", gridRow: "span 1" }, // 24: 1x1
    { gridColumn: "span 1", gridRow: "span 2" }, // 25: Tall 1x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 26: 1x1
    { gridColumn: "span 2", gridRow: "span 1" }, // 27: Wide 2x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 28: 1x1

    // --- Cluster 5 (Staggered Waterfall & Twin Wides) ---
    { gridColumn: "span 1", gridRow: "span 2" }, // 29: Tall 1x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 30: 1x1
    { gridColumn: "span 2", gridRow: "span 1" }, // 31: Wide 2x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 32: 1x1
    { gridColumn: "span 2", gridRow: "span 2" }, // 33: Large 2x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 34: 1x1
    { gridColumn: "span 1", gridRow: "span 1" }, // 35: 1x1
];

const getBentoSpan = (index) => {
    return BENTO_CYCLE[index % BENTO_CYCLE.length];
};

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [updatePostId, setUpdatePostId] = useState(null);
    const [updatedCaptions, setUpdatedCaptions] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(getApiUrl("/api/posts"));
                const nextPosts = Array.isArray(res.data?.posts)
                    ? res.data.posts
                    : Array.isArray(res.data) ? res.data : [];
                setPosts(nextPosts);
                setError("");
            } catch {
                setPosts([]);
                setError("Unable to load posts right now.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (_id) => {
        try {
            await axios.delete(getApiUrl(`/api/posts/${_id}`));
            setPosts((prev) => prev.filter((p) => p._id !== _id));
            setMenuOpenId(null);
        } catch (err) { console.error(err); }
    };

    const handleUpdate = async (_id) => {
        try {
            await axios.patch(getApiUrl(`/api/posts/${_id}`), { caption: updatedCaptions });
            setPosts((prev) => prev.map((p) => p._id === _id ? { ...p, caption: updatedCaptions } : p));
            setUpdatePostId(null);
            setUpdatedCaptions("");
            setMenuOpenId(null);
        } catch (err) { console.error(err); }
    };

    // Responsive: mobile = 2 cols, desktop = 4 cols
    const [cols, setCols] = useState(window.innerWidth >= 768 ? 4 : 2);
    useEffect(() => {
        const onResize = () => setCols(window.innerWidth >= 768 ? 4 : 2);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const isMobile = cols === 2;
    const ROW_HEIGHT = isMobile ? 140 : 210;

    return (
        <main
            style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", padding: isMobile ? "24px 16px" : "28px 28px" }}
        >
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444444", display: "block", marginBottom: 3 }}>
                            Community Gallery
                        </span>
                        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, letterSpacing: "-0.02em", color: "#EDEDED", margin: 0 }}>
                            Public Feed
                        </h1>
                    </div>

                    {/* Merged right-side actions at the exact same level */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#444444" }}>
                            {posts.length} {posts.length === 1 ? "post" : "posts"}
                        </span>
                        {localStorage.getItem("isLoggedIn") === "true" && (
                            <Link
                                to="/create-post"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "7px 14px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    backgroundColor: "#EDEDED",
                                    color: "#0A0A0A",
                                    textDecoration: "none",
                                    transition: "all 0.15s ease",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#EDEDED")}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Create Post</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div style={{ padding: "112px 0", textAlign: "center" }}>
                        <div style={{
                            display: "inline-block", width: 20, height: 20, borderRadius: "50%",
                            border: "2px solid #222", borderTopColor: "#EDEDED",
                            animation: "spin 0.8s linear infinite", marginBottom: 12
                        }} />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#444" }}>Loading…</p>
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <p style={{ padding: "64px 0", textAlign: "center", fontSize: 14, color: "#888" }}>{error}</p>
                )}

                {/* ── BENTO GRID ── */}
                {!isLoading && !error && posts.length > 0 && (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                            gridAutoRows: `${ROW_HEIGHT}px`,
                            gridAutoFlow: "dense",
                            gap: 10,
                        }}
                    >
                        {posts.map((post, index) => {
                            // On mobile: mostly 1x1 with occasional full-width banner
                            const span = isMobile
                                ? (index % 7 === 0 ? { gridColumn: "span 2", gridRow: "span 1" } : { gridColumn: "span 1", gridRow: "span 1" })
                                : getBentoSpan(index);

                            return (
                                <div
                                    key={post._id}
                                    style={{
                                        ...span,
                                        position: "relative",
                                        overflow: "hidden",
                                        borderRadius: 16,
                                        border: "1px solid #1F1F1F",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.querySelector("img").style.transform = "scale(1.05)";
                                        const overlay = e.currentTarget.querySelector(".caption-overlay");
                                        if (overlay) overlay.style.opacity = "1";
                                        const btn = e.currentTarget.querySelector(".menu-btn");
                                        if (btn) btn.style.opacity = "1";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.querySelector("img").style.transform = "scale(1)";
                                        const overlay = e.currentTarget.querySelector(".caption-overlay");
                                        if (overlay) overlay.style.opacity = "0";
                                        const btn = e.currentTarget.querySelector(".menu-btn");
                                        if (btn && menuOpenId !== post._id) btn.style.opacity = "0";
                                    }}
                                >
                                    {/* Image */}
                                    <img
                                        src={post.image}
                                        alt={post.caption || "Post"}
                                        style={{
                                            width: "100%", height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            transition: "transform 0.5s ease",
                                        }}
                                        loading="lazy"
                                    />

                                    {/* Caption overlay (hover) */}
                                    {post.caption && updatePostId !== post._id && (
                                        <div
                                            className="caption-overlay"
                                            style={{
                                                position: "absolute", inset: "0 0 0 0",
                                                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0) 55%)",
                                                padding: "12px 14px",
                                                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                                                opacity: 0,
                                                transition: "opacity 0.2s ease",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            <p style={{ fontSize: 12, color: "#EDEDED", lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                {post.caption}
                                            </p>
                                            {post.author?.username && (
                                                <span style={{ fontSize: 9, color: "#888", marginTop: 3 }}>
                                                    — {post.author.username}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Edit caption inline */}
                                    {updatePostId === post._id && (
                                        <div
                                            style={{
                                                position: "absolute", bottom: 0, left: 0, right: 0,
                                                background: "rgba(0,0,0,0.92)", padding: 12,
                                            }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <input
                                                value={updatedCaptions}
                                                onChange={(e) => setUpdatedCaptions(e.target.value)}
                                                placeholder="Edit caption…"
                                                style={{
                                                    width: "100%", borderRadius: 8, padding: "6px 10px",
                                                    fontSize: 12, outline: "none", boxSizing: "border-box",
                                                    backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", color: "#EDEDED",
                                                }}
                                                onFocus={e => (e.target.style.borderColor = "#444")}
                                                onBlur={e => (e.target.style.borderColor = "#2E2E2E")}
                                            />
                                            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={() => handleUpdate(post._id)}
                                                    style={{ borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, backgroundColor: "#EDEDED", color: "#0A0A0A", border: "none", cursor: "pointer" }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => { setUpdatePostId(null); setUpdatedCaptions(""); }}
                                                    style={{ borderRadius: 8, padding: "4px 12px", fontSize: 12, backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", color: "#888", cursor: "pointer" }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}


                                    {/* 3-dot menu button */}
                                    <button
                                        className="menu-btn"
                                        onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === post._id ? null : post._id); }}
                                        style={{
                                            position: "absolute", top: 8, right: 8,
                                            padding: 6, borderRadius: 8,
                                            backgroundColor: "rgba(0,0,0,0.65)", border: "none",
                                            color: "#EDEDED", cursor: "pointer",
                                            opacity: menuOpenId === post._id ? 1 : 0,
                                            transition: "opacity 0.15s ease",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}
                                        aria-label="Post actions"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="5" r="1.8" />
                                            <circle cx="12" cy="12" r="1.8" />
                                            <circle cx="12" cy="19" r="1.8" />
                                        </svg>
                                    </button>

                                    {/* Dropdown */}
                                    {menuOpenId === post._id && (
                                        <div
                                            style={{
                                                position: "absolute", top: 38, right: 8,
                                                width: 128, borderRadius: 12,
                                                backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E",
                                                overflow: "hidden", zIndex: 30,
                                                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                                            }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => { setUpdatePostId(post._id); setUpdatedCaptions(post.caption || ""); setMenuOpenId(null); }}
                                                style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 12, color: "#EDEDED", background: "none", border: "none", cursor: "pointer" }}
                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#222")}
                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                                            >
                                                Edit Caption
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", fontSize: 12, color: "#F87171", background: "none", borderTop: "1px solid #222", cursor: "pointer" }}
                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1F0A0A")}
                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── VS-CODE STYLE SCATTERED WORKBENCH EMPTY STATE ── */}
                {!isLoading && !error && posts.length === 0 && (
                    <div
                        style={{
                            position: "relative",
                            minHeight: "calc(100vh - 160px)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            overflow: "hidden",
                            borderRadius: 24,
                            padding: "40px 20px",
                            userSelect: "none",
                        }}
                    >
                        {/* ── SCATTERED BACKGROUND ICONS (VS Code / Desk Canvas Style) ── */}

                        {/* 1. Center Interactive Architectural Film Slide + Optical Plus (+) SVG */}
                        <Link
                            to={localStorage.getItem("isLoggedIn") === "true" ? "/create-post" : "/auth?tab=register"}
                            style={{
                                position: "relative",
                                zIndex: 10,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#EDEDED",
                                opacity: 0.22,
                                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                                cursor: "pointer",
                                textDecoration: "none",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.opacity = "0.75";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.opacity = "0.22";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            title="Upload Photograph"
                            aria-label="Upload Photograph"
                        >
                            <BrandIcon size={128} strokeWidth={1.5} />
                        </Link>

                        {/* 2. Top-Left: Tilted Folder */}
                        <div
                            style={{
                                position: "absolute",
                                top: "10%",
                                left: "8%",
                                transform: "rotate(-16deg)",
                                opacity: 0.16,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                        </div>

                        {/* 3. Top-Right: Camera with Strap */}
                        <div
                            style={{
                                position: "absolute",
                                top: "14%",
                                right: "12%",
                                transform: "rotate(18deg)",
                                opacity: 0.2,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                <circle cx="12" cy="13" r="3.5" />
                                <line x1="18.5" y1="9.5" x2="18.51" y2="9.5" />
                            </svg>
                        </div>

                        {/* 4. Bottom-Left: Polaroid / Photo Frame */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "14%",
                                left: "10%",
                                transform: "rotate(14deg)",
                                opacity: 0.18,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="78" height="78" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>

                        {/* 5. Bottom-Right: Film Roll / Negative Strip */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "16%",
                                right: "10%",
                                transform: "rotate(-22deg)",
                                opacity: 0.18,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M7 3v18" />
                                <path d="M17 3v18" />
                                <path d="M3 8h4" />
                                <path d="M3 13h4" />
                                <path d="M3 18h4" />
                                <path d="M17 8h4" />
                                <path d="M17 13h4" />
                                <path d="M17 18h4" />
                            </svg>
                        </div>

                        {/* 6. Mid-Left: SD Card */}
                        <div
                            style={{
                                position: "absolute",
                                top: "48%",
                                left: "4%",
                                transform: "rotate(-28deg)",
                                opacity: 0.14,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z" />
                                <line x1="8" y1="4" x2="8" y2="8" />
                                <line x1="11" y1="4" x2="11" y2="8" />
                                <line x1="14" y1="4" x2="14" y2="8" />
                            </svg>
                        </div>

                        {/* 7. Mid-Right: Camera Lens Aperture */}
                        <div
                            style={{
                                position: "absolute",
                                top: "42%",
                                right: "5%",
                                transform: "rotate(32deg)",
                                opacity: 0.15,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
                                <line x1="9.69" y1="8" x2="21.17" y2="8" />
                                <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
                                <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
                                <line x1="14.31" y1="16" x2="2.83" y2="16" />
                                <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
                            </svg>
                        </div>

                        {/* 8. Top-Center: Crop Marks / Viewfinder */}
                        <div
                            style={{
                                position: "absolute",
                                top: "8%",
                                left: "46%",
                                transform: "rotate(8deg)",
                                opacity: 0.12,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2v14a2 2 0 0 0 2 2h14" />
                                <path d="M18 22V8a2 2 0 0 0-2-2H2" />
                            </svg>
                        </div>

                        {/* 9. Bottom-Center: Archive Folder */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "8%",
                                left: "38%",
                                transform: "rotate(-10deg)",
                                opacity: 0.14,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="21 8 21 21 3 21 3 8" />
                                <rect width="22" height="5" x="1" y="3" rx="1" />
                                <line x1="10" y1="12" x2="14" y2="12" />
                            </svg>
                        </div>

                        {/* 10. Flash / Sparkle Accent */}
                        <div
                            style={{
                                position: "absolute",
                                top: "24%",
                                left: "26%",
                                transform: "rotate(-15deg)",
                                opacity: 0.15,
                                pointerEvents: "none",
                            }}
                        >
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close menu */}
            {menuOpenId && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 20 }}
                    onClick={() => setMenuOpenId(null)}
                />
            )}
        </main>
    );
};

export default Feed;
