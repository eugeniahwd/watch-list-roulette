"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const PRESETS = [
  { label: "Quick Fix", minutes: 30, emoji: "⚡" },
  { label: "Lunch Break", minutes: 60, emoji: "🍜" },
  { label: "Movie Night", minutes: 120, emoji: "🎬" },
  { label: "Binge Mode", minutes: 180, emoji: "🛋️" },
];

async function fetchMoviesByDuration(maxMinutes) {
  const min = Math.max(20, maxMinutes - 20);
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&sort_by=popularity.desc&with_runtime.gte=${min}&with_runtime.lte=${maxMinutes}&vote_count.gte=100`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results?.filter(m => m.poster_path) ?? [];
}

function MovieCard({ movie, onClick }) {
  const title = movie.title || movie.name;
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div
      onClick={() => onClick(movie.id)}
      style={{ flexShrink: 0, width: "140px", cursor: "pointer", transition: "transform 0.2s" }}
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
          <span style={{ color: "#22d3ee", fontSize: "11px", fontWeight: "700" }}>{rating} ★</span>
        </div>
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

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(9,9,11,0.95)", borderBottom: "1px solid #18181b",
        display: "flex", alignItems: "center", padding: "0 48px", height: "64px", gap: "16px",
      }}>
        <button onClick={() => router.push("/dashboard")} style={{
          background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: "14px",
        }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
          <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>Time-Crunch</span>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
        </div>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ fontSize: "40px" }}>⏱️</span>
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>
            How much time do you have?
          </h1>
          <p style={{ color: "#71717a", fontSize: "15px" }}>
            We'll find films that fit your schedule.
          </p>
        </div>

        {/* Presets */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}>
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => setMinutes(p.minutes)} style={{
              padding: "10px 20px", borderRadius: "100px", cursor: "pointer",
              fontSize: "13px", fontWeight: "600", transition: "all 0.2s",
              border: minutes === p.minutes ? "1.5px solid #22d3ee" : "1.5px solid #27272a",
              background: minutes === p.minutes ? "rgba(34,211,238,0.1)" : "#18181b",
              color: minutes === p.minutes ? "#22d3ee" : "#71717a",
            }}>
              {p.emoji} {p.label} ({p.minutes}m)
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