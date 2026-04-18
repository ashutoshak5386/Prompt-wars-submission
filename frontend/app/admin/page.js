"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import {
  Users,
  Activity,
  AlertTriangle,
  MapPin,
  Clock,
  Wifi,
  WifiOff,
  ArrowLeft,
  Settings,
  Bell,
  TrendingUp,
  ChevronRight,
  Zap,
  Eye,
  Leaf,
} from "lucide-react";

export default function AdminDashboard() {
  const { connected, data, alerts } = useSocket();
  const router = useRouter();

  const zones = data?.zones || [];
  const queues = data?.queues || [];
  const venue = data?.venue || {};

  const totalCapacity = venue.totalCapacity || 45000;
  const attendance = venue.currentAttendance || 0;
  const attendancePct = Math.round((attendance / totalCapacity) * 100);

  const criticalZones = zones.filter((z) => z.congestion === "critical" || z.congestion === "high");
  const avgWait = queues.length > 0 ? Math.round(queues.reduce((s, q) => s + q.waitMinutes, 0) / queues.length) : 0;
  const maxWaitQueue = queues.length > 0 ? queues.reduce((a, b) => (a.waitMinutes > b.waitMinutes ? a : b)) : null;

  const gridRows = 5;
  const gridCols = 5;
  const grid = {};
  zones.forEach((z) => { grid[`${z.row}-${z.col}`] = z; });

  const congestionColor = (level) => {
    switch (level) {
      case "low": return "var(--accent-green)";
      case "moderate": return "var(--accent-amber)";
      case "high": return "var(--accent-red)";
      case "critical": return "#ff4444";
      default: return "var(--text-muted)";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
      <header
        style={{
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(10,14,26,0.95)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #f87171, #fb923c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 13,
            }}
          >
            A
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Admin Dashboard</span>
            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{venue.eventName || "Horizon Stadium"}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: "0.75rem",
              color: connected ? "var(--accent-green)" : "var(--accent-red)",
            }}
          >
            {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {connected ? "Live" : "Offline"}
          </div>
          <button
            className="btn-primary"
            onClick={() => router.push("/admin/controls")}
            style={{ padding: "8px 16px", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Settings size={14} /> Controls
          </button>
        </div>
      </header>

      <main style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Stats Row */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}
          className="stagger"
        >
          {[
            { label: "Attendance", value: attendance.toLocaleString(), sub: `${attendancePct}% capacity`, icon: Users, color: "#38bdf8" },
            { label: "Avg Wait", value: `${avgWait} min`, sub: "across all queues", icon: Clock, color: "#fbbf24" },
            { label: "Alerts", value: alerts.length, sub: "total notifications", icon: Bell, color: "#a78bfa" },
            { label: "Hot Zones", value: criticalZones.length, sub: "high/critical", icon: AlertTriangle, color: criticalZones.length > 0 ? "#f87171" : "#34d399" },
            { label: "Carbon Saved", value: `${venue.carbonSavedKg ? Math.floor(venue.carbonSavedKg) : 0} kg`, sub: `Power ~${venue.powerUsagePct || 100}%`, icon: Leaf, color: "#10b981" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card animate-fade-in"
              style={{ padding: "20px", opacity: 0, display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${stat.color}12`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <p style={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: 2 }}>{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
          {/* Left: Heatmap */}
          <div>
            <div className="glass-card animate-fade-in" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <Eye size={18} style={{ color: "var(--accent-cyan)" }} /> Live Heatmap
                </h2>
                <div style={{ display: "flex", gap: 10, fontSize: "0.68rem" }}>
                  {["Low", "Moderate", "High", "Critical"].map((l) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div
                        className={`congestion-${l.toLowerCase()}`}
                        style={{ width: 10, height: 10, borderRadius: 3 }}
                      />
                      <span style={{ color: "var(--text-muted)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                  gap: 6,
                }}
              >
                {Array.from({ length: gridRows * gridCols }, (_, idx) => {
                  const row = Math.floor(idx / gridCols);
                  const col = idx % gridCols;
                  const zone = grid[`${row}-${col}`];

                  if (!zone) {
                    return (
                      <div
                        key={idx}
                        style={{
                          aspectRatio: "1", borderRadius: 10,
                          background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.04)",
                        }}
                      />
                    );
                  }

                  const pct = zone.capacity > 0 ? Math.round((zone.currentOccupancy / zone.capacity) * 100) : 0;

                  return (
                    <div
                      key={idx}
                      className={`congestion-${zone.congestion || "none"}`}
                      style={{
                        aspectRatio: "1", borderRadius: 10,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        textAlign: "center", padding: 6,
                        transition: "all 0.6s ease", cursor: "default",
                      }}
                      title={`${zone.name}: ${zone.currentOccupancy}/${zone.capacity}`}
                    >
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, lineHeight: 1.2 }}>
                        {zone.name.replace("Sector ", "S").replace("Food Court ", "FC").replace("Restroom ", "WC")}
                      </span>
                      {zone.capacity > 0 && (
                        <span style={{ fontSize: "0.6rem", fontWeight: 600, color: congestionColor(zone.congestion), marginTop: 2 }}>
                          {pct}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Worst Queues */}
            <div className="glass-card animate-fade-in" style={{ padding: "24px", marginTop: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={18} style={{ color: "var(--accent-amber)" }} /> Queue Monitor
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...queues].sort((a, b) => b.waitMinutes - a.waitMinutes).slice(0, 6).map((q) => (
                  <div
                    key={q.id}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 14px", borderRadius: 10,
                      background: "rgba(0,0,0,0.2)",
                    }}
                  >
                    <span style={{ flex: 1, fontSize: "0.82rem", fontWeight: 500 }}>{q.name}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{q.peopleInQueue} people</span>
                    <span
                      style={{
                        fontWeight: 700, fontSize: "0.85rem", minWidth: 50, textAlign: "right",
                        color: q.waitMinutes < 5 ? "var(--accent-green)" : q.waitMinutes < 15 ? "var(--accent-amber)" : "var(--accent-red)",
                      }}
                    >
                      {q.waitMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Alerts */}
          <div className="glass-card animate-fade-in" style={{ padding: "24px", position: "sticky", top: 90 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={18} style={{ color: "var(--accent-red)" }} /> Live Feed
              </h2>
              <span
                style={{
                  fontSize: "0.68rem", fontWeight: 600, padding: "3px 10px",
                  borderRadius: 8, background: "rgba(248,113,113,0.1)", color: "var(--accent-red)",
                }}
              >
                {alerts.length} events
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 500, overflowY: "auto" }}>
              {alerts.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: 20 }}>
                  No events yet...
                </p>
              ) : (
                alerts.slice(0, 15).map((alert, i) => (
                  <div
                    key={alert.id || i}
                    style={{
                      padding: "10px 14px", borderRadius: 8,
                      background: "rgba(0,0,0,0.2)",
                      borderLeft: `3px solid ${alert.severity === "warning" ? "var(--accent-amber)" : "var(--accent-cyan)"}`,
                    }}
                  >
                    <p style={{ fontSize: "0.78rem", fontWeight: 500, lineHeight: 1.4 }}>{alert.message}</p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 4 }}>
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
