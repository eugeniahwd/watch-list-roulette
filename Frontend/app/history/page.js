"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const IMG = "https://image.tmdb.org/t/p";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function StarDisplay({ value }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} style={{ fontSize: "14px", color: star <= value ? "#facc15" : "#3f3f46" }}>★</span>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(() => {
  console.log("API_URL:", API_URL);  // tambah ini
  const token = localStorage.getItem("token");
  console.log("token:", token);
  if (token) {
    fetch(`${API_URL}/api/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
  console.log("API status:", r.status);
  return r.json();
})
      .then(async (data) => {
  console.log("API data:", data);
  if (!Array.isArray(data)) return loadFromLocal();
  
  const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const detailed = await Promise.all(
    data.map(async (item) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${item.media_type}/${item.tmdb_id}?api_key=${TMDB_KEY}`
        );
        const movie = await res.json();
        console.log("TMDB result:", movie);
        return {
          ...item,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          rating: item.rating ?? 0,
        };
      } catch (err) {
        console.log("TMDB fetch error:", err);
        return item;
      }
    })
  );
  console.log("detailed:", detailed);
  setHistory(detailed);
})
      .catch((err) => {
  console.log("Fetch error:", err);
  loadFromLocal();
});
  } else {
    loadFromLocal();
  }
}, []);

  function loadFromLocal() {
    const raw = localStorage.getItem("watch_history");
    if (raw) setHistory(JSON.parse(raw));
  }

  async function handleDelete(tmdb_id) {
    const token = localStorage.getItem("token");
    if (token) {
      await fetch(`${API_URL}/api/history/${tmdb_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      const raw = localStorage.getItem("watch_history");
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem("watch_history", JSON.stringify(list.filter(h => h.tmdb_id !== String(tmdb_id))));
    }
    setHistory(prev => prev.filter(h => (h.tmdb_id ?? h.id) !== tmdb_id));
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif", color: "white" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "6px" }}>Your Watch History</h1>
          <p style={{ color: "#71717a", fontSize: "14px" }}>
            {history.length > 0 ? `${history.length} films watched` : "No films watched yet"}
          </p>
        </div>

        {history.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#18181b", border: "1px solid #27272a", borderRadius: "20px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", margin: "0 auto 16px" }}>
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="#52525b" strokeWidth="1.5"/>
              <path d="M2 8h20" stroke="#52525b" strokeWidth="1.5"/>
              <path d="M7 4v4M12 4v4M17 4v4M7 8v12M12 8v12M17 8v12" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ color: "#52525b", fontSize: "16px", marginBottom: "20px" }}>Kamu belum menonton film apapun.</p>
            <button onClick={() => router.push("/dashboard")} style={{ padding: "12px 28px", borderRadius: "100px", background: "#06b6d4", color: "#000", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "800" }}>
              Explore Films →
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {history.map((item) => (
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
                <StarDisplay value={item.rating ?? 0} />
                <p style={{ color: "#52525b", fontSize: "12px", marginTop: "6px" }}>Watched on {formatDate(item.watched_at)}</p>
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