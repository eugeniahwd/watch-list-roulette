"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const IMG = "https://image.tmdb.org/t/p";

export default function WatchlistPage() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("watchlist");
    if (raw) setWatchlist(JSON.parse(raw));
  }, []);

  function handleDelete(tmdb_id) {
    const updated = watchlist.filter(w => w.tmdb_id !== tmdb_id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
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
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
          <span style={{ color: "white", fontWeight: "800", fontSize: "18px" }}>My Watchlist</span>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "6px" }}>My Watchlist</h1>
          <p style={{ color: "#71717a", fontSize: "14px" }}>
            {watchlist.length > 0
              ? `${watchlist.length} film mau kamu tonton`
              : "Belum ada film di watchlist"}
          </p>
        </div>

        {/* Empty state */}
        {watchlist.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#18181b", border: "1px solid #27272a",
            borderRadius: "20px",
          }}>
            <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🔖</span>
            <p style={{ color: "#52525b", fontSize: "16px", marginBottom: "20px" }}>
              Belum ada film di watchlist kamu.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                padding: "12px 28px", borderRadius: "100px",
                background: "#06b6d4", color: "#000",
                border: "none", cursor: "pointer",
                fontSize: "14px", fontWeight: "800",
              }}
            >
              Explore Films →
            </button>
          </div>
        )}

        {/* Watchlist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {watchlist.map((item) => (
            <div
              key={item.tmdb_id}
              style={{
                display: "flex", gap: "20px", alignItems: "center",
                background: "#18181b", border: "1px solid #27272a",
                borderRadius: "16px", padding: "16px",
                cursor: "pointer", transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#3f3f46"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#27272a"}
              onClick={() => router.push(`/movie/${item.tmdb_id}`)}
            >
              {/* Poster */}
              <img
                src={`${IMG}/w185${item.poster}`}
                alt={item.title}
                style={{
                  width: "60px", height: "90px", objectFit: "cover",
                  borderRadius: "8px", flexShrink: 0,
                }}
              />

              {/* Info */}
              <div style={{ flex: 1 }}>
                <p style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "6px" }}>
                  {item.title}
                </p>
                <p style={{ color: "#52525b", fontSize: "12px" }}>
                  Added on {formatDate(item.added_at)}
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={e => { e.stopPropagation(); handleDelete(item.tmdb_id); }}
                style={{
                  background: "none", border: "1px solid #27272a",
                  color: "#71717a", borderRadius: "8px",
                  padding: "6px 12px", cursor: "pointer",
                  fontSize: "12px", flexShrink: 0,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.color = "#71717a"; }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}