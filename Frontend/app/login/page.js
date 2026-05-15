"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login gagal");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      router.push("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    borderRadius: "10px", border: "1px solid #27272a",
    background: "#09090b", color: "white",
    fontSize: "14px", outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    color: "#a1a1aa", fontSize: "13px",
    fontWeight: "600", display: "block", marginBottom: "6px",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#09090b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "sans-serif",
    }}>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 70%)",
      }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
            <span style={{ color: "white", fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px" }}>FilmRoll</span>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
          </a>
        </div>

        {/* Card */}
        <div style={{
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "20px",
          padding: "32px",
        }}>

          <h1 style={{ color: "white", fontSize: "22px", fontWeight: "800", marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ color: "#71717a", fontSize: "14px", marginBottom: "24px" }}>
            Log in to spin the wheel.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            <div>
              <label style={labelStyle}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. moviebuff99"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={{ marginBottom: "6px" }}>
                <label style={{ color: "#a1a1aa", fontSize: "13px", fontWeight: "600" }}>
                  Password
                </label>
              </div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

          </div>

          {error && (
            <p style={{ color: "#f87171", fontSize: "13px", textAlign: "center", marginTop: "12px" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              marginTop: "24px", borderRadius: "12px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "#164e63" : "#06b6d4",
              color: loading ? "#a1a1aa" : "#000",
              fontSize: "15px", fontWeight: "800",
              transition: "all 0.2s",
            }}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
            <span style={{ color: "#52525b", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
          </div>

          <p style={{ textAlign: "center", color: "#71717a", fontSize: "14px" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "#22d3ee", fontWeight: "700", textDecoration: "none" }}>
              Sign Up
            </a>
          </p>

        </div>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <a href="/" style={{ color: "#52525b", fontSize: "13px", textDecoration: "none" }}>
            ← Back to home
          </a>
        </p>

      </div>
    </main>
  );
}