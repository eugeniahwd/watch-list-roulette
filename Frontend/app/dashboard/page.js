"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const NAV_LINKS = ["Home", "Roulette", "Time-Crunch", "Watch-Party", "Watchlist", "History"];

async function fetchSection(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.results?.filter(m => m.poster_path) ?? [];
}

function MovieCard({ movie, onMovieClick }) {
  const [showMenu, setShowMenu] = useState(false);
  const title = movie.title || movie.name;
  const rating = movie.vote_average?.toFixed(1);
  const poster = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  async function addToWatchlist(e) {
    e.stopPropagation();
    const token = localStorage.getItem("token");
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
        list.unshift({ tmdb_id: String(movie.id), title: movie.title || movie.name, poster: movie.poster_path, added_at: new Date().toISOString() });
        localStorage.setItem("watchlist", JSON.stringify(list));
      }
    }
    setShowMenu(false);
  }

  async function addToHistory(e) {
    e.stopPropagation();
    const token = localStorage.getItem("token");
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
        list.unshift({ tmdb_id: String(movie.id), title: movie.title || movie.name, poster: movie.poster_path, rating: 0, watched_at: new Date().toISOString() });
        localStorage.setItem("watch_history", JSON.stringify(list));
      }
    }
    setShowMenu(false);
  }

  return (
    <div
      style={{ flexShrink: 0, width: "150px", cursor: "pointer", transition: "transform 0.2s", position: "relative" }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{ position: "relative", borderRadius: "8px", overflow: "visible", marginBottom: "8px" }}>
        <div style={{ borderRadius: "8px", overflow: "hidden" }}>
          <img
            src={poster} alt={title}
            onClick={() => onMovieClick && onMovieClick(movie.id)}
            style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          padding: "20px 8px 8px", borderRadius: "0 0 8px 8px",
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "auto" }}>
            <span
              onClick={() => onMovieClick && onMovieClick(movie.id)}
              style={{ color: "#22d3ee", fontSize: "11px", fontWeight: "700" }}
            >{rating} ★</span>
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

        {showMenu && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", bottom: "36px", right: "8px", zIndex: 50,
              background: "#18181b", border: "1px solid #27272a",
              borderRadius: "10px", overflow: "hidden", minWidth: "160px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            <button onClick={addToWatchlist} style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", color: "#a78bfa", fontSize: "13px", fontWeight: "600", cursor: "pointer", textAlign: "left" }}>
              🔖 Add to Watchlist
            </button>
            <div style={{ height: "1px", background: "#27272a" }} />
            <button onClick={addToHistory} style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", color: "#22d3ee", fontSize: "13px", fontWeight: "600", cursor: "pointer", textAlign: "left" }}>
              ✓ Mark as Watched
            </button>
            <div style={{ height: "1px", background: "#27272a" }} />
            <button onClick={() => setShowMenu(false)} style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", color: "#52525b", fontSize: "13px", cursor: "pointer", textAlign: "left" }}>
              Cancel
            </button>
          </div>
        )}
      </div>
      <p
        onClick={() => onMovieClick && onMovieClick(movie.id)}
        style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
      >{title}</p>
    </div>
  );
}

function Section({ title, movies, onMovieClick }) {
  const scrollRef = useRef(null);

  function scroll(dir) {
    scrollRef.current.scrollBy({ left: dir * 600, behavior: "smooth" });
  }

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{
        color: "white", fontSize: "20px", fontWeight: "800",
        marginBottom: "16px", paddingLeft: "48px",
      }}>{title}</h2>
      <div style={{ position: "relative" }}>
        <button onClick={() => scroll(-1)} style={{
          position: "absolute", left: "0", top: "50%", transform: "translateY(-50%)",
          zIndex: 2, background: "rgba(0,0,0,0.7)", border: "none",
          color: "white", width: "40px", height: "60px",
          cursor: "pointer", fontSize: "18px", borderRadius: "4px",
        }}>‹</button>

        <div ref={scrollRef} style={{
          display: "flex", gap: "12px",
          overflowX: "auto", scrollbarWidth: "none",
          padding: "0 48px",
        }}>
          {movies.map(m => (
            <MovieCard key={m.id} movie={m} onMovieClick={onMovieClick} />
          ))}
        </div>

        <button onClick={() => scroll(1)} style={{
          position: "absolute", right: "0", top: "50%", transform: "translateY(-50%)",
          zIndex: 2, background: "rgba(0,0,0,0.7)", border: "none",
          color: "white", width: "40px", height: "60px",
          cursor: "pointer", fontSize: "18px", borderRadius: "4px",
        }}>›</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [sections, setSections] = useState({
    recommendations: [],
    popular: [],
    romanceComedy: [],
    actionThriller: [],
    kdrama: [],
  });
  const [activeNav, setActiveNav] = useState("Home");
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  useEffect(() => {
    async function loadAll() {
  const BASE = `https://api.themoviedb.org/3`;
  const KEY = `api_key=${TMDB_KEY}`;

  // Ambil genre dari localStorage yang disimpan waktu login
  const storedGenres = localStorage.getItem("user_genres");
  const userGenres = storedGenres ? JSON.parse(storedGenres) : [];

  // Map genre name ke TMDB genre ID
  const GENRE_MAP = {
    Action: 28, Comedy: 35, Horror: 27, Romance: 10749,
    "Sci-Fi": 878, Thriller: 53, Drama: 18, Animation: 16,
    Documentary: 99, Fantasy: 14, Crime: 80, Mystery: 9648,
  };

  const genreIds = userGenres
    .map(g => GENRE_MAP[g])
    .filter(Boolean)
    .join(",");

  const recUrl = genreIds
    ? `${BASE}/discover/movie?${KEY}&with_genres=${genreIds}&sort_by=vote_average.desc&vote_count.gte=100`
    : `${BASE}/movie/top_rated?${KEY}`;

  const [recommendations, popular, romanceComedy, actionThriller, kdrama] = await Promise.all([
    fetchSection(recUrl),
    fetchSection(`${BASE}/movie/popular?${KEY}`),
    fetchSection(`${BASE}/discover/movie?${KEY}&with_genres=10749,35&sort_by=popularity.desc`),
    fetchSection(`${BASE}/discover/movie?${KEY}&with_genres=28,53&sort_by=popularity.desc`),
    fetchSection(`${BASE}/discover/tv?${KEY}&with_original_language=ko&sort_by=popularity.desc`),
  ]);

  setSections({ recommendations, popular, romanceComedy, actionThriller, kdrama });
}
    loadAll();
  }, []);

  function handleNav(link) {
    setActiveNav(link);
    const routes = {
      "Roulette": "/roulette",
      "Time-Crunch": "/time-crunch",
      "Watch-Party": "/watch-party",
      "Watchlist": "/watchlist",
      "History": "/history",
    };
    if (routes[link]) router.push(routes[link]);
  }

  function handleMovieClick(id) {
    router.push(`/movie/${id}`);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "linear-gradient(to bottom, #09090b, rgba(9,9,11,0.95))",
        borderBottom: "1px solid #18181b",
        display: "flex", alignItems: "center",
        padding: "0 48px", height: "64px", gap: "40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "16px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
          <span style={{ color: "white", fontWeight: "800", fontSize: "18px", letterSpacing: "-0.5px" }}>Roulette</span>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
        </div>

        <div style={{ display: "flex", gap: "28px", flex: 1 }}>
          {NAV_LINKS.map(link => (
            <button key={link} onClick={() => handleNav(link)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "14px", fontWeight: link === activeNav ? "700" : "500",
              color: link === activeNav ? "white" : "#71717a",
              transition: "color 0.2s", padding: "0",
            }}>{link}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "800", fontSize: "14px",
          }}>
            {username[0].toUpperCase()}
          </div>
          <span style={{ color: "#a1a1aa", fontSize: "14px" }}>{username}</span>
        </div>
      </nav>

      {/* Content */}
      <div style={{ paddingTop: "32px", paddingBottom: "60px" }}>
        <Section title="Recommendations For You" movies={sections.recommendations} onMovieClick={handleMovieClick} />
        <Section title="Popular Right Now" movies={sections.popular} onMovieClick={handleMovieClick} />
        <Section title="Romance & Comedy" movies={sections.romanceComedy} onMovieClick={handleMovieClick} />
        <Section title="Action & Thriller" movies={sections.actionThriller} onMovieClick={handleMovieClick} />
        <Section title="K-Drama" movies={sections.kdrama} onMovieClick={handleMovieClick} />
      </div>

    </main>
  );
}