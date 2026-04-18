"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import {
  MapPin,
  Clock,
  Bell,
  Utensils,
  LogOut,
  Wifi,
  WifiOff,
  ChevronRight,
  Users,
  AlertTriangle,
  TrendingUp,
  Navigation,
  Trophy,
  BadgePercent,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const { connected, data, alerts } = useSocket();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("h2s_user");
    if (!stored) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="shimmer" style={{ width: 200, height: 24 }} />
      </div>
    );
  }

  const userZone = data?.zones?.find((z) => z.id === user.sector);
  const userGateQueue = data?.queues?.find((q) => q.zoneId === user.gate);
  const recentAlerts = alerts.slice(0, 4);
  const activePromo = alerts.find(a => a.type === "promo" && Date.now() - new Date(a.timestamp).getTime() < 120000);
  const displayAlerts = recentAlerts.filter(a => a.id !== activePromo?.id).slice(0, 3);
  const foodQueues = data?.queues?.filter((q) => q.type === "food") || [];
  const bestFood = foodQueues.length > 0 ? foodQueues.reduce((a, b) => (a.waitMinutes < b.waitMinutes ? a : b)) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Top Bar */}
      <header
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(10,14,26,0.95)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 13,
            }}
          >
            H
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Horizon Stadium</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: connected ? "var(--accent-green)" : "var(--accent-red)" }}>
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {connected ? "Live" : "Offline"}
          </div>
          <button
            onClick={() => { localStorage.removeItem("h2s_user"); router.push("/"); }}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main style={{ padding: "24px", maxWidth: 800, margin: "0 auto" }}>
        {/* Welcome */}
        <div className="animate-fade-in" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 6 }}>
            Welcome, {user.name.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 10 }}>
            {data?.venue?.eventName || "IPL 2026 — Qualifier 1"}
            <span style={{ color: "var(--border-subtle)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fbbf24", fontWeight: 700 }}>
              <Trophy size={14} /> {user.points || 0} Pts ({user.tier || "Bronze"})
            </span>
          </p>
        </div>

        {/* AI Promo Banner */}
        {activePromo && (
          <div className="glass-card animate-slide-down" style={{ padding: "16px", marginBottom: 20, background: "linear-gradient(to right, rgba(56,189,248,0.15), rgba(167,139,250,0.15))", border: "1px solid rgba(167,139,250,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #38bdf8, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <BadgePercent size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.95rem", color: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(to right, #38bdf8, #a78bfa)" }}>Flash Offer!</h4>
                <p style={{ fontSize: "0.85rem", fontWeight: 500, marginTop: 2 }}>{activePromo.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Ticket Card */}
        <div
          className="glass-card animate-fade-in"
          style={{
            padding: "24px",
            marginBottom: 20,
            background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(167,139,250,0.08)), var(--bg-card)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>Your Seat</p>
              <p style={{ fontSize: "1.4rem", fontWeight: 700 }}>{user.seat}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
                {userZone?.name || user.sector} • Gate: {user.gate.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: 8,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: user.type === "VIP" ? "rgba(167,139,250,0.2)" : user.type === "Premium" ? "rgba(251,191,36,0.2)" : "rgba(148,163,184,0.15)",
                  color: user.type === "VIP" ? "#a78bfa" : user.type === "Premium" ? "#fbbf24" : "var(--text-secondary)",
                }}
              >
                {user.type}
              </span>
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 8 }}>ID: {user.ticketId}</p>
            </div>
          </div>
          {userZone && (
            <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 10, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
              <Users size={16} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Your zone: <strong style={{ color: userZone.congestion === "low" ? "var(--accent-green)" : userZone.congestion === "high" || userZone.congestion === "critical" ? "var(--accent-red)" : "var(--accent-amber)" }}>
                  {userZone.congestion?.toUpperCase()}
                </strong> congestion ({Math.round((userZone.currentOccupancy / userZone.capacity) * 100)}% full)
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}
          className="stagger"
        >
          {[
            { label: "Live Map", icon: MapPin, color: "#34d399", href: "/map" },
            { label: "Queues", icon: Clock, color: "#fbbf24", href: "/queues" },
            { label: "Alerts", icon: Bell, color: "#f87171", href: "/notifications", badge: recentAlerts.length },
            { label: "Pre-order Food", icon: Utensils, color: "#38bdf8", href: "/queues" },
          ].map((action, i) => (
            <button
              key={i}
              className="glass-card animate-fade-in"
              onClick={() => router.push(action.href)}
              style={{
                padding: "20px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: 0,
                position: "relative",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${action.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{action.label}</span>
              {action.badge > 0 && (
                <span style={{
                  position: "absolute", top: 12, right: 12,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "var(--accent-red)", fontSize: "0.65rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700,
                }}>
                  {action.badge}
                </span>
              )}
              <ChevronRight size={16} style={{ marginLeft: "auto", color: "var(--text-muted)" }} />
            </button>
          ))}
        </div>

        {/* Smart Suggestions */}
        <div className="glass-card animate-fade-in" style={{ padding: "20px", marginBottom: 20 }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} style={{ color: "var(--accent-cyan)" }} />
            Smart Suggestions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {userGateQueue && userGateQueue.waitMinutes > 10 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <AlertTriangle size={16} style={{ color: "var(--accent-amber)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Your gate has a <strong style={{ color: "var(--accent-amber)" }}>{userGateQueue.waitMinutes} min</strong> wait. Consider an alternate entrance.
                </span>
              </div>
            )}
            {bestFood && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
                <Navigation size={16} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Shortest food queue: <strong style={{ color: "var(--accent-green)" }}>{bestFood.name}</strong> ({bestFood.waitMinutes} min wait)
                </span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <MapPin size={16} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Venue attendance: <strong style={{ color: "var(--accent-cyan)" }}>{data?.venue?.currentAttendance?.toLocaleString() || "—"}</strong> / {data?.venue?.totalCapacity?.toLocaleString() || "45,000"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        {displayAlerts.length > 0 && (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 12, color: "var(--text-secondary)" }}>
              Recent Alerts
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {displayAlerts.map((alert, i) => (
                <div
                  key={alert.id || i}
                  className={`alert-toast ${alert.severity === "warning" ? "warning" : "info"}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <p style={{ fontSize: "0.82rem", fontWeight: 500 }}>{alert.message}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }}>
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
