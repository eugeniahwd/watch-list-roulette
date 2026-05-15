"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const GENRE_MAP = {
    Action: 28, Comedy: 35, Horror: 27, Romance: 10749,
    "Sci-Fi": 878, Thriller: 53, Drama: 18, Animation: 16,
    Documentary: 99, Fantasy: 14, Crime: 80, Mystery: 9648,
};

async function spinRoulette({ genres = [], maxMinutes }) {
    const ids = genres.map(g => GENRE_MAP[g]).filter(Boolean).join(",");
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&sort_by=vote_average.desc&vote_count.gte=200`;
    if (ids) url += `&with_genres=${ids}`;
    if (maxMinutes) url += `&with_runtime.lte=${maxMinutes}&with_runtime.gte=20`;
    const res = await fetch(url);
    const data = await res.json();
    const pool = data.results?.filter(m => m.poster_path) ?? [];
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * Math.min(pool.length, 10))];
}

async function addToWatchlist(user_id, tmdb_id, media_type = "movie") {
    const res = await fetch(`${BACKEND}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, tmdb_id, media_type }),
    });
    return res.json();
}

const NAV_LINKS = ["Home", "Roulette", "Time-Crunch", "Watch-Party", "Watchlist", "History"];

const GenreIcons = {
    Action: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
    ),
    Comedy: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
    ),
    Horror: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3 6.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
        <line x1="10" y1="21" x2="14" y2="21"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
    ),
    Romance: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    ),
    "Sci-Fi": (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8.5 8H4l3.5 3-1.5 5L12 13l6 3-1.5-5L20 8h-4.5L12 2z"/>
        <circle cx="12" cy="13" r="1"/>
        </svg>
    ),
    Thriller: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
    ),
    Drama: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 7H17a2 2 0 0 0-2 2v.5"/>
        <path d="M6.5 7H7a2 2 0 0 1 2 2v.5"/>
        <path d="M8 16s1.5 2 4 2 4-2 4-2"/>
        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8S2 12 2 12z"/>
        </svg>
    ),
    Animation: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5-2 4-2 4 2 4 2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
    ),
    Documentary: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
        <line x1="7" y1="2" x2="7" y2="22"/>
        <line x1="17" y1="2" x2="17" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="2" y1="7" x2="7" y2="7"/>
        <line x1="2" y1="17" x2="7" y2="17"/>
        <line x1="17" y1="17" x2="22" y2="17"/>
        <line x1="17" y1="7" x2="22" y2="7"/>
        </svg>
    ),
    Fantasy: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    ),
    Crime: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
    ),
    Mystery: (color) => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
    ),
};

const GENRES = [
    { label: "Action",      color: "#ef4444", svgContent: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
    { label: "Comedy",      color: "#f59e0b", svgContent: '<circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="9" r="0.5" fill="white"/><circle cx="15" cy="9" r="0.5" fill="white"/>' },
    { label: "Horror",      color: "#8b5cf6", svgContent: '<path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3 6.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/><line x1="10" y1="21" x2="14" y2="21"/>' },
    { label: "Romance",     color: "#ec4899", svgContent: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="white" stroke="white"/>' },
    { label: "Sci-Fi",      color: "#3b82f6", svgContent: '<path d="M12 2L8.5 8H4l3.5 3-1.5 5L12 13l6 3-1.5-5L20 8h-4.5L12 2z"/>' },
    { label: "Thriller",    color: "#6b7280", svgContent: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="white"/>' },
    { label: "Drama",       color: "#14b8a6", svgContent: '<circle cx="9" cy="12" r="4"/><circle cx="15" cy="12" r="4"/><path d="M9 8c0-2 1-3 3-3s3 1 3 3"/><path d="M6 16c0 2 1.5 3 3 3M18 16c0 2-1.5 3-3 3"/>' },
    { label: "Animation",   color: "#f97316", svgContent: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5-2 4-2 4 2 4 2"/><circle cx="9" cy="9" r="0.5" fill="white"/><circle cx="15" cy="9" r="0.5" fill="white"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>' },
    { label: "Documentary", color: "#84cc16", svgContent: '<rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>' },
    { label: "Fantasy",     color: "#a855f7", svgContent: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
    { label: "Crime",       color: "#64748b", svgContent: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' },
    { label: "Mystery",     color: "#06b6d4", svgContent: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="white"/>' },
];

function SpinWheel({ segments, spinning, targetRotation }) {
    const size = 300;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 10;
    const n = segments.length || 1;
    const anglePerSeg = (2 * Math.PI) / n;

    function polarToCartesian(angle, radius) {
        return {
        x: cx + radius * Math.cos(angle - Math.PI / 2),
        y: cy + radius * Math.sin(angle - Math.PI / 2),
        };
    }

    function segPath(i) {
        const start = i * anglePerSeg;
        const end = start + anglePerSeg;
        const p1 = polarToCartesian(start, r);
        const p2 = polarToCartesian(end, r);
        const large = anglePerSeg > Math.PI ? 1 : 0;
        return "M " + cx + " " + cy + " L " + p1.x + " " + p1.y + " A " + r + " " + r + " 0 " + large + " 1 " + p2.x + " " + p2.y + " Z";
    }

    const rotation = targetRotation !== null
        ? "rotate(" + targetRotation + "deg)"
        : "rotate(0deg)";

    return (
        <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
        <div style={{
            position: "absolute", top: -14, left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderTop: "24px solid #22d3ee",
            zIndex: 10,
            filter: "drop-shadow(0 0 8px rgba(34,211,238,0.8))",
        }} />
        <svg
            width={size} height={size}
            style={{
            transition: spinning ? "transform 4s cubic-bezier(0.25,0.1,0.1,1)" : "none",
            transform: rotation,
            transformOrigin: cx + "px " + cy + "px",
            }}
        >
            <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#27272a" strokeWidth="2" />
            {segments.map((seg, i) => {
            const midAngle = i * anglePerSeg + anglePerSeg / 2;
            const iconPos = polarToCartesian(midAngle, r * 0.65);
            const iconSize = n <= 4 ? 22 : n <= 8 ? 18 : 14;
            // Encode SVG icon sebagai data URL untuk dipakai di <image>
            const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${seg.svgContent || ""}</svg>`;
            const encoded = "data:image/svg+xml;base64," + btoa(svgStr);
            return (
                <g key={i}>
                <path
                    d={segPath(i)}
                    fill={seg.color}
                    stroke="#09090b"
                    strokeWidth="2"
                />
                <image
                    href={encoded}
                    x={iconPos.x - iconSize / 2}
                    y={iconPos.y - iconSize / 2}
                    width={iconSize}
                    height={iconSize}
                    style={{ pointerEvents: "none" }}
                />
                </g>
            );
            })}
            <circle cx={cx} cy={cy} r={22} fill="#09090b" stroke="#27272a" strokeWidth="2" />
            <circle cx={cx} cy={cy} r={10} fill="#22d3ee" />
        </svg>
        </div>
    );
}

function ResultCard({ movie, onAddWatchlist, onSpinAgain, added }) {
    if (!movie) return null;
    const poster = "https://image.tmdb.org/t/p/w342" + movie.poster_path;
    const rating = movie.vote_average?.toFixed(1);
    const year = movie.release_date?.slice(0, 4);

    return (
        <div style={{
        background: "#18181b",
        border: "1px solid rgba(34,211,238,0.2)",
        borderRadius: "16px", padding: "20px",
        boxShadow: "0 0 40px rgba(34,211,238,0.06)",
        animation: "fadeSlideUp 0.4s ease",
        }}>
        <p style={{ color: "#22d3ee", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
            <line x1="7" y1="2" x2="7" y2="22"/>
            <line x1="17" y1="2" x2="17" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="2" y1="7" x2="7" y2="7"/>
            <line x1="2" y1="17" x2="7" y2="17"/>
            <line x1="17" y1="17" x2="22" y2="17"/>
            <line x1="17" y1="7" x2="22" y2="7"/>
            </svg>
            The Wheel Chose...
        </p>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <img src={poster} alt={movie.title} style={{ width: "90px", borderRadius: "8px", flexShrink: 0, objectFit: "cover" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: "800", marginBottom: "6px", lineHeight: 1.2 }}>
                {movie.title}
            </h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                <span style={{ color: "#22d3ee", fontSize: "12px", fontWeight: "700" }}>★ {rating}</span>
                {year && <span style={{ color: "#52525b", fontSize: "12px" }}>{year}</span>}
            </div>
            <p style={{ color: "#71717a", fontSize: "12px", lineHeight: 1.6, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {movie.overview}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={onAddWatchlist} disabled={added} style={{
                padding: "9px 16px", borderRadius: "100px",
                border: "none", cursor: added ? "default" : "pointer",
                background: added ? "#14532d" : "#06b6d4",
                color: added ? "#86efac" : "#000",
                fontSize: "12px", fontWeight: "800", transition: "all 0.2s",
                }}>
                {added ? "✓ Added to Watchlist" : "+ Add to Watchlist"}
                </button>
                <button onClick={onSpinAgain} style={{
                padding: "9px 16px", borderRadius: "100px",
                border: "1px solid #27272a", cursor: "pointer",
                background: "transparent", color: "#a1a1aa",
                fontSize: "12px", fontWeight: "700",
                display: "inline-flex", alignItems: "center", gap: "6px",
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
                </svg>
                Spin Again
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}

export default function RoulettePage() {
    const router = useRouter();
    const [activeNav, setActiveNav] = useState("Roulette");
    const [username] = useState("User");
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [maxMinutes, setMaxMinutes] = useState(120);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [targetRotation, setTargetRotation] = useState(null);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState("");
    const USER_ID = 1;

    function handleNav(link) {
        setActiveNav(link);
        const routes = { Home: "/dashboard", "Time-Crunch": "/time-crunch", "Watch-Party": "/watch-party", History: "/history" };
        if (routes[link]) router.push(routes[link]);
    }

    function toggleGenre(label) {
        setSelectedGenres(prev => {
        const next = new Set(prev);
        next.has(label) ? next.delete(label) : next.add(label);
        return next;
        });
    }

    const wheelSegments = [...selectedGenres].map(label =>
        GENRES.find(g => g.label === label) ?? { label, color: "#374151" }
    );

    async function handleSpin() {
        const genres = [...selectedGenres];
        if (genres.length === 0) { setError("Pilih minimal 1 genre dulu!"); return; }
        setError(""); setResult(null); setAdded(false);

        const n = genres.length;
        const segDeg = 360 / n;
        const idx = Math.floor(Math.random() * n);
        const randomOffset = (Math.random() - 0.5) * segDeg * 0.8;
        const stopAt = (360 - (idx * segDeg + segDeg / 2) + randomOffset + 360) % 360;
        const totalRotation = (targetRotation ?? 0) + 1800 + stopAt;

        setTargetRotation(totalRotation);
        setSpinning(true);

        const movie = await spinRoulette({ genres: [genres[idx]], maxMinutes });
        setTimeout(() => { setSpinning(false); setResult(movie); }, 4200);
    }

    function handleSpinAgain() { setResult(null); setAdded(false); handleSpin(); }

    async function handleAddWatchlist() {
    if (!result) return;

     const watchlistRaw = localStorage.getItem("watchlist");
     const watchlist = watchlistRaw ? JSON.parse(watchlistRaw) : [];
     const exists = watchlist.some(w => w.tmdb_id === String(result.id));

     if (!exists) {
    watchlist.unshift({
      tmdb_id: String(result.id),
      title: result.title,
      poster: result.poster_path,
      added_at: new Date().toISOString(),
    });
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
     }
    setAdded(true);
    }

    const durationLabel =
        maxMinutes <= 60  ? "Quick watch" :
        maxMinutes <= 100 ? "Short film"  :
        maxMinutes <= 140 ? "Standard"    :
        maxMinutes <= 180 ? "Long film"   : "Epic";

    return (
        <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif", color: "white" }}>
        <style>{`
            @keyframes fadeSlideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
            @keyframes pulse-glow  { 0%,100% { box-shadow:0 0 0 0 rgba(34,211,238,0.35); } 50% { box-shadow:0 0 0 14px rgba(34,211,238,0); } }
            @keyframes spin360     { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        `}</style>

        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 65%)" }} />

        {/* Navbar */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "linear-gradient(to bottom, #09090b, rgba(9,9,11,0.95))", borderBottom: "1px solid #18181b", display: "flex", alignItems: "center", padding: "0 48px", height: "64px", gap: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "16px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
            <span style={{ color: "white", fontWeight: "800", fontSize: "18px", letterSpacing: "-0.5px" }}>FilmRoll</span>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
            </div>
            <div style={{ display: "flex", gap: "28px", flex: 1 }}>
            {NAV_LINKS.map(link => (
                <button key={link} onClick={() => handleNav(link)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: link === activeNav ? "700" : "500", color: link === activeNav ? "white" : "#71717a", transition: "color 0.2s", padding: "0" }}>{link}</button>
            ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px" }}>
                {username[0].toUpperCase()}
            </div>
            <span style={{ color: "#a1a1aa", fontSize: "14px" }}>{username}</span>
            </div>
        </nav>

        {/* Content */}
        <div style={{ maxWidth: "980px", margin: "0 auto", padding: "40px 24px" }}>

            <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "36px", fontWeight: "800", color: "white", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="12" x2="15" y2="15"/>
                <circle cx="12" cy="12" r="1" fill="#22d3ee"/>
                <line x1="12" y1="2" x2="12" y2="4"/>
                <line x1="12" y1="20" x2="12" y2="22"/>
                <line x1="2" y1="12" x2="4" y2="12"/>
                <line x1="20" y1="12" x2="22" y2="12"/>
                </svg>
                Genre Wheel
            </h1>
            <p style={{ color: "#52525b", fontSize: "15px" }}>Pick your genres, set a duration, and let the wheel decide.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start", marginBottom: "20px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Genre picker */}
                <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>Pick genres</h3>
                    {selectedGenres.size > 0 && (
                    <span style={{ color: "#22d3ee", fontSize: "12px", fontWeight: "700" }}>{selectedGenres.size} selected</span>
                    )}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {GENRES.map(g => {
                    const active = selectedGenres.has(g.label);
                    return (
                        <button key={g.label} onClick={() => toggleGenre(g.label)} style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "7px 12px", borderRadius: "100px", cursor: "pointer",
                        fontSize: "12px", fontWeight: "500", transition: "all 0.15s",
                        border: active ? "1.5px solid " + g.color : "1.5px solid #27272a",
                        background: active ? g.color + "22" : "#09090b",
                        color: active ? g.color : "#71717a",
                        }}>
                        {GenreIcons[g.label]?.(active ? g.color : "#52525b")}
                        {g.label}
                        </button>
                    );
                    })}
                </div>
                </div>

                {/* Duration slider */}
                <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <h3 style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>Max duration</h3>
                    <div>
                    <span style={{ color: "#22d3ee", fontWeight: "800", fontSize: "20px" }}>{maxMinutes}</span>
                    <span style={{ color: "#52525b", fontSize: "13px" }}> min</span>
                    </div>
                </div>
                <p style={{ color: "#3f3f46", fontSize: "12px", marginBottom: "14px" }}>Min 20 min · {durationLabel}</p>
                <input type="range" min={20} max={240} step={5} value={maxMinutes} onChange={e => setMaxMinutes(Number(e.target.value))} style={{ width: "100%", accentColor: "#22d3ee", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                    <span style={{ color: "#3f3f46", fontSize: "11px" }}>20m</span>
                    <span style={{ color: "#3f3f46", fontSize: "11px" }}>4h</span>
                </div>
                </div>

            </div>

            {/* Spin Wheel */}
            <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "28px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                {wheelSegments.length > 0 ? (
                <SpinWheel segments={wheelSegments} spinning={spinning} targetRotation={targetRotation} />
                ) : (
                <div style={{ textAlign: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#27272a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "12px" }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="2" x2="12" y2="6"/>
                    <line x1="12" y1="18" x2="12" y2="22"/>
                    <line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                    <line x1="19.07" y1="4.93" x2="16.24" y2="7.76"/>
                    <line x1="7.76" y1="16.24" x2="4.93" y2="19.07"/>
                    <circle cx="12" cy="12" r="2"/>
                    </svg>
                    <p style={{ color: "#3f3f46", fontSize: "13px" }}>Select genres to build the wheel</p>
                </div>
                )}
            </div>

            </div>

            {/* Spin button */}
            {error && (
            <p style={{ color: "#f87171", fontSize: "13px", fontWeight: "600", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                {error}
            </p>
            )}
            <button onClick={handleSpin} disabled={spinning} style={{
            width: "100%", padding: "16px", borderRadius: "14px", border: "none",
            cursor: spinning ? "not-allowed" : "pointer",
            background: spinning ? "#164e63" : "linear-gradient(135deg, #06b6d4, #0891b2)",
            color: spinning ? "#71717a" : "#000",
            fontSize: "16px", fontWeight: "800", transition: "all 0.2s",
            marginBottom: "20px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            animation: !spinning && !result ? "pulse-glow 2s infinite" : "none",
            }}>
            {spinning ? (
                <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin360 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Spinning...
                </>
            ) : (
                <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="12" x2="15" y2="15"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                </svg>
                SPIN!
                </>
            )}
            </button>

            {/* Result card */}
            {!result && !spinning && wheelSegments.length > 0 && targetRotation === null && (
            <p style={{ textAlign: "center", color: "#3f3f46", fontSize: "13px" }}>Hit SPIN to get your pick</p>
            )}
            {result && (
            <ResultCard movie={result} onAddWatchlist={handleAddWatchlist} onSpinAgain={handleSpinAgain} added={added} />
            )}
        </div>
        </main>
    );
}