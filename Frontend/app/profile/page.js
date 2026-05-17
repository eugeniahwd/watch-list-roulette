"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [prefMood, setPrefMood] = useState("film");
  const [historyCount, setHistoryCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
  setUsername(localStorage.getItem("username") || "User");
  const token = localStorage.getItem("token");
  if (token) {
    fetch(`${API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          // Hitung film unik berdasarkan tmdb_id
          const unique = new Set(d.map(item => item.tmdb_id));
          setHistoryCount(unique.size);
        }
      }).catch(() => {});
    fetch(`${API_URL}/api/watchlist`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setWatchlistCount(Array.isArray(d) ? d.length : 0))
      .catch(() => {});
  }
}, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/");
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "10px",
    border: "1px solid #27272a", background: "#09090b",
    color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif", color: "white" }}>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "32px", fontWeight: "800", color: "white",
          }}>
            {username[0]?.toUpperCase()}
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "800" }}>{username}</h1>
        </div>

        {/* Stats */}
<div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
  {[
    {
      label: "Films Watched", value: historyCount, route: "/history",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
    },
    {
      label: "Watchlist", value: watchlistCount, route: "/watchlist",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    },
  ].map(stat => (
    <div
      key={stat.label}
      onClick={() => router.push(stat.route)}
      style={{
        flex: 1, background: "#18181b", border: "1px solid #27272a",
        borderRadius: "16px", padding: "20px", textAlign: "center", cursor: "pointer",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#3f3f46"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
    >
      {stat.svg}
      <p style={{ color: "white", fontSize: "28px", fontWeight: "800", margin: "8px 0 4px" }}>{stat.value}</p>
      <p style={{ color: "#71717a", fontSize: "13px" }}>{stat.label}</p>
    </div>
  ))}
</div>

        {/* Info card */}
        <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "32px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "24px" }}>Account Info</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ color: "#a1a1aa", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Username</label>
              <input value={username} disabled style={{ ...inputStyle, color: "#52525b" }} />
            </div>

            <div>
              <label style={{ color: "#a1a1aa", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Preference</label>
              <div style={{ display: "flex", background: "#09090b", borderRadius: "12px", padding: "4px", border: "1px solid #27272a", position: "relative" }}>
                <div style={{
                  position: "absolute", top: "4px", bottom: "4px",
                  width: "calc(50% - 4px)", background: "#18181b",
                  borderRadius: "9px", border: "1px solid rgba(34,211,238,0.3)",
                  transition: "left 0.3s", left: prefMood === "series" ? "calc(50%)" : "4px",
                  pointerEvents: "none",
                }} />
                {[
  { key: "film", label: "Films", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg> },
  { key: "series", label: "Series", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg> },
].map(opt => (
  <button key={opt.key} onClick={() => setPrefMood(opt.key)} style={{
    flex: 1, padding: "10px", background: "transparent", border: "none",
    cursor: "pointer", borderRadius: "9px", zIndex: 1, position: "relative",
    color: prefMood === opt.key ? "#22d3ee" : "#52525b",
    fontSize: "14px", fontWeight: "600", transition: "color 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
  }}>
    {opt.svg} {opt.label}
  </button>
))}
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px",
            background: "transparent", border: "1px solid #27272a",
            color: "#f87171", fontSize: "15px", fontWeight: "700",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.borderColor = "#f87171"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#27272a"; }}
        >
          Log Out
        </button>

      </div>
    </main>
  );
}