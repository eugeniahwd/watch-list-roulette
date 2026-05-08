"use client";

import { useState, useEffect } from "react";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function MarqueeRow({ posters, direction = "left", speed = 30 }) {
  const doubled = [...posters, ...posters];
  return (
    <div style={{ overflow: "hidden", display: "flex" }}>
      <div style={{
        display: "flex",
        gap: "12px",
        width: "max-content",
        animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite`,
      }}>
        {doubled.map((src, i) => (
          <div key={i} style={{ flexShrink: 0, width: "128px", height: "192px", borderRadius: "8px", overflow: "hidden", opacity: 0.6 }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [posters, setPosters] = useState([]);

  useEffect(() => {
    async function fetchPosters() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
      );
      const data = await res.json();
      const paths = data.results
        .filter(m => m.poster_path)
        .map(m => `https://image.tmdb.org/t/p/w342${m.poster_path}`);
      setPosters(paths);
    }
    fetchPosters();
  }, []);

  const ROW1 = posters.slice(0, 10);
  const ROW2 = posters.slice(5, 15);
  const ROW3 = posters.slice(10, 20);
  const ROW4 = posters.slice(3, 13);
  const ROW5 = posters.slice(7, 17);

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#000", overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* Marquee background */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        gap: "12px", justifyContent: "center",
        padding: "16px 0",
        transform: "rotate(-3deg) scale(1.1)",
      }}>
        <MarqueeRow posters={ROW1} direction="left" speed={35} />
        <MarqueeRow posters={ROW2} direction="right" speed={28} />
        <MarqueeRow posters={ROW3} direction="left" speed={40} />
        <MarqueeRow posters={ROW4} direction="right" speed={32} />
        <MarqueeRow posters={ROW5} direction="left" speed={38} />
      </div>

      {/* Overlays */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)" }} />

      {/* Navbar */}
      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "15px", height: "15px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
          <span style={{ color: "white", fontWeight: "800", fontSize: "30px", letterSpacing: "-0.5px" }}>FilmRoll</span>
          <span style={{ width: "15px", height: "15px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
        </div>
        <a href="/login" style={{
          padding: "8px 20px", borderRadius: "100px",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white", fontSize: "14px", fontWeight: "700",
          textDecoration: "none",
      }}>
        Log In
      </a>
    </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 16px", marginTop: "-40px" }}>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "800", color: "white", lineHeight: 1.1, marginBottom: "16px", maxWidth: "600px" }}>
          Stop scrolling.<br />
          <span style={{ color: "#22d3ee" }}>Start watching.</span>
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "18px", marginBottom: "8px", maxWidth: "420px" }}>
          Spin the wheel, pick your mood, find your next obsession.
        </p>
        <p style={{ color: "#52525b", fontSize: "14px", marginBottom: "32px" }}>
          Enter your email to get started — it's free.
        </p>

        <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "560px", flexWrap: "wrap", justifyContent: "center" }}>
        <a href="/register" style={{
            padding: "16px 28px", borderRadius: "12px",
            background: "#06b6d4", color: "black",
            fontWeight: "800", fontSize: "14px",
            textDecoration: "none", whiteSpace: "nowrap",
          }}>
            Sign Up →
          </a>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #22d3ee, transparent)", opacity: 0.5 }} />
    </main>
  );
}