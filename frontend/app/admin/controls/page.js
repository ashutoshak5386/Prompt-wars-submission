"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  Info,
  Radio,
  Megaphone,
  Shield,
  DoorOpen,
  Check,
  Wifi,
  WifiOff,
} from "lucide-react";

const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001").replace(/\/$/, "");

const QUICK_ALERTS = [
  { label: "Gate Reassignment", message: "Attention: Gate assignments have been updated. Please check your app for new gate info.", severity: "info", type: "gate-change", icon: DoorOpen, color: "#34d399" },
  { label: "Weather Warning", message: "Light rain expected in 15 minutes. Please move to covered seating areas.", severity: "warning", type: "weather", icon: Radio, color: "#fbbf24" },
  { label: "Security Alert", message: "Security sweep in progress. Please remain in your seats and follow staff instructions.", severity: "warning", type: "security", icon: Shield, color: "#f87171" },
  { label: "Emergency Evacuation", message: "EMERGENCY: Please evacuate the stadium calmly using the nearest exit. Follow staff directions.", severity: "error", type: "emergency", icon: AlertTriangle, color: "#ff4444" },
];

export default function AdminControls() {
  const { connected } = useSocket();
  const router = useRouter();
  const [customMessage, setCustomMessage] = useState("");
  const [customSeverity, setCustomSeverity] = useState("info");
  const [sending, setSending] = useState(false);
  const [sentAlerts, setSentAlerts] = useState([]);

  const sendAlert = async (alertData) => {
    setSending(true);
    try {
      const res = await fetch(`${BACKEND}/api/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertData),
      });
      if (res.ok) {
        const result = await res.json();
        setSentAlerts((prev) => [{ ...result, sentAt: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
      }
    } catch (e) {
      console.error("Failed to send alert:", e);
    }
    setSending(false);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    sendAlert({ message: customMessage, severity: customSeverity, type: "admin" });
    setCustomMessage("");
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
          onClick={() => router.push("/admin")}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontWeight: 700, fontSize: "1rem" }}>Command Center</h1>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Broadcast alerts & manage venue controls</p>
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: "0.75rem",
            color: connected ? "var(--accent-green)" : "var(--accent-red)",
          }}
        >
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? "Connected" : "Offline"}
        </div>
      </header>

      <main style={{ padding: "28px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Left: Controls */}
          <div>
            {/* Quick Alerts */}
            <div className="glass-card animate-fade-in" style={{ padding: "24px", marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Megaphone size={18} style={{ color: "var(--accent-amber)" }} />
                Quick Alerts
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: 18 }}>
                One-click broadcast to all attendees
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {QUICK_ALERTS.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => sendAlert({ message: qa.message, severity: qa.severity, type: qa.type })}
                    disabled={sending}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", borderRadius: 12,
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                      cursor: sending ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                      opacity: sending ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => { if (!sending) { e.currentTarget.style.borderColor = `${qa.color}55`; e.currentTarget.style.background = `${qa.color}08`; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
                  >
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: `${qa.color}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <qa.icon size={18} style={{ color: qa.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{qa.label}</p>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{qa.message.slice(0, 60)}...</p>
                    </div>
                    <Send size={16} style={{ color: "var(--text-muted)" }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Alert */}
            <div className="glass-card animate-fade-in" style={{ padding: "24px" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Info size={18} style={{ color: "var(--accent-cyan)" }} />
                Custom Broadcast
              </h2>
              <form onSubmit={handleCustomSubmit}>
                <textarea
                  className="input-field"
                  placeholder="Type your announcement message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  style={{ resize: "vertical", marginBottom: 14, fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  {[
                    { value: "info", label: "Info", color: "var(--accent-cyan)" },
                    { value: "warning", label: "Warning", color: "var(--accent-amber)" },
                    { value: "error", label: "Critical", color: "var(--accent-red)" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setCustomSeverity(s.value)}
                      style={{
                        flex: 1, padding: "8px", borderRadius: 8,
                        border: `1px solid ${customSeverity === s.value ? s.color : "var(--border-subtle)"}`,
                        background: customSeverity === s.value ? `${s.color}15` : "transparent",
                        color: customSeverity === s.value ? s.color : "var(--text-muted)",
                        cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                        transition: "all 0.2s ease",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!customMessage.trim() || sending}
                  style={{ width: "100%", opacity: !customMessage.trim() || sending ? 0.5 : 1 }}
                >
                  <Send size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
                  Broadcast to All Attendees
                </button>
              </form>
            </div>
          </div>

          {/* Right: Sent History */}
          <div className="glass-card animate-fade-in" style={{ padding: "24px", position: "sticky", top: 90 }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Check size={18} style={{ color: "var(--accent-green)" }} />
              Broadcast History
            </h2>
            {sentAlerts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--text-muted)" }}>
                <Radio size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: "0.85rem" }}>No broadcasts sent yet</p>
                <p style={{ fontSize: "0.75rem", marginTop: 4 }}>Alerts you send will appear here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 500, overflowY: "auto" }}>
                {sentAlerts.map((alert, i) => (
                  <div
                    key={alert.id || i}
                    className="animate-slide-down"
                    style={{
                      padding: "12px 16px", borderRadius: 10,
                      background: "rgba(0,0,0,0.2)",
                      borderLeft: `3px solid ${
                        alert.severity === "error" ? "var(--accent-red)" :
                        alert.severity === "warning" ? "var(--accent-amber)" : "var(--accent-cyan)"
                      }`,
                    }}
                  >
                    <p style={{ fontSize: "0.8rem", fontWeight: 500, lineHeight: 1.4 }}>{alert.message}</p>
                    <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: "0.68rem", color: "var(--text-muted)" }}>
                      <span>Sent at {alert.sentAt}</span>
                      <span style={{
                        padding: "1px 8px", borderRadius: 6, fontWeight: 600, textTransform: "uppercase",
                        background: alert.severity === "error" ? "rgba(248,113,113,0.1)" :
                          alert.severity === "warning" ? "rgba(251,191,36,0.1)" : "rgba(56,189,248,0.1)",
                        color: alert.severity === "error" ? "var(--accent-red)" :
                          alert.severity === "warning" ? "var(--accent-amber)" : "var(--accent-cyan)",
                      }}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
