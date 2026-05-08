"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GENRES = [
  { label: "Action", emoji: "💥" },
  { label: "Comedy", emoji: "😂" },
  { label: "Horror", emoji: "👻" },
  { label: "Romance", emoji: "💕" },
  { label: "Sci-Fi", emoji: "🚀" },
  { label: "Thriller", emoji: "🔪" },
  { label: "Drama", emoji: "🎭" },
  { label: "Animation", emoji: "🎨" },
  { label: "Documentary", emoji: "📽️" },
  { label: "Fantasy", emoji: "🐉" },
  { label: "Crime", emoji: "🕵️" },
  { label: "Mystery", emoji: "🔍" },
];

const PLATFORMS = [
  "Netflix", "Disney+", "Prime Video",
  "Apple TV+", "HBO Max", "Hulu", "YouTube", "Local Files",
];

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

  function handleFinish() {
    // TODO: simpan ke API nanti
    router.push("/dashboard");
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
            <span style={{ color: "white", fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px" }}>Roulette</span>
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
                {GENRES.map(g => (
                  <button key={g.label} onClick={() => toggleGenre(g.label)} style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "8px 14px", borderRadius: "100px", cursor: "pointer",
                    fontSize: "13px", fontWeight: "500", transition: "all 0.2s",
                    border: selectedGenres.has(g.label) ? "1.5px solid #22d3ee" : "1.5px solid #27272a",
                    background: selectedGenres.has(g.label) ? "rgba(34,211,238,0.1)" : "#09090b",
                    color: selectedGenres.has(g.label) ? "#22d3ee" : "#71717a",
                  }}>
                    <span>{g.emoji}</span>{g.label}
                  </button>
                ))}
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

          {/* STEP 1 - Platform */}
          {step === 1 && (
            <div>
              <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 2 of 3</p>
              <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}>Where do you watch?</h2>
              <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "20px" }}>Select all that apply.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                {PLATFORMS.map(p => (
                  <button key={p} onClick={() => togglePlatform(p)} style={{
                    padding: "8px 16px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "13px", fontWeight: "500", transition: "all 0.2s",
                    border: selectedPlatforms.has(p) ? "1.5px solid #22d3ee" : "1.5px solid #27272a",
                    background: selectedPlatforms.has(p) ? "rgba(34,211,238,0.1)" : "#09090b",
                    color: selectedPlatforms.has(p) ? "#22d3ee" : "#71717a",
                  }}>
                    {p}
                  </button>
                ))}
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

          {/* STEP 2 - Mood */}
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
                  { key: "film", emoji: "🎬", label: "Films", sub: "Short escape" },
                  { key: "series", emoji: "📺", label: "TV Series", sub: "Deep dive" },
                ].map(opt => (
                  <button key={opt.key} onClick={() => setMood(opt.key)} style={{
                    flex: 1, padding: "16px 8px", textAlign: "center",
                    background: "transparent", border: "none", cursor: "pointer",
                    borderRadius: "11px", zIndex: 1, position: "relative",
                  }}>
                    <span style={{ fontSize: "24px", display: "block", marginBottom: "4px" }}>{opt.emoji}</span>
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