"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = ["Home", "Roulette", "Time-Crunch", "Watch-Party", "Watchlist", "History"];

const ROUTES = {
  "Home": "/dashboard",
  "Roulette": "/roulette",
  "Time-Crunch": "/time-crunch",
  "Watch-Party": "/watch-party",
  "Watchlist": "/watchlist",
  "History": "/history",
};

const PATH_TO_NAV = {
  "/dashboard": "Home",
  "/roulette": "Roulette",
  "/time-crunch": "Time-Crunch",
  "/watch-party": "Watch-Party",
  "/watchlist": "Watchlist",
  "/history": "History",
  "/profile": "",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("User");
  const activeNav = PATH_TO_NAV[pathname] ?? "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("username");
      if (stored) setUsername(stored);
    }
  }, [pathname]);

  function handleNav(link) {
    if (ROUTES[link]) router.push(ROUTES[link]);
  }

  function handleProfileClick() {
    router.push("/profile");
  }

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "linear-gradient(to bottom, #09090b, rgba(9,9,11,0.95))",
      borderBottom: "1px solid #18181b",
      display: "flex", alignItems: "center",
      padding: "0 48px", height: "64px", gap: "40px",
    }}>
      <div
        onClick={() => router.push("/dashboard")}
        style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "16px", cursor: "pointer" }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
        <span style={{ color: "white", fontWeight: "800", fontSize: "18px", letterSpacing: "-0.5px" }}>FilmRoll</span>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22d3ee", display: "inline-block" }} />
      </div>

      <div style={{ display: "flex", gap: "28px", flex: 1 }}>
        {NAV_LINKS.map(link => (
          <button key={link} onClick={() => handleNav(link)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "14px", fontWeight: link === activeNav ? "700" : "500",
            color: link === activeNav ? "white" : "#71717a",
            transition: "color 0.2s", padding: "0",
          }}>{link}</button>
        ))}
      </div>

      <button
        onClick={handleProfileClick}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: "none", border: "none", padding: "0" }}
      >
        <div style={{
          width: "34px", height: "34px", borderRadius: "50%",
          background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: "800", fontSize: "14px",
        }}>
          {username[0].toUpperCase()}
        </div>
        <span style={{ color: "#a1a1aa", fontSize: "14px" }}>{username}</span>
      </button>
    </nav>
  );
}