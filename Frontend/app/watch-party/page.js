"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const NAV_LINKS = ["Home", "Roulette", "Time-Crunch", "Watch-Party", "Watchlist", "History"];

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

async function spinRoulette({ genres = [] }) {
  const GENRE_MAP = { Action:28, Comedy:35, Horror:27, Romance:10749, "Sci-Fi":878, Thriller:53, Drama:18, Animation:16, Documentary:99, Fantasy:14, Crime:80, Mystery:9648 };
  const ids = genres.map(g => GENRE_MAP[g]).filter(Boolean).join(",");
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&sort_by=vote_average.desc&vote_count.gte=200`;
  if (ids) url += `&with_genres=${ids}`;
  const res = await fetch(url);
  const data = await res.json();
  const pool = data.results?.filter(m => m.poster_path) ?? [];
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * Math.min(pool.length, 10))];
}

async function createPartySession() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BACKEND}/api/watch-party/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({}),
  });
  return res.json();
}

async function joinPartySession(session_code) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BACKEND}/api/watch-party/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ session_code }),
  });
  return res.json();
}

async function fetchMembers(session_code) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BACKEND}/api/watch-party/${session_code}/members`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  return res.json();
}

async function addToWatchlist(tmdb_id, media_type = "movie") {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BACKEND}/api/watchlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ tmdb_id, media_type }),
  });
  return res.json();
}

const IconPopcorn = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/>
    <line x1="10" y1="1" x2="10" y2="4"/>
    <line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);

const IconParty = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.8 11.3 2 22l10.7-3.79"/>
    <path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/>
    <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/>
    <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.1.6-.72.94-1.29.7L17 14"/>
    <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0c-.6.1-.94.72-.7 1.29L10 7"/>
    <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z"/>
  </svg>
);

const IconKey = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="m21 2-9.6 9.6"/>
    <path d="m15.5 7.5 3 3L22 7l-3-3"/>
  </svg>
);

const IconCreate = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const IconCopy = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const IconCheck = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconSpin = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="12" x2="15" y2="15"/>
    <circle cx="12" cy="12" r="1" fill={color}/>
  </svg>
);

const IconSpinning = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin360 0.8s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const IconRefresh = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
  </svg>
);

const IconFilm = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/>
    <line x1="7" y1="2" x2="7" y2="22"/>
    <line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="2" y1="7" x2="7" y2="7"/>
    <line x1="2" y1="17" x2="7" y2="17"/>
    <line x1="17" y1="17" x2="22" y2="17"/>
    <line x1="17" y1="7" x2="22" y2="7"/>
  </svg>
);

const IconUsers = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconHandshake = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
  </svg>
);

const IconWarning = ({ size = 14, color = "#f87171" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

function CodeDisplay({ code }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div style={{ textAlign: "center", margin: "24px 0" }}>
      <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
        Your Party Code
      </p>
      <div style={{ display: "inline-flex", gap: "8px", background: "#09090b", border: "1px solid #22d3ee44", borderRadius: "14px", padding: "16px 24px", marginBottom: "12px" }}>
        {code.split("").map((char, i) => (
          <span key={i} style={{ width: "36px", height: "44px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#18181b", border: "1px solid #27272a", borderRadius: "8px", color: "#22d3ee", fontWeight: "800", fontSize: "22px", fontFamily: "monospace" }}>
            {char}
          </span>
        ))}
      </div>
      <br />
      <button onClick={copy} style={{ padding: "8px 20px", borderRadius: "100px", border: "1px solid #27272a", background: "transparent", color: copied ? "#22d3ee" : "#71717a", fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "6px" }}>
        {copied ? <IconCheck color="#22d3ee" /> : <IconCopy color="#71717a" />}
        {copied ? "Copied!" : "Copy Code"}
      </button>
    </div>
  );
}

function MemberBadge({ name, isNew }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: isNew ? "rgba(34,211,238,0.08)" : "#18181b", border: isNew ? "1px solid rgba(34,211,238,0.4)" : "1px solid #27272a", borderRadius: "100px", padding: "6px 14px", transition: "all 0.3s" }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "11px" }}>
        {name[0].toUpperCase()}
      </div>
      <span style={{ color: isNew ? "#22d3ee" : "#a1a1aa", fontSize: "13px", fontWeight: "600" }}>{name}</span>
      {isNew && <span style={{ fontSize: "10px", color: "#22d3ee", fontWeight: "700" }}>NEW</span>}
    </div>
  );
}

function ResultCard({ movie, onAdd, added }) {
  if (!movie) return null;
  const poster = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);
  return (
    <div style={{ display: "flex", gap: "16px", background: "#18181b", border: "1px solid #22d3ee33", borderRadius: "14px", padding: "16px", animation: "fadeUp 0.4s ease" }}>
      <img src={poster} alt={movie.title} style={{ width: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ color: "#22d3ee", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px" }}>
          <IconFilm color="#22d3ee" /> The Party Picks...
        </p>
        <h3 style={{ color: "white", fontWeight: "800", fontSize: "18px", marginBottom: "4px" }}>{movie.title}</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
          <span style={{ color: "#22d3ee", fontSize: "12px", fontWeight: "700" }}>★ {rating}</span>
          {year && <span style={{ color: "#52525b", fontSize: "12px" }}>{year}</span>}
        </div>
        <p style={{ color: "#71717a", fontSize: "12px", lineHeight: 1.5, marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {movie.overview}
        </p>
        <button onClick={onAdd} disabled={added} style={{ padding: "8px 16px", borderRadius: "100px", border: "none", cursor: added ? "default" : "pointer", background: added ? "#14532d" : "#06b6d4", color: added ? "#86efac" : "#000", fontSize: "12px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          {added ? <IconCheck color="#86efac" size={12} /> : null}
          {added ? "Added to Watchlist" : "+ Add to Watchlist"}
        </button>
      </div>
    </div>
  );
}

export default function WatchPartyPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("Watch-Party");
  const [username, setUsername] = useState("User");
  const [tab, setTab] = useState("create");
  const [sessionCode, setSessionCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [members, setMembers] = useState([]);
  const [prevMembers, setPrevMembers] = useState([]);
  const [sharedGenres, setSharedGenres] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef(null);

  // Ambil username dari localStorage
  useEffect(() => {
    const u = localStorage.getItem("username");
    if (u) setUsername(u);
  }, []);

  useEffect(() => {
    if (phase === "lobby" && sessionCode) {
      pollingRef.current = setInterval(async () => {
        try {
          const data = await fetchState(sessionCode);

          // Update members
          if (data.members?.length > 0) {
            setMembers(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(data.members)) {
                setPrevMembers(prev);
                setTimeout(() => setPrevMembers(data.members), 3000);
              }
              return data.members;
            });
          }

          if (data.spin_result && phase === "lobby") {
            const movie = await fetchMovieById(data.spin_result);
            setResult(movie);
            setPhase("result");
            clearInterval(pollingRef.current);
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 2000);
    } else {
      clearInterval(pollingRef.current);
    }
    return () => clearInterval(pollingRef.current);
  }, [phase, sessionCode]);

  function handleNav(link) {
    setActiveNav(link);
    const routes = { Home: "/dashboard", Roulette: "/roulette", Watchlist: "/watchlist", "Time-Crunch": "/time-crunch", "Watchlist": "/watchlist", History: "/history" };
    if (routes[link]) router.push(routes[link]);
  }

  async function handleCreate() {
    setLoading(true); setError("");
    try {
      const data = await createPartySession();
      if (data.error) throw new Error(data.error);
      
      const membersData = await fetchMembers(data.session_code);
      const initialMembers = membersData.members || [];
      
      setSessionCode(data.session_code);
      setMembers(initialMembers);
      setPrevMembers(initialMembers);
      setPhase("lobby");
    } catch (e) {
      setError(e.message || "Failed to create session");
    } finally { setLoading(false); }
  }

  async function handleJoin() {
    if (joinCode.trim().length !== 6) { setError("Enter a valid 6-character code"); return; }
    setLoading(true); setError("");
    try {
      const data = await joinPartySession(joinCode.trim());
      if (data.error) throw new Error(data.error);
      setSessionCode(data.session_code);
      setMembers(data.members?.length ? data.members : ["You"]);
      setPrevMembers(data.members?.length ? data.members : ["You"]);
      setSharedGenres(data.shared_genres || []);
      setPhase("lobby");
    } catch (e) {
      setError(e.message || "Session not found");
    } finally { setLoading(false); }
  }

  async function handlePartySpin() {
    const genres = sharedGenres.length > 0 ? sharedGenres : ["Action", "Drama", "Comedy"];
    setSpinning(true); setResult(null); setAdded(false);
    const movie = await spinRoulette({ genres });
    setTimeout(() => { setSpinning(false); setResult(movie); setPhase("result"); }, 2000);
  }

  async function handleAddWatchlist() {
    if (!result) return;
    await addToWatchlist(result.id, "movie");
    setAdded(true);
  }

  // fungsi fetch state
  async function fetchState(session_code) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND}/api/watch-party/${session_code}/state`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    return res.json();
  }

  // fungsi save spin result ke BE
  async function saveSpinResult(session_code, tmdb_id) {
    const token = localStorage.getItem("token");
    await fetch(`${BACKEND}/api/watch-party/${session_code}/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ tmdb_id }),
    });
  }

  // fungsi fetch movie dari TMDB by ID
  async function fetchMovieById(tmdb_id) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${TMDB_KEY}`
    );
    return res.json();
  }
  function handleReset() {
    clearInterval(pollingRef.current);
    setPhase("idle"); setSessionCode(""); setJoinCode("");
    setMembers([]); setPrevMembers([]); setSharedGenres([]);
    setResult(null); setAdded(false); setError("");
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1px solid #27272a", background: "#09090b", color: "white",
    fontSize: "15px", outline: "none", boxSizing: "border-box",
    fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif", color: "white" }}>
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin360  { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulse-glow { 0%,100% { box-shadow:0 0 0 0 rgba(34,211,238,0.35); } 50% { box-shadow:0 0 0 14px rgba(34,211,238,0); } }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 70%)" }} />

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

      <div style={{ maxWidth: "540px", margin: "0 auto", padding: "48px 24px" }}>

        {/* phase: idle */}
        {phase === "idle" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "20px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", marginBottom: "16px" }}>
                <IconPopcorn size={32} color="#22d3ee" />
              </div>
              <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>Watch Party</h1>
              <p style={{ color: "#52525b", fontSize: "15px" }}>Get everyone on the same page, spin a film you'll all enjoy.</p>
            </div>

            <div style={{ display: "flex", background: "#09090b", border: "1px solid #27272a", borderRadius: "14px", padding: "4px", marginBottom: "24px" }}>
              {[
                { key: "create", label: "Create Party", icon: <IconCreate color={tab === "create" ? "white" : "#52525b"} /> },
                { key: "join",   label: "Join Party",   icon: <IconKey   color={tab === "join"   ? "white" : "#52525b"} /> },
              ].map(t => (
                <button key={t.key} onClick={() => { setTab(t.key); setError(""); }} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: tab === t.key ? "1px solid rgba(34,211,238,0.2)" : "1px solid transparent", cursor: "pointer", background: tab === t.key ? "#18181b" : "transparent", color: tab === t.key ? "white" : "#52525b", fontSize: "14px", fontWeight: "700", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>
              {tab === "create" && (
                <>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>Start a new session</h2>
                  <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>Create a session and share the 6-digit code with your friends. Once everyone joins, spin together!</p>
                  <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
                    {[
                      { icon: <IconCreate color="#22d3ee" size={16} />, title: "Create session", sub: "Get a unique 6-digit code" },
                      { icon: <IconCopy   color="#22d3ee" size={16} />, title: "Share the code", sub: "Friends join with the code" },
                      { icon: <IconSpin   color="#22d3ee" size={16} />, title: "Spin together",  sub: "Wheel picks from shared genres" },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginTop: i > 0 ? "14px" : 0 }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
                        <div>
                          <p style={{ color: "white", fontSize: "13px", fontWeight: "600", marginBottom: "2px" }}>{s.title}</p>
                          <p style={{ color: "#52525b", fontSize: "12px" }}>{s.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {error && <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}><IconWarning />{error}</p>}
                  <button onClick={handleCreate} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "#164e63" : "#06b6d4", color: loading ? "#71717a" : "#000", fontSize: "15px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", animation: !loading ? "pulse-glow 2s infinite" : "none" }}>
                    {loading ? <IconSpinning color="#71717a" /> : <IconCreate color="#000" size={16} />}
                    {loading ? "Creating..." : "Create Party"}
                  </button>
                </>
              )}

              {tab === "join" && (
                <>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>Join a session</h2>
                  <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>Enter the 6-digit code your friend shared with you.</p>
                  <label style={{ color: "#a1a1aa", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Session Code</label>
                  <input value={joinCode} onChange={e => { setJoinCode(e.target.value.toUpperCase().slice(0, 6)); setError(""); }} placeholder="AB1C2D" maxLength={6} style={{ ...inputStyle, marginBottom: "16px" }} />
                  {error && <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}><IconWarning />{error}</p>}
                  <button onClick={handleJoin} disabled={loading || joinCode.length < 6} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", cursor: (loading || joinCode.length < 6) ? "not-allowed" : "pointer", background: (loading || joinCode.length < 6) ? "#164e63" : "#06b6d4", color: (loading || joinCode.length < 6) ? "#71717a" : "#000", fontSize: "15px", fontWeight: "800", opacity: joinCode.length < 6 ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    {loading ? <IconSpinning color="#71ටa" /> : <IconKey color="#000" size={16} />}
                    {loading ? "Joining..." : "Join Party"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* phase: lobby */}
        {(phase === "lobby" || spinning) && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "16px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", marginBottom: "12px" }}>
                <IconParty size={28} color="#22d3ee" />
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>Party Lobby</h1>
              <p style={{ color: "#52525b", fontSize: "14px" }}>Share the code and spin when everyone's ready</p>
            </div>

            <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "24px", marginBottom: "16px" }}>
              <CodeDisplay code={sessionCode} />
            </div>

            {members.length > 0 && (
              <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
                <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <IconUsers color="#52525b" /> Members ({members.length})
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {members.map((m, i) => (
                    <MemberBadge key={i} name={m} isNew={!prevMembers.includes(m)} />
                  ))}
                </div>
              </div>
            )}

            {sharedGenres.length > 0 && (
              <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
                <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <IconHandshake color="#52525b" /> Shared Genres
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {sharedGenres.map((g, i) => (
                    <span key={i} style={{ padding: "6px 12px", borderRadius: "100px", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee", fontSize: "12px", fontWeight: "600" }}>{g}</span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handlePartySpin} disabled={spinning} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", cursor: spinning ? "not-allowed" : "pointer", background: spinning ? "#164e63" : "linear-gradient(135deg, #06b6d4, #0891b2)", color: spinning ? "#71717a" : "#000", fontSize: "16px", fontWeight: "800", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", animation: !spinning ? "pulse-glow 2s infinite" : "none" }}>
              {spinning ? <IconSpinning color="#71717a" /> : <IconSpin color="#000" />}
              {spinning ? "Spinning for the party..." : "Spin for Everyone!"}
            </button>

            <button onClick={handleReset} style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #27272a", background: "transparent", color: "#52525b", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              Leave Session
            </button>
          </div>
        )}

        {/* phase: result */}
        {phase === "result" && result && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "16px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", marginBottom: "12px" }}>
                <IconParty size={28} color="#22d3ee" />
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>The Party Decides!</h1>
              <p style={{ color: "#52525b", fontSize: "14px" }}>Everyone's watching this tonight</p>
            </div>
            <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "24px", marginBottom: "20px" }}>
              <ResultCard movie={result} onAdd={handleAddWatchlist} added={added} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handlePartySpin} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #27272a", background: "transparent", color: "#a1a1aa", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                <IconRefresh color="#a1a1aa" /> Spin Again
              </button>
              <button onClick={handleReset} style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", background: "#06b6d4", color: "#000", fontSize: "14px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                <IconCreate color="#000" size={16} /> New Party
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}