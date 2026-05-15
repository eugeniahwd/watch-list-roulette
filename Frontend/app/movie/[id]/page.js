"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

export default function MovieDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [movieRes, creditsRes, similarRes] = await Promise.all([
        fetch(`${BASE}/movie/${id}?api_key=${TMDB_KEY}`),
        fetch(`${BASE}/movie/${id}/credits?api_key=${TMDB_KEY}`),
        fetch(`${BASE}/movie/${id}/similar?api_key=${TMDB_KEY}`),
      ]);
      const [movieData, creditsData, similarData] = await Promise.all([
        movieRes.json(), creditsRes.json(), similarRes.json(),
      ]);
      setMovie(movieData);
      setCast(creditsData.cast?.slice(0, 8) ?? []);
      setSimilar(similarData.results?.filter(m => m.poster_path).slice(0, 8) ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#71717a" }}>Loading...</p>
    </main>
  );

  if (!movie || movie.status_message) return (
    <main style={{ minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#f87171" }}>Film tidak ditemukan.</p>
    </main>
  );

  const backdrop = movie.backdrop_path ? `${IMG}/w1280${movie.backdrop_path}` : null;
  const poster = movie.poster_path ? `${IMG}/w342${movie.poster_path}` : null;
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A";
  const rating = movie.vote_average?.toFixed(1);
  const genres = movie.genres?.map(g => g.name).join(", ");

  return (
    <main style={{ minHeight: "100vh", background: "#09090b", fontFamily: "sans-serif", color: "white" }}>

      {/* Back button */}
      <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: 100 }}>
        <button onClick={() => router.back()} style={{
          background: "rgba(0,0,0,0.7)", border: "1px solid #27272a",
          color: "white", padding: "8px 16px", borderRadius: "100px",
          cursor: "pointer", fontSize: "13px", fontWeight: "600",
          backdropFilter: "blur(8px)",
        }}>← Back</button>
      </div>

      {/* Backdrop */}
      {backdrop && (
        <div style={{ position: "relative", height: "460px", overflow: "hidden" }}>
          <img src={backdrop} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #09090b 100%)" }} />
        </div>
      )}

      {/* Main info */}
      <div style={{ maxWidth: "1000px", margin: backdrop ? "-160px auto 0" : "80px auto 0", padding: "0 32px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-end", flexWrap: "wrap" }}>

          {/* Poster */}
          {poster && (
            <img src={poster} alt={movie.title} style={{
              width: "180px", height: "270px", objectFit: "cover",
              borderRadius: "12px", border: "2px solid #27272a",
              flexShrink: 0, boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }} />
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: "280px", paddingBottom: "8px" }}>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: "800", marginBottom: "8px", lineHeight: 1.2 }}>
              {movie.title}{" "}
              <span style={{ color: "#52525b", fontWeight: "400" }}>({year})</span>
            </h1>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span style={{ color: "#71717a", fontSize: "14px" }}>{genres}</span>
              <span style={{ color: "#71717a", fontSize: "14px" }}>• {runtime}</span>
            </div>
            {/* Rating */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#18181b", border: "1px solid #27272a",
              borderRadius: "12px", padding: "8px 16px", marginBottom: "20px",
            }}>
              <span style={{ color: "#22d3ee", fontSize: "20px", fontWeight: "800" }}>{rating}</span>
              <span style={{ color: "#71717a", fontSize: "13px" }}>/ 10 · {movie.vote_count?.toLocaleString()} votes</span>
            </div>

            {/* Tagline */}
            {movie.tagline && (
              <p style={{ color: "#52525b", fontSize: "14px", fontStyle: "italic", marginBottom: "12px" }}>
                "{movie.tagline}"
              </p>
            )}

            {/* Overview */}
            <p style={{ color: "#a1a1aa", fontSize: "15px", lineHeight: 1.7, maxWidth: "600px" }}>
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Details row */}
        <div style={{
          display: "flex", gap: "40px", flexWrap: "wrap",
          marginTop: "40px", paddingTop: "32px",
          borderTop: "1px solid #18181b",
        }}>
          {[
            { label: "Status", value: movie.status },
            { label: "Language", value: movie.original_language?.toUpperCase() },
            { label: "Budget", value: movie.budget > 0 ? `$${(movie.budget / 1e6).toFixed(0)}M` : "N/A" },
            { label: "Revenue", value: movie.revenue > 0 ? `$${(movie.revenue / 1e6).toFixed(0)}M` : "N/A" },
          ].map(item => (
            <div key={item.label}>
              <p style={{ color: "#52525b", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{item.label}</p>
              <p style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>Top Billed Cast</h2>
            <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "12px", scrollbarWidth: "none" }}>
              {cast.map(person => (
                <div key={person.id} style={{ flexShrink: 0, width: "100px", textAlign: "center" }}>
                  <div style={{ width: "90px", height: "90px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", background: "#18181b" }}>
                    {person.profile_path
                      ? <img src={`${IMG}/w185${person.profile_path}`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#52525b", fontSize: "24px" }}>👤</div>
                    }
                  </div>
                  <p style={{ color: "white", fontSize: "12px", fontWeight: "700", marginBottom: "2px" }}>{person.name}</p>
                  <p style={{ color: "#71717a", fontSize: "11px" }}>{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div style={{ marginTop: "48px", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px" }}>You Might Also Like</h2>
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px", scrollbarWidth: "none" }}>
              {similar.map(m => (
                <div
                  key={m.id}
                  onClick={() => router.push(`/movie/${m.id}`)}
                  style={{ flexShrink: 0, width: "130px", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <img
                    src={`${IMG}/w342${m.poster_path}`}
                    alt={m.title}
                    style={{ width: "100%", height: "195px", objectFit: "cover", borderRadius: "8px", display: "block", marginBottom: "8px" }}
                  />
                  <p style={{ color: "#a1a1aa", fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}