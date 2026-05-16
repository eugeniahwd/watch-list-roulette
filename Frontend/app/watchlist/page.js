"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const IMG = "https://image.tmdb.org/t/p";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => setWatchlist(Array.isArray(data) ? data : []))
        .catch(() => loadFromLocal());
    } else {
      loadFromLocal();
    }
  }, []);

  function loadFromLocal() {
    const raw = localStorage.getItem("watchlist");
    if (raw) setWatchlist(JSON.parse(raw));
  }

  async function handleDelete(tmdb_id) {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch(`${API_URL}/api/watchlist/${tmdb_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      const raw = localStorage.getItem("watchlist");
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem("watchlist", JSON.stringify(list.filter(w => w.tmdb_id !== String(tmdb_id))));
    }
    setWatchlist(prev => prev.filter(w => (w.tmdb_id ?? w.id) !== tmdb_id));
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif", color: "white" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "6px" }}>My Watchlist</h1>
          <p style={{ color: "#71717a", fontSize: "14px" }}>
            {watchlist.length > 0 ? `${watchlist.length} film mau kamu tonton` : "Belum ada film di watchlist"}
          </p>
        </div>

        {watchlist.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#18181b", border: "1px solid #27272a", borderRadius: "20px" }}>
            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🔖</span>
            <p style={{ color: "#52525b", fontSize: "16px", marginBottom: "20px" }}>Belum ada film di watchlist kamu.</p>
            <button onClick={() => router.push("/dashboard")} style={{ padding: "12px 28px", borderRadius: "100px", background: "#06b6d4", color: "#000", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "800" }}>
              Explore Films →
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {watchlist.map((item) => (
            <div
              key={item.id ?? item.tmdb_id}
              style={{ display: "flex", gap: "20px", alignItems: "center", background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "16px", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#3f3f46"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
              onClick={() => router.push(`/movie/${item.tmdb_id}`)}
            >
              <img
                src={`${IMG}/w185${item.poster ?? item.poster_path}`}
                alt={item.title}
                style={{ width: "60px", height: "90px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "6px" }}>{item.title}</p>
                <p style={{ color: "#52525b", fontSize: "12px" }}>Added on {formatDate(item.added_at)}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(item.tmdb_id); }}
                style={{ background: "none", border: "1px solid #27272a", color: "#71717a", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", flexShrink: 0, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#71717a"; }}
              >Remove</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}