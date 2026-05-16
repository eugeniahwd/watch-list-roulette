"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PRESETS = [
  { label: "Quick Fix", minutes: 30, svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { label: "Lunch Break", minutes: 60, svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> },
  { label: "Movie Night", minutes: 120, svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg> },
  { label: "Binge Mode", minutes: 180, svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> },
];

async function fetchMoviesByDuration(maxMinutes) {
  const min = Math.max(20, maxMinutes - 20);
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&sort_by=popularity.desc&with_runtime.gte=${min}&with_runtime.lte=${maxMinutes}&vote_count.gte=100`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results?.filter(m => m.poster_path) ?? [];
}

function AddMenu({ movie, onClose }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function addToWatchlist() {
    if (token) {
      await fetch(`${API_URL}/api/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tmdb_id: movie.id, media_type: "movie" }),
      });
    } else {
      const raw = localStorage.getItem("watchlist");
      const list = raw ? JSON.parse(raw) : [];
      if (!list.some(w => w.tmdb_id === String(movie.id))) {
        list.unshift({ tmdb_id: String(movie.id), title: movie.title, poster: movie.poster_path, added_at: new Date().toISOString() });
        localStorage.setItem("watchlist", JSON.stringify(list));
      }
    }
    onClose();
  }

  async function addToHistory() {
    if (token) {
      await fetch(`${API_URL}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tmdb_id: movie.id, media_type: "movie" }),
      });
    } else {
      const raw = localStorage.getItem("watch_history");
      const list = raw ? JSON.parse(raw) : [];
      if (!list.some(h => h.tmdb_id === String(movie.id))) {
        list.unshift({ tmdb_id: String(movie.id), title: movie.title, poster: movie.poster_path, rating: 0, watched_at: new Date().toISOString() });
        localStorage.setItem("watch_history", JSON.stringify(list));
      }
    }
    onClose();
  }

  return (
    <div style={{
      position: "absolute", bottom: "36px", right: "8px", zIndex: 20,
      background: "#18181b", border: "1px solid #27272a", borderRadius: "10px",
      overflow: "hidden", minWidth: "160px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    }}>
      <button onClick={addToWatchlist} style={{
        width: "100%", padding: "10px 14px", background: "none", border: "none",
        color: "#a78bfa", fontSize: "13px", fontWeight: "600", cursor: "pointer",
        textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
      }}>
        🔖 Add to Watchlist
      </button>
      <div style={{ height: "1px", background: "#27272a" }} />
      <button onClick={addToHistory} style={{
        width: "100%", padding: "10px 14px", background: "none", border: "none",
        color: "#22d3ee", fontSize: "13px", fontWeight: "600", cursor: "pointer",
        textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
      }}>
        ✓ Mark as Watched
      </button>
    </div>
  );
}

function MovieCard({ movie, onClick }) {
  const [showMenu, setShowMenu] = useState(false);
  const title = movie.title || movie.name;
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div
      onClick={() => onClick(movie.id)}
      style={{ flexShrink: 0, width: "140px", cursor: "pointer", transition: "transform 0.2s", position: "relative" }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={title}
          style={{ width: "100%", height: "210px", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          padding: "20px 8px 8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#22d3ee", fontSize: "11px", fontWeight: "700" }}>{rating} ★</span>
            <button
              onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
              style={{
                background: "rgba(255,255,255,0.15)", border: "none",
                borderRadius: "50%", width: "24px", height: "24px",
                color: "white", fontSize: "14px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >+</button>
          </div>
        </div>
        {showMenu && <AddMenu movie={movie} onClose={() => setShowMenu(false)} />}
      </div>
      <p style={{
        color: "#a1a1aa", fontSize: "12px", fontWeight: "500",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{title}</p>
    </div>
  );
}

export default function TimeCrunchPage() {
  const router = useRouter();
  const [minutes, setMinutes] = useState(90);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (minutes < 20) return;
    setLoading(true);
    setSearched(true);
    const results = await fetchMoviesByDuration(minutes);
    setMovies(results);
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif", color: "white" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
            How much time do you have?
          </h1>
          <p style={{ color: "#71717a", fontSize: "15px" }}>
            We'll find films that fit your schedule.
          </p>
        </div>

        {/* Presets */}
<div style={{
  display: "grid", gridTemplateColumns: "1fr 1fr",
  gap: "12px", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px",
}}>
  {PRESETS.map(p => (
    <button key={p.label} onClick={() => setMinutes(p.minutes)} style={{
      padding: "12px 20px", borderRadius: "12px", cursor: "pointer",
      fontSize: "13px", fontWeight: "600", transition: "all 0.2s",
      border: minutes === p.minutes ? "1.5px solid #22d3ee" : "1.5px solid #27272a",
      background: minutes === p.minutes ? "rgba(34,211,238,0.1)" : "#18181b",
      color: minutes === p.minutes ? "#22d3ee" : "#71717a",
      display: "flex", alignItems: "center", gap: "8px",
    }}>
      {p.svg} {p.label} ({p.minutes}m)
    </button>
  ))}
</div>

        {/* Slider */}
        <div style={{
          background: "#18181b", border: "1px solid #27272a",
          borderRadius: "20px", padding: "32px", marginBottom: "24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
            <span style={{ color: "#a1a1aa", fontSize: "14px" }}>Duration</span>
            <span style={{ color: "#22d3ee", fontWeight: "800", fontSize: "32px" }}>
              {minutes} <span style={{ fontSize: "16px", color: "#71717a" }}>min</span>
            </span>
          </div>
          <input
            type="range" min={20} max={240} step={5}
            value={minutes}
            onChange={e => setMinutes(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#22d3ee", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span style={{ color: "#52525b", fontSize: "12px" }}>20 min</span>
            <span style={{ color: "#52525b", fontSize: "12px" }}>4 hours</span>
          </div>
        </div>

        {/* Search Button */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <button
            onClick={handleSearch}
            disabled={loading || minutes < 20}
            style={{
              padding: "14px 40px", borderRadius: "100px",
              background: loading ? "#164e63" : "#06b6d4",
              color: loading ? "#a1a1aa" : "#000",
              border: "none", cursor: "pointer",
              fontSize: "15px", fontWeight: "800", transition: "all 0.2s",
            }}
          >
            {loading ? "Finding films..." : `Find Films ≤ ${minutes} min →`}
          </button>
        </div>

        {/* Results */}
        {searched && !loading && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "6px" }}>
              {movies.length > 0 ? `${movies.length} films found` : "No films found"}
            </h2>
            <p style={{ color: "#52525b", fontSize: "13px", marginBottom: "20px" }}>
              {movies.length > 0 ? `Fits in your ${minutes}-minute window` : "Try adjusting the duration"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {movies.map(m => (
                <MovieCard key={m.id} movie={m} onClick={(id) => router.push(`/movie/${id}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}