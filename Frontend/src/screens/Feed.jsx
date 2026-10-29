import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../config/api";
import BrandIcon from "../components/BrandIcon";

// Dynamic editorial Bento pattern (36 distinct rhythms before repeating, ~5-6 viewport scroll cycles)
const BENTO_CYCLE = [
    // --- Cluster 1 (Left Hero Anchor) ---
    { gridColumn: "span 2", gridRow: "span 2" }, // 0: Large 2x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 1: Square
    { gridColumn: "span 1", gridRow: "span 2" }, // 2: Tall Portrait
    { gridColumn: "span 1", gridRow: "span 1" }, // 3: Square
    { gridColumn: "span 2", gridRow: "span 1" }, // 4: Wide Cinematic
    { gridColumn: "span 1", gridRow: "span 1" }, // 5: Square
    { gridColumn: "span 1", gridRow: "span 1" }, // 6: Square

    // --- Cluster 2 (Right Tall Anchor) ---
    { gridColumn: "span 1", gridRow: "span 1" }, // 7: Square
    { gridColumn: "span 2", gridRow: "span 1" }, // 8: Wide Cinematic
    { gridColumn: "span 1", gridRow: "span 2" }, // 9: Tall Portrait
    { gridColumn: "span 1", gridRow: "span 1" }, // 10: Square
    { gridColumn: "span 1", gridRow: "span 1" }, // 11: Square
    { gridColumn: "span 1", gridRow: "span 1" }, // 12: Square
    { gridColumn: "span 2", gridRow: "span 2" }, // 13: Large 2x2

    // --- Cluster 3 (Center Hero + Cinematic Banner) ---
    { gridColumn: "span 1", gridRow: "span 1" }, // 14: Square
    { gridColumn: "span 1", gridRow: "span 2" }, // 15: Tall Portrait
    { gridColumn: "span 2", gridRow: "span 2" }, // 16: Large 2x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 17: Square
    { gridColumn: "span 2", gridRow: "span 1" }, // 18: Wide Cinematic
    { gridColumn: "span 1", gridRow: "span 1" }, // 19: Square
    { gridColumn: "span 1", gridRow: "span 1" }, // 20: Square

    // --- Cluster 4 (Full-width Dramatic Spread) ---
    { gridColumn: "span 1", gridRow: "span 1" }, // 21: Square
    { gridColumn: "span 1", gridRow: "span 1" }, // 22: Square
    { gridColumn: "span 2", gridRow: "span 1" }, // 23: Wide Cinematic
    { gridColumn: "span 1", gridRow: "span 2" }, // 24: Tall Portrait
    { gridColumn: "span 1", gridRow: "span 1" }, // 25: Square
    { gridColumn: "span 2", gridRow: "span 2" }, // 26: Large 2x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 27: Square

    // --- Cluster 5 (Twin Columns with Wide Cap) ---
    { gridColumn: "span 2", gridRow: "span 1" }, // 28: Wide Cinematic
    { gridColumn: "span 1", gridRow: "span 2" }, // 29: Tall Portrait
    { gridColumn: "span 1", gridRow: "span 1" }, // 30: Square
    { gridColumn: "span 1", gridRow: "span 1" }, // 31: Square
    { gridColumn: "span 1", gridRow: "span 2" }, // 32: Tall Portrait
    { gridColumn: "span 2", gridRow: "span 2" }, // 33: Large 2x2
    { gridColumn: "span 1", gridRow: "span 1" }, // 34: Square
    { gridColumn: "span 1", gridRow: "span 1" }, // 35: Square
];

const getBentoSpan = (index) => {
    return BENTO_CYCLE[index % BENTO_CYCLE.length];
};


const getAuthorName = (author) => {
    if (!author) return "curator";
    if (typeof author === "string") return author;
    if (typeof author === "object") {
        return author.username || author.name || "curator";
    }
    return "curator";
};

const getAuthorInitial = (author) => {
    const name = getAuthorName(author);
    return name ? name.charAt(0).toUpperCase() : "C";
};

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [updatePostId, setUpdatePostId] = useState(null);
    const [updatedCaptions, setUpdatedCaptions] = useState("");

    useEffect(() => {
        axios
            .get(getApiUrl("/api/posts"))
            .then((res) => {
                const data = Array.isArray(res.data?.posts)
                    ? res.data.posts
                    : Array.isArray(res.data)
                    ? res.data
                    : [];
                setPosts(data);
                setIsLoading(false);
            })
            .catch(() => {
                setError("Failed to load posts.");
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async (_id) => {
        try {
            await axios.delete(getApiUrl(`/api/posts/${_id}`));
            setPosts((prev) => prev.filter((p) => p._id !== _id));
            setMenuOpenId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (_id) => {
        try {
            await axios.patch(getApiUrl(`/api/posts/${_id}`), { caption: updatedCaptions });
            setPosts((prev) => prev.map((p) => (p._id === _id ? { ...p, caption: updatedCaptions } : p)));
            setUpdatePostId(null);
            setUpdatedCaptions("");
            setMenuOpenId(null);
        } catch (err) {
            console.error(err);
        }
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

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#0A0A0A",
                padding: isMobile ? "24px 16px 48px" : "28px 32px 56px",
            }}
        >
            <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
                {/* ── TOP EDITORIAL HEADER ── */}
                <div
                    style={{
                        marginBottom: 28,
                        paddingBottom: 18,
                        borderBottom: "1px solid #1A1A1A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontSize: 9,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                fontFamily: "monospace",
                                letterSpacing: "0.14em",
                                color: "#555555",
                                display: "block",
                                marginBottom: 4,
                            }}
                        >
                            Curated Exhibition & Visual Archive
                        </span>
                        <h1
                            className="font-masthead"
                            style={{
                                fontSize: isMobile ? 26 : 34,
                                color: "#EDEDED",
                                margin: 0,
                                lineHeight: 1.1,
                            }}
                        >
                            The Visual Archive
                        </h1>
                    </div>

                    {/* Right-Side Actions (At exact horizontal level) */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span
                            style={{
                                fontSize: 10,
                                fontFamily: "monospace",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#555555",
                                padding: "6px 10px",
                                border: "1px solid #1C1C1C",
                                borderRadius: 0,
                            }}
                        >
                            {posts.length} {posts.length === 1 ? "EXPOSURE" : "EXPOSURES"}
                        </span>

                        {isLoggedIn ? (
                            <Link
                                to="/create-post"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "8px 16px",
                                    borderRadius: 0, // Laser-sharp
                                    fontSize: 12,
                                    fontWeight: 700,
                                    fontFamily: "monospace",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    backgroundColor: "#EDEDED",
                                    color: "#0A0A0A",
                                    textDecoration: "none",
                                    transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EDEDED")}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Create Post</span>
                            </Link>
                        ) : (
                            <Link
                                to="/auth?tab=login"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "8px 14px",
                                    borderRadius: 0,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    fontFamily: "monospace",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    backgroundColor: "#141414",
                                    border: "1px solid #242424",
                                    color: "#EDEDED",
                                    textDecoration: "none",
                                    transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#444444")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#242424")}
                            >
                                <span>Sign In to Upload</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div style={{ padding: "112px 0", textAlign: "center" }}>
                        <div
                            style={{
                                display: "inline-block",
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                border: "2px solid #222",
                                borderTopColor: "#EDEDED",
                                animation: "spin 0.8s linear infinite",
                                marginBottom: 12,
                            }}
                        />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                        <p style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.12em", color: "#555" }}>
                            Accessing Archive…
                        </p>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <p style={{ padding: "64px 0", textAlign: "center", fontSize: 13, fontFamily: "monospace", color: "#888" }}>
                        {error}
                    </p>
                )}

                {/* ── STITCH BENTO GALLERY HERO (Curator Spotlight) ── */}
                {!isLoading && !error && posts.length > 0 && (
                    <section style={{ marginBottom: 40 }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: isMobile ? "1fr" : posts.length >= 2 ? "7fr 5fr" : "1fr",
                                gap: 12,
                                minHeight: isMobile ? "auto" : "360px",
                            }}
                        >
                            {/* Primary Hero Spotlight Card (posts[0]) */}
                            <div
                                style={{
                                    position: "relative",
                                    overflow: "hidden",
                                    borderRadius: 0,
                                    border: "1px solid #1F1F1F",
                                    backgroundColor: "#111111",
                                    minHeight: isMobile ? "240px" : "360px",
                                }}
                                onMouseEnter={(e) => {
                                    const img = e.currentTarget.querySelector("img");
                                    if (img) img.style.transform = "scale(1.03)";
                                }}
                                onMouseLeave={(e) => {
                                    const img = e.currentTarget.querySelector("img");
                                    if (img) img.style.transform = "scale(1)";
                                }}
                            >
                                <img
                                    src={posts[0].image}
                                    alt={posts[0].caption || "Featured Spotlight"}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                        transition: "transform 0.5s ease",
                                    }}
                                />

                                {/* Top Metadata Badges */}
                                <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <span
                                        style={{
                                            backgroundColor: "#0A0A0A",
                                            border: "1px solid #282828",
                                            padding: "4px 10px",
                                            fontSize: 9,
                                            fontFamily: "monospace",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.12em",
                                            color: "#EDEDED",
                                            borderRadius: 0,
                                        }}
                                    >
                                        ● CURATOR SPOTLIGHT
                                    </span>
                                    <span
                                        style={{
                                            backgroundColor: "rgba(10,10,10,0.75)",
                                            backdropFilter: "blur(6px)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            padding: "4px 10px",
                                            fontSize: 9,
                                            fontFamily: "monospace",
                                            color: "#888888",
                                            borderRadius: 0,
                                        }}
                                    >
                                        RAW · 35MM EXPOSURE
                                    </span>
                                </div>

                                {/* Bottom Gradient & Information */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: isMobile ? "16px" : "24px",
                                        background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)",
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontSize: isMobile ? 16 : 22,
                                            fontWeight: 700,
                                            color: "#EDEDED",
                                            margin: "0 0 6px",
                                            letterSpacing: "-0.02em",
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {posts[0].caption || "Featured Composition"}
                                    </h2>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                                        <div
                                            style={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                backgroundColor: "#222222",
                                                border: "1px solid #333333",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 9,
                                                fontWeight: 700,
                                                color: "#EDEDED",
                                            }}
                                        >
                                            {getAuthorInitial(posts[0].author)}
                                        </div>
                                        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#AAAAAA" }}>
                                            Captured by @{getAuthorName(posts[0].author)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Companion Panel (posts[1] or Manifesto Box) */}
                            {posts.length >= 2 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                        minHeight: isMobile ? "240px" : "360px",
                                    }}
                                >
                                    {/* Secondary Photo Card */}
                                    <div
                                        style={{
                                            flex: 1,
                                            position: "relative",
                                            overflow: "hidden",
                                            borderRadius: 0,
                                            border: "1px solid #1F1F1F",
                                            backgroundColor: "#111111",
                                            minHeight: "170px",
                                        }}
                                        onMouseEnter={(e) => {
                                            const img = e.currentTarget.querySelector("img");
                                            if (img) img.style.transform = "scale(1.03)";
                                        }}
                                        onMouseLeave={(e) => {
                                            const img = e.currentTarget.querySelector("img");
                                            if (img) img.style.transform = "scale(1)";
                                        }}
                                    >
                                        <img
                                            src={posts[1].image}
                                            alt={posts[1].caption || "Archive spotlight"}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                                transition: "transform 0.5s ease",
                                            }}
                                        />
                                        <div style={{ position: "absolute", top: 12, left: 12 }}>
                                            <span
                                                style={{
                                                    backgroundColor: "#0A0A0A",
                                                    border: "1px solid #282828",
                                                    padding: "3px 8px",
                                                    fontSize: 8,
                                                    fontFamily: "monospace",
                                                    letterSpacing: "0.1em",
                                                    color: "#EDEDED",
                                                }}
                                            >
                                                FRAME // 02
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: "14px",
                                                background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)",
                                            }}
                                        >
                                            <p style={{ fontSize: 13, color: "#EDEDED", margin: 0, fontWeight: 600 }}>
                                                {posts[1].caption || "Secondary Exhibition"}
                                            </p>
                                            <span style={{ fontSize: 9, fontFamily: "monospace", color: "#888888", display: "block", marginTop: 2 }}>
                                                @{getAuthorName(posts[1].author)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Third Card or Manifesto Card */}
                                    {posts.length >= 3 ? (
                                        <div
                                            style={{
                                                flex: 1,
                                                position: "relative",
                                                overflow: "hidden",
                                                borderRadius: 0,
                                                border: "1px solid #1F1F1F",
                                                backgroundColor: "#111111",
                                                minHeight: "170px",
                                            }}
                                            onMouseEnter={(e) => {
                                                const img = e.currentTarget.querySelector("img");
                                                if (img) img.style.transform = "scale(1.03)";
                                            }}
                                            onMouseLeave={(e) => {
                                                const img = e.currentTarget.querySelector("img");
                                                if (img) img.style.transform = "scale(1)";
                                            }}
                                        >
                                            <img
                                                src={posts[2].image}
                                                alt={posts[2].caption || "Archive spotlight"}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                    transition: "transform 0.5s ease",
                                                }}
                                            />
                                            <div style={{ position: "absolute", top: 12, left: 12 }}>
                                                <span
                                                    style={{
                                                        backgroundColor: "#0A0A0A",
                                                        border: "1px solid #282828",
                                                        padding: "3px 8px",
                                                        fontSize: 8,
                                                        fontFamily: "monospace",
                                                        letterSpacing: "0.1em",
                                                        color: "#EDEDED",
                                                    }}
                                                >
                                                    FRAME // 03
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    padding: "14px",
                                                    background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)",
                                                }}
                                            >
                                                <p style={{ fontSize: 13, color: "#EDEDED", margin: 0, fontWeight: 600 }}>
                                                    {posts[2].caption || "Tertiary Exhibition"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                flex: 1,
                                                backgroundColor: "#111111",
                                                border: "1px solid #1F1F1F",
                                                borderRadius: 0,
                                                padding: "20px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <BrandIcon size={26} strokeWidth={1.5} />
                                                <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", color: "#888888" }}>
                                                    FRAME ARCHIVE
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 12, color: "#777777", margin: "12px 0 0", lineHeight: 1.5 }}>
                                                A minimal sanctuary for pure light and shadow. Preserving visual narratives across space and time.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </section>
                )}

                {/* ── CONTINUOUS BENTO FEED SECTION ── */}
                {!isLoading && !error && posts.length > 0 && (
                    <div>
                        {/* Section Divider Bar */}
                        <div
                            style={{
                                marginBottom: 20,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 12,
                                borderBottom: "1px solid #161616",
                                paddingBottom: 14,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ width: 6, height: 6, backgroundColor: "#EDEDED", display: "inline-block" }} />
                                <span style={{ fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.14em", color: "#888888" }}>
                                    Full Community Stream
                                </span>
                            </div>
                            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#555555" }}>
                                ALL ARCHIVED WORKS ({posts.length})
                            </span>
                        </div>

                        {/* Asymmetric Non-Repetitive Bento Grid */}
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
                                const span = isMobile
                                    ? index % 7 === 0
                                        ? { gridColumn: "span 2", gridRow: "span 1" }
                                        : { gridColumn: "span 1", gridRow: "span 1" }
                                    : getBentoSpan(index);

                                return (
                                    <div
                                        key={post._id}
                                        style={{
                                            ...span,
                                            position: "relative",
                                            overflow: "hidden",
                                            borderRadius: 0, // Laser sharp
                                            border: "1px solid #1F1F1F",
                                            cursor: "pointer",
                                            backgroundColor: "#111111",
                                        }}
                                        onMouseEnter={(e) => {
                                            const img = e.currentTarget.querySelector("img");
                                            if (img) img.style.transform = "scale(1.04)";
                                            const overlay = e.currentTarget.querySelector(".caption-overlay");
                                            if (overlay) overlay.style.opacity = "1";
                                            const btn = e.currentTarget.querySelector(".menu-btn");
                                            if (btn) btn.style.opacity = "1";
                                        }}
                                        onMouseLeave={(e) => {
                                            const img = e.currentTarget.querySelector("img");
                                            if (img) img.style.transform = "scale(1)";
                                            const overlay = e.currentTarget.querySelector(".caption-overlay");
                                            if (overlay) overlay.style.opacity = "0";
                                            const btn = e.currentTarget.querySelector(".menu-btn");
                                            if (btn && menuOpenId !== post._id) btn.style.opacity = "0";
                                        }}
                                    >
                                        <img
                                            src={post.image}
                                            alt={post.caption || "Post"}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                                transition: "transform 0.5s ease",
                                            }}
                                            loading="lazy"
                                        />

                                        {/* Author watermark chip (always visible on photo) */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                left: 8,
                                                zIndex: 10,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 5,
                                                padding: "3px 8px",
                                                backgroundColor: "rgba(10, 10, 10, 0.72)",
                                                backdropFilter: "blur(6px)",
                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                borderRadius: 0,
                                                pointerEvents: "none",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 14,
                                                    height: 14,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#222222",
                                                    border: "1px solid #333333",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 8,
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    color: "#EDEDED",
                                                }}
                                            >
                                                {getAuthorInitial(post.author)}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 9,
                                                    fontFamily: "monospace",
                                                    color: "#D4D4D4",
                                                    letterSpacing: "0.04em",
                                                }}
                                            >
                                                @{getAuthorName(post.author)}
                                            </span>
                                        </div>

                                        {/* Caption & details overlay (hover) */}
                                        {updatePostId !== post._id && (
                                            <div
                                                className="caption-overlay"
                                                style={{
                                                    position: "absolute",
                                                    inset: "0 0 0 0",
                                                    background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                                                    padding: "14px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "flex-end",
                                                    opacity: 0,
                                                    transition: "opacity 0.2s ease",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                {post.caption && (
                                                    <p
                                                        style={{
                                                            fontSize: 12,
                                                            color: "#EDEDED",
                                                            lineHeight: 1.4,
                                                            margin: "0 0 4px",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {post.caption}
                                                    </p>
                                                )}
                                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                                                    <span style={{ fontSize: 9, fontFamily: "monospace", color: "#888888" }}>
                                                        Captured by
                                                    </span>
                                                    <span style={{ fontSize: 10, fontFamily: "monospace", color: "#EDEDED", fontWeight: 600 }}>
                                                        @{getAuthorName(post.author)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Edit caption inline */}
                                        {updatePostId === post._id && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: "rgba(0,0,0,0.95)",
                                                    padding: 12,
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    value={updatedCaptions}
                                                    onChange={(e) => setUpdatedCaptions(e.target.value)}
                                                    placeholder="Edit caption…"
                                                    style={{
                                                        width: "100%",
                                                        borderRadius: 0,
                                                        padding: "6px 10px",
                                                        fontSize: 12,
                                                        outline: "none",
                                                        boxSizing: "border-box",
                                                        backgroundColor: "#1A1A1A",
                                                        border: "1px solid #2E2E2E",
                                                        color: "#EDEDED",
                                                    }}
                                                    onFocus={(e) => (e.target.style.borderColor = "#444")}
                                                    onBlur={(e) => (e.target.style.borderColor = "#2E2E2E")}
                                                />
                                                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                                    <button
                                                        onClick={() => handleUpdate(post._id)}
                                                        style={{
                                                            borderRadius: 0,
                                                            padding: "4px 12px",
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            backgroundColor: "#EDEDED",
                                                            color: "#0A0A0A",
                                                            border: "none",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUpdatePostId(null);
                                                            setUpdatedCaptions("");
                                                        }}
                                                        style={{
                                                            borderRadius: 0,
                                                            padding: "4px 12px",
                                                            fontSize: 12,
                                                            backgroundColor: "#1A1A1A",
                                                            border: "1px solid #2E2E2E",
                                                            color: "#888",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3-dot menu button */}
                                        <button
                                            className="menu-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpenId(menuOpenId === post._id ? null : post._id);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                padding: 6,
                                                borderRadius: 0,
                                                backgroundColor: "rgba(0,0,0,0.75)",
                                                border: "none",
                                                color: "#EDEDED",
                                                cursor: "pointer",
                                                opacity: menuOpenId === post._id ? 1 : 0,
                                                transition: "opacity 0.15s ease",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
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
                                                    position: "absolute",
                                                    top: 38,
                                                    right: 8,
                                                    width: 128,
                                                    borderRadius: 0,
                                                    backgroundColor: "#1A1A1A",
                                                    border: "1px solid #2E2E2E",
                                                    overflow: "hidden",
                                                    zIndex: 30,
                                                    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setUpdatePostId(post._id);
                                                        setUpdatedCaptions(post.caption || "");
                                                        setMenuOpenId(null);
                                                    }}
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        padding: "10px 14px",
                                                        textAlign: "left",
                                                        fontSize: 12,
                                                        color: "#EDEDED",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#222")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                >
                                                    Edit Caption
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        padding: "10px 14px",
                                                        textAlign: "left",
                                                        fontSize: 12,
                                                        color: "#F87171",
                                                        background: "none",
                                                        borderTop: "1px solid #222",
                                                        cursor: "pointer",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1F0A0A")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
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
                            borderRadius: 0,
                            padding: "40px 20px",
                            userSelect: "none",
                        }}
                    >
                        {/* 1. Center Interactive Architectural Film Slide + Optical Plus (+) SVG */}
                        <Link
                            to={isLoggedIn ? "/create-post" : "/auth?tab=register"}
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.75";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
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
                                <line x1="7" y1="3" x2="7" y2="21" />
                                <line x1="17" y1="3" x2="17" y2="21" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Feed;
