import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import BrandIcon from "../components/BrandIcon";

const BENTO_PREVIEW_SPANS = [
    { gridColumn: "span 2", gridRow: "span 2" }, // 0: Large Hero Card
    { gridColumn: "span 1", gridRow: "span 1" }, // 1: Square
    { gridColumn: "span 1", gridRow: "span 2" }, // 2: Tall Portrait
    { gridColumn: "span 1", gridRow: "span 1" }, // 3: Square
    { gridColumn: "span 2", gridRow: "span 1" }, // 4: Wide Cinematic
    { gridColumn: "span 1", gridRow: "span 1" }, // 5: Square
];

const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    // If already logged in → seamlessly navigate straight to Feed
    useEffect(() => {
        if (localStorage.getItem("isLoggedIn") === "true") {
            navigate("/feed", { replace: true });
            return;
        }
        axios.get(getApiUrl("/api/users/me"))
            .then((res) => {
                if (res.status === 200 && res.data?.user) {
                    localStorage.setItem("isLoggedIn", "true");
                    navigate("/feed", { replace: true });
                }
            })
            .catch(() => {});
    }, [navigate]);

    // Fetch real community photos for the editorial showcase
    useEffect(() => {
        axios.get(getApiUrl("/api/posts"))
            .then((res) => {
                const p = Array.isArray(res.data?.posts)
                    ? res.data.posts
                    : Array.isArray(res.data)
                    ? res.data
                    : [];
                setPosts(p.slice(0, 6));
            })
            .catch(() => setPosts([]));
    }, []);

    const hasPosts = posts.length > 0;

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0A0A0A",
                color: "#EDEDED",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflowX: "hidden",
            }}
        >
            {/* ── TOP EDITORIAL HERO HEADER ── */}
            <header
                style={{
                    borderBottom: "1px solid #1A1A1A",
                    padding: "36px 32px 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    maxWidth: 1380,
                    margin: "0 auto",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {/* Brand & Status Banner */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, userSelect: "none" }}>
                        <div style={{ color: "#EDEDED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <BrandIcon size={46} strokeWidth={1.5} />
                        </div>
                        <div>
                            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, display: "block" }}>
                                Frame
                            </span>
                            <span style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.14em", color: "#666666", marginTop: 4, display: "block" }}>
                                Visual Archive & Exhibition
                            </span>
                        </div>
                    </div>

                    {/* Stats & Format Badges (Laser-Sharp Edgy) */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <div
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#111111",
                                border: "1px solid #1F1F1F",
                                borderRadius: 0,
                                fontSize: 10,
                                fontFamily: "monospace",
                                letterSpacing: "0.08em",
                                color: "#888888",
                            }}
                        >
                            <span style={{ color: "#EDEDED", fontWeight: 700 }}>{posts.length > 0 ? `${posts.length}+` : "0"}</span> WORKS INDEXED
                        </div>
                        <div
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#111111",
                                border: "1px solid #1F1F1F",
                                borderRadius: 0,
                                fontSize: 10,
                                fontFamily: "monospace",
                                letterSpacing: "0.08em",
                                color: "#666666",
                            }}
                        >
                            MEDIUM FORMAT & 35MM
                        </div>
                    </div>
                </div>

                {/* Manifesto & Action Callouts */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginTop: 12 }}>
                    <div style={{ maxWidth: 640 }}>
                        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: "#EDEDED", margin: "0 0 10px", lineHeight: 1.25 }}>
                            A minimal sanctuary for pure light, form, and perspective.
                        </h2>
                        <p style={{ fontSize: 14, color: "#777777", margin: 0, lineHeight: 1.6 }}>
                            Explore curated community photography without algorithms or noise. Designed with an editorial bento grid architecture.
                        </p>
                    </div>

                    {/* Action Buttons (Laser-Sharp High Contrast) */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <Link
                            to="/feed"
                            style={{
                                padding: "12px 22px",
                                backgroundColor: "#EDEDED",
                                color: "#0A0A0A",
                                fontSize: 12,
                                fontWeight: 700,
                                fontFamily: "monospace",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                borderRadius: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EDEDED")}
                        >
                            Explore Archive →
                        </Link>
                        <Link
                            to="/auth?tab=register"
                            style={{
                                padding: "12px 20px",
                                backgroundColor: "#121212",
                                color: "#EDEDED",
                                border: "1px solid #242424",
                                fontSize: 12,
                                fontWeight: 600,
                                fontFamily: "monospace",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                borderRadius: 0,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#444444")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#242424")}
                        >
                            Join as Creator
                        </Link>
                        <Link
                            to="/auth?tab=login"
                            style={{
                                padding: "12px 16px",
                                backgroundColor: "transparent",
                                color: "#777777",
                                fontSize: 12,
                                fontFamily: "monospace",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                transition: "color 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#EDEDED")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#777777")}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── MAIN SHOWCASE STAGE ── */}
            <main
                style={{
                    flex: 1,
                    maxWidth: 1380,
                    margin: "0 auto",
                    width: "100%",
                    padding: "32px 32px 48px",
                    boxSizing: "border-box",
                }}
            >
                {/* Section Title */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 6, height: 6, backgroundColor: "#EDEDED", display: "inline-block" }} />
                        <span style={{ fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.14em", color: "#888888" }}>
                            Curated Exhibition Preview
                        </span>
                    </div>
                    <Link
                        to="/feed"
                        style={{ fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#EDEDED")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
                    >
                        View Full Grid ({posts.length} Shots) →
                    </Link>
                </div>

                {/* If Real Posts Exist → Render Editorial Bento Preview */}
                {hasPosts ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gridAutoRows: "240px",
                            gridAutoFlow: "dense",
                            gap: 12,
                        }}
                    >
                        {posts.map((post, index) => {
                            const span = BENTO_PREVIEW_SPANS[index % BENTO_PREVIEW_SPANS.length];
                            return (
                                <Link
                                    key={post._id}
                                    to="/feed"
                                    style={{
                                        ...span,
                                        position: "relative",
                                        overflow: "hidden",
                                        borderRadius: 0, // Laser-sharp
                                        border: "1px solid #1C1C1C",
                                        backgroundColor: "#111111",
                                        textDecoration: "none",
                                        display: "block",
                                    }}
                                    onMouseEnter={(e) => {
                                        const img = e.currentTarget.querySelector("img");
                                        if (img) img.style.transform = "scale(1.04)";
                                        const overlay = e.currentTarget.querySelector(".bento-hover");
                                        if (overlay) overlay.style.opacity = "1";
                                    }}
                                    onMouseLeave={(e) => {
                                        const img = e.currentTarget.querySelector("img");
                                        if (img) img.style.transform = "scale(1)";
                                        const overlay = e.currentTarget.querySelector(".bento-hover");
                                        if (overlay) overlay.style.opacity = "0";
                                    }}
                                >
                                    <img
                                        src={post.image}
                                        alt={post.caption || "Exhibition shot"}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                            transition: "transform 0.5s ease",
                                        }}
                                        loading="lazy"
                                    />
                                    {/* Subtle Gradient & Metadata on Hover */}
                                    <div
                                        className="bento-hover"
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)",
                                            padding: 16,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-end",
                                            opacity: 0,
                                            transition: "opacity 0.2s ease",
                                        }}
                                    >
                                        <p style={{ fontSize: 13, color: "#EDEDED", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
                                            {post.caption || "Untitled Work"}
                                        </p>
                                        {post.author?.username && (
                                            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#888888", marginTop: 4 }}>
                                                Captured by @{post.author.username}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    /* If No Posts Yet → Minimal Architectural Drafting Canvas (No ugly pill buttons) */
                    <div
                        style={{
                            border: "1px solid #1C1C1C",
                            borderRadius: 0,
                            padding: "80px 24px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                            userSelect: "none",
                        }}
                    >
                        {/* Faint Background Studio Outlines */}
                        <div style={{ position: "absolute", top: "14%", left: "12%", opacity: 0.1, pointerEvents: "none", transform: "rotate(-14deg)" }}>
                            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.2">
                                <rect width="18" height="18" x="3" y="3" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                        <div style={{ position: "absolute", bottom: "16%", right: "12%", opacity: 0.1, pointerEvents: "none", transform: "rotate(16deg)" }}>
                            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#EDEDED" strokeWidth="1.2">
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                <circle cx="12" cy="13" r="3.5" />
                            </svg>
                        </div>

                        {/* Interactive Center Brand Icon */}
                        <Link
                            to="/auth?tab=register"
                            style={{
                                color: "#EDEDED",
                                opacity: 0.25,
                                transition: "all 0.3s ease",
                                textDecoration: "none",
                                display: "inline-flex",
                                marginBottom: 20,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.85";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "0.25";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            title="Initialize Archive"
                        >
                            <BrandIcon size={96} strokeWidth={1.5} />
                        </Link>

                        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "#EDEDED", margin: "0 0 8px" }}>
                            The archive awaits its first photograph.
                        </h3>
                        <p style={{ fontSize: 13, color: "#666666", maxWidth: 420, margin: "0 0 24px", lineHeight: 1.6 }}>
                            Be the first curator to publish high-dynamic-range works to the public gallery.
                        </p>
                        <Link
                            to="/auth?tab=register"
                            style={{
                                padding: "11px 24px",
                                backgroundColor: "#EDEDED",
                                color: "#0A0A0A",
                                fontSize: 12,
                                fontWeight: 700,
                                fontFamily: "monospace",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                borderRadius: 0,
                            }}
                        >
                            Upload First Photograph →
                        </Link>
                    </div>
                )}
            </main>

            {/* ── BOTTOM EDITORIAL FOOTER ── */}
            <footer
                style={{
                    borderTop: "1px solid #161616",
                    padding: "24px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                    maxWidth: 1380,
                    margin: "0 auto",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "#444444" }}>
                    FRAME ARCHIVE · CURATED VISUAL SPACE
                </div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: "#333333" }}>
                    BENTO GRID SYSTEM · EST. 2026
                </div>
            </footer>
        </div>
    );
};

export default Home;
