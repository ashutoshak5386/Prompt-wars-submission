"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ticket,
  ArrowRight,
  Shield,
  Zap,
  MapPin,
  Wifi,
  ChevronRight,
} from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const FEATURES = [
  {
    icon: MapPin,
    title: "Live Crowd Map",
    desc: "Real-time congestion heatmap across all stadium zones",
    color: "#34d399",
  },
  {
    icon: Zap,
    title: "Smart Queues",
    desc: "AI-optimized wait times for food, restrooms & gates",
    color: "#fbbf24",
  },
  {
    icon: Wifi,
    title: "Instant Alerts",
    desc: "Push notifications for gate changes & emergencies",
    color: "#38bdf8",
  },
  {
    icon: Shield,
    title: "Admin Controls",
    desc: "Full venue command center for staff & security",
    color: "#a78bfa",
  },
];

export default function HomePage() {
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) {
      setError("Please enter a ticket ID");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/tickets/${ticketId.trim()}`);
      if (!res.ok) {
        setError("Ticket not found. Try: DEMO, TKT-2026-0001, TKT-2026-0002");
        setLoading(false);
        return;
      }
      const user = await res.json();
      localStorage.setItem("h2s_user", JSON.stringify(user));
      router.push("/dashboard");
    } catch {
      setError("Cannot connect to server. Make sure backend is running on port 3001.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(ellipse at 20% 0%, rgba(56,189,248,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(167,139,250,0.08) 0%, transparent 50%), var(--bg-primary)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            H
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            Horizon Stadium
          </span>
        </div>
        <button
          className="btn-ghost"
          onClick={() => router.push("/admin")}
          style={{ fontSize: "0.8rem", padding: "8px 16px" }}
        >
          Admin Panel <ChevronRight size={14} />
        </button>
      </header>

      {/* Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px 60px",
          textAlign: "center",
        }}
      >
        <div className="animate-fade-in" style={{ maxWidth: 520 }}>
          {/* Event badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(56,189,248,0.1)",
              border: "1px solid rgba(56,189,248,0.2)",
              fontSize: "0.78rem",
              color: "var(--accent-cyan)",
              marginBottom: 28,
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#34d399",
                animation: "pulse-glow 2s infinite",
              }}
            />
            IPL 2026 — Qualifier 1 • Gates Open
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 16,
              background: "linear-gradient(135deg, #f1f5f9 30%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Smart Stadium Experience
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              marginBottom: 36,
            }}
          >
            Navigate the venue, skip the queues, and get real-time alerts — all
            from your phone.
          </p>

          {/* Ticket Entry Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 16,
              maxWidth: 440,
              margin: "0 auto 16px",
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <Ticket
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                className="input-field"
                placeholder="Enter Ticket ID (e.g. DEMO)"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Checking..." : "Enter"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {error && (
            <p
              style={{
                color: "var(--accent-red)",
                fontSize: "0.85rem",
                marginBottom: 12,
              }}
            >
              {error}
            </p>
          )}

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.78rem",
            }}
          >
            Demo IDs: <code style={{ color: "var(--accent-cyan)" }}>DEMO</code>,{" "}
            <code style={{ color: "var(--accent-cyan)" }}>TKT-2026-0001</code>,{" "}
            <code style={{ color: "var(--accent-cyan)" }}>TKT-2026-0002</code>
          </p>
        </div>

        {/* Feature Cards */}
        <div
          className="stagger"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            maxWidth: 900,
            width: "100%",
            marginTop: 56,
            padding: "0 8px",
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in"
              style={{
                padding: "24px 20px",
                opacity: 0,
                animationDelay: `${0.1 + i * 0.1}s`,
              }}
            >
              <f.icon
                size={28}
                style={{ color: f.color, marginBottom: 12 }}
              />
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  marginBottom: 6,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
