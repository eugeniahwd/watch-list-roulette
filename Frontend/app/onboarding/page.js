"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  { label: "Action",      color: "#ef4444" },
  { label: "Comedy",      color: "#f59e0b" },
  { label: "Horror",      color: "#8b5cf6" },
  { label: "Romance",     color: "#ec4899" },
  { label: "Sci-Fi",      color: "#3b82f6" },
  { label: "Thriller",    color: "#6b7280" },
  { label: "Drama",       color: "#14b8a6" },
  { label: "Animation",   color: "#f97316" },
  { label: "Documentary", color: "#84cc16" },
  { label: "Fantasy",     color: "#a855f7" },
  { label: "Crime",       color: "#64748b" },
  { label: "Mystery",     color: "#06b6d4" },
];

const PLATFORMS = [
  "Netflix", "Disney+", "Prime Video",
  "Apple TV+", "HBO Max", "Hulu", "YouTube", "Local Files",
];

const PlatformIcons = {
  "Netflix": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <path d="M8 6v12M16 6v12M8 6l8 12"/>
    </svg>
  ),
  "Disney+": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
    </svg>
  ),
  "Prime Video": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  "Apple TV+": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4"/>
      <path d="M8.5 6C5 6 3 9 3 12c0 4.5 3 9 6 9 1.5 0 2.5-.5 3-1 .5.5 1.5 1 3 1 3 0 6-4.5 6-9 0-3-2-6-5.5-6"/>
    </svg>
  ),
  "HBO Max": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <path d="M8 10v4M16 10v4M8 12h8"/>
    </svg>
  ),
  "Hulu": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <path d="M8 8v8M8 12h8M16 8v8"/>
    </svg>
  ),
  "YouTube": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  ),
  "Local Files": (color) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

function StepDots({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{
          height: "4px", borderRadius: "100px",
          transition: "all 0.3s",
          width: i === current ? "24px" : "8px",
          background: i === current ? "#22d3ee" : i < current ? "rgba(34,211,238,0.3)" : "#27272a",
        }} />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [mood, setMood] = useState("film");

  function toggleGenre(label) {
    setSelectedGenres(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  function togglePlatform(p) {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  }

  async function handleFinish() {
  const token = localStorage.getItem("token");
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        genres: [...selectedGenres],
        platforms: [...selectedPlatforms],
        pref_mood: mood === "film" ? "movie" : mood,
      }),
    });

    if (!res.ok) throw new Error("Gagal simpan preferensi");

    // Simpan juga ke localStorage buat dashboard
    localStorage.setItem("user_genres", JSON.stringify([...selectedGenres]));
    router.push("/dashboard");
  } catch (err) {
    console.error(err);
    // Tetap redirect walau gagal
    localStorage.setItem("user_genres", JSON.stringify([...selectedGenres]));
    router.push("/dashboard");
  }
}

  const btnPrimary = {
    padding: "12px 28px", borderRadius: "100px",
    border: "none", cursor: "pointer",
    background: "#06b6d4", color: "#000",
    fontSize: "14px", fontWeight: "800",
    transition: "all 0.2s",
  };

  const btnSecondary = {
    padding: "12px 28px", borderRadius: "100px",
    border: "1px solid #27272a", cursor: "pointer",
    background: "transparent", color: "#71717a",
    fontSize: "14px", fontWeight: "700",
    transition: "all 0.2s",
  };

  return (
    <main style={{
      minHeight: "100vh", background: "#09090b",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px",
      fontFamily: "sans-serif",
    }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 70%)" }} />

      <div style={{ width: "100%", maxWidth: "520px", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
            <span style={{ color: "white", fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px" }}>FilmRoll</span>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
          </div>
        </div>

        <StepDots current={step} />

        {/* Card */}
        <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "20px", padding: "32px" }}>

          {/* STEP 0 - Genre */}
          {step === 0 && (
            <div>
              <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 1 of 3</p>
              <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}>What genres do you like?</h2>
              <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "20px" }}>Pick as many as you want.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                {GENRES.map(g => {
                  const active = selectedGenres.has(g.label);
                  return (
                    <button key={g.label} onClick={() => toggleGenre(g.label)} style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      padding: "8px 14px", borderRadius: "100px", cursor: "pointer",
                      fontSize: "13px", fontWeight: "500", transition: "all 0.2s",
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#52525b", fontSize: "13px" }}>
                  <span style={{ color: "#22d3ee", fontWeight: "700" }}>{selectedGenres.size}</span> selected
                </span>
                <button onClick={() => setStep(1)} disabled={selectedGenres.size === 0} style={{
                  ...btnPrimary,
                  opacity: selectedGenres.size === 0 ? 0.4 : 1,
                  cursor: selectedGenres.size === 0 ? "not-allowed" : "pointer",
                }}>Continue</button>
              </div>
            </div>
          )}

          {/* Platform */}
          {step === 1 && (
            <div>
              <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 2 of 3</p>
              <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}>Where do you watch?</h2>
              <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "20px" }}>Select all that apply.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                {PLATFORMS.map(p => {
                  const active = selectedPlatforms.has(p);
                  return (
                    <button key={p} onClick={() => togglePlatform(p)} style={{
                      display: "inline-flex", alignItems: "center", gap: "7px",
                      padding: "8px 14px", borderRadius: "10px", cursor: "pointer",
                      fontSize: "13px", fontWeight: "500", transition: "all 0.2s",
                      border: active ? "1.5px solid #22d3ee" : "1.5px solid #27272a",
                      background: active ? "rgba(34,211,238,0.1)" : "#09090b",
                      color: active ? "#22d3ee" : "#71717a",
                    }}>
                      {PlatformIcons[p]?.(active ? "#22d3ee" : "#52525b")}
                      {p}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => setStep(0)} style={btnSecondary}>Back</button>
                <button onClick={() => setStep(2)} disabled={selectedPlatforms.size === 0} style={{
                  ...btnPrimary,
                  opacity: selectedPlatforms.size === 0 ? 0.4 : 1,
                  cursor: selectedPlatforms.size === 0 ? "not-allowed" : "pointer",
                }}>Continue</button>
              </div>
            </div>
          )}

          {/* Mood */}
          {step === 2 && (
            <div>
              <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 3 of 3</p>
              <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}>What do you prefer?</h2>
              <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "20px" }}>You can always change this later.</p>
              <div style={{ position: "relative", display: "flex", background: "#09090b", borderRadius: "14px", padding: "4px", border: "1px solid #27272a", marginBottom: "24px" }}>
                <div style={{
                  position: "absolute", top: "4px", bottom: "4px",
                  width: "calc(50% - 4px)", background: "#18181b",
                  borderRadius: "11px", border: "1px solid rgba(34,211,238,0.3)",
                  transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  left: mood === "series" ? "calc(50%)" : "4px",
                  pointerEvents: "none",
                }} />
                {[
                  {
                    key: "film", label: "Films", sub: "Short escape",
                    icon: (color) => (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                        <line x1="7" y1="2" x2="7" y2="22"/>
                        <line x1="17" y1="2" x2="17" y2="22"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <line x1="2" y1="7" x2="7" y2="7"/>
                        <line x1="2" y1="17" x2="7" y2="17"/>
                        <line x1="17" y1="17" x2="22" y2="17"/>
                        <line x1="17" y1="7" x2="22" y2="7"/>
                      </svg>
                    ),
                  },
                  {
                    key: "series", label: "TV Series", sub: "Deep dive",
                    icon: (color) => (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    ),
                  },
                ].map(opt => (
                  <button key={opt.key} onClick={() => setMood(opt.key)} style={{
                    flex: 1, padding: "16px 8px", textAlign: "center",
                    background: "transparent", border: "none", cursor: "pointer",
                    borderRadius: "11px", zIndex: 1, position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                  }}>
                    {opt.icon(mood === opt.key ? "#22d3ee" : "#3f3f46")}
                    <span style={{ display: "block", fontSize: "14px", fontWeight: "700", color: mood === opt.key ? "#22d3ee" : "#52525b" }}>{opt.label}</span>
                    <span style={{ display: "block", fontSize: "11px", color: mood === opt.key ? "#71717a" : "#3f3f46" }}>{opt.sub}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => setStep(1)} style={btnSecondary}>Back</button>
                <button onClick={handleFinish} style={btnPrimary}>Let's go! →</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}