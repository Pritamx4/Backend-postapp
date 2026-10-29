import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import BrandIcon from "../components/BrandIcon";

const HOME_BENTO_SPANS = [
    { gridColumn: "span 2", gridRow: "span 2" }, // Large 2x2 featured
    { gridColumn: "span 1", gridRow: "span 1" }, // Single 1x1
    { gridColumn: "span 1", gridRow: "span 2" }, // Tall portrait 1x2
    { gridColumn: "span 1", gridRow: "span 1" }, // Single 1x1
    { gridColumn: "span 1", gridRow: "span 1" }, // Single 1x1
    { gridColumn: "span 2", gridRow: "span 1" }, // Wide 2x1
    { gridColumn: "span 1", gridRow: "span 1" }, // Single 1x1
];

const getBentoSpan = (index) => {
    return HOME_BENTO_SPANS[index % HOME_BENTO_SPANS.length];
};

const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // If logged in → go to feed
    useEffect(() => {
        axios.get(getApiUrl("/api/users/me"))
            .then((res) => { if (res.status === 200) navigate("/feed"); })
            .catch(() => {});
    }, [navigate]);

    // Fetch real posts for preview
    useEffect(() => {
        axios.get(getApiUrl("/api/posts"))
            .then((res) => {
                const p = Array.isArray(res.data?.posts) ? res.data.posts
                    : Array.isArray(res.data) ? res.data : [];
                setPosts(p.slice(0, 7)); // max 7 for bento
            })
            .catch(() => setPosts([]))
            .finally(() => setLoadingPosts(false));
    }, []);

    const hasPosts = posts.length > 0;

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0A0A0A" }}>

            {/* ── LEFT: Real posts bento (only shown if real posts exist) ── */}
            {hasPosts && (
                <div
                    className="md-bento-panel"
                    style={{ display: "none", flex: 1, padding: 16, overflow: "hidden", position: "relative" }}
                >
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridAutoRows: "160px",
                        gridAutoFlow: "dense",
                        gap: 10,
                        height: "100%",
                    }}>
                        {posts.map((post, i) => (
                            <div key={post._id} style={{
                                ...getBentoSpan(i),
                                borderRadius: 14,
                                overflow: "hidden",
                                border: "1px solid #1F1F1F",
                            }}>
                                <img
                                    src={post.image}
                                    alt={post.caption || ""}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                            </div>
                        ))}
                    </div>
                    {/* Fade on right edge */}
                    <div style={{
                        position: "absolute", top: 0, right: 0, width: 80, height: "100%",
                        background: "linear-gradient(to right, transparent, #0A0A0A)",
                        pointerEvents: "none",
                    }} />
                </div>
            )}

            {/* ── RIGHT: CTA ── */}
            <div style={{
                width: "100%",
                maxWidth: hasPosts ? 400 : 360,
                margin: hasPosts ? "0 0 0 auto" : "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 32px",
                borderLeft: hasPosts ? "1px solid #1A1A1A" : "none",
            }}>
                {/* Logo icon — Borderless & Free-standing */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    color: "#EDEDED",
                }}>
                    <BrandIcon size={46} strokeWidth={1.6} />
                </div>

                <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: "#EDEDED", margin: 0, textAlign: "center" }}>
                    Frame
                </h1>
                <p style={{ fontSize: 13, color: "#666", marginTop: 8, marginBottom: 0, textAlign: "center", lineHeight: 1.6 }}>
                    {hasPosts
                        ? "Explore and share photography\nwith the community."
                        : "A minimal space to share\nand explore photography."}
                </p>

                {/* Stats row (only if posts exist) */}
                {hasPosts && (
                    <div style={{
                        display: "flex", gap: 24, marginTop: 20, marginBottom: 4,
                        padding: "12px 20px", borderRadius: 12,
                        backgroundColor: "#111", border: "1px solid #1A1A1A",
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#EDEDED" }}>{posts.length}+</div>
                            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#444", marginTop: 2 }}>Photos</div>
                        </div>
                        <div style={{ width: 1, backgroundColor: "#1F1F1F" }} />
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#EDEDED" }}>∞</div>
                            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#444", marginTop: 2 }}>Stories</div>
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div style={{ width: 32, height: 1, backgroundColor: "#1F1F1F", margin: "24px 0" }} />

                {/* Buttons */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                    <button
                        onClick={() => navigate("/auth?tab=register")}
                        style={{
                            width: "100%", padding: "11px 16px", borderRadius: 10, border: "none",
                            fontSize: 14, fontWeight: 600, cursor: "pointer",
                            backgroundColor: "#EDEDED", color: "#0A0A0A",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#FFF")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#EDEDED")}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                            <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                        </svg>
                        Create Account
                    </button>
                    <button
                        onClick={() => navigate("/auth?tab=login")}
                        style={{
                            width: "100%", padding: "11px 16px", borderRadius: 10,
                            fontSize: 14, fontWeight: 500, cursor: "pointer",
                            backgroundColor: "transparent", color: "#EDEDED",
                            border: "1px solid #222",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = "#444")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = "#222")}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                            <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                        Sign In
                    </button>
                </div>

                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2E2E2E", marginTop: 36 }}>
                    Visual Archive · Est. 2024
                </p>
            </div>

            <style>{`@media(min-width:768px){.md-bento-panel{display:block!important}}`}</style>
        </div>
    );
};

export default Home;
