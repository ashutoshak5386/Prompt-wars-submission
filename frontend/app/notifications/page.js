"use client";

import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { ArrowLeft, Bell, AlertTriangle, Info, Megaphone, Wifi, WifiOff } from "lucide-react";

const SEVERITY_CONFIG = {
  warning: { icon: AlertTriangle, color: "var(--accent-amber)", bg: "rgba(251,191,36,0.08)" },
  info: { icon: Info, color: "var(--accent-cyan)", bg: "rgba(56,189,248,0.08)" },
  error: { icon: Megaphone, color: "var(--accent-red)", bg: "rgba(248,113,113,0.08)" },
};

export default function NotificationsPage() {
  const { connected, alerts } = useSocket();
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <header
        style={{
          padding: "16px 24px",
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
          onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontWeight: 700, fontSize: "1rem", flex: 1 }}>
          Notifications
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.75rem",
            color: connected ? "var(--accent-green)" : "var(--accent-red)",
          }}
        >
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
        </div>
      </header>

      <main style={{ padding: "24px", maxWidth: 600, margin: "0 auto" }}>
        {alerts.length === 0 ? (
          <div
            className="animate-fade-in"
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-muted)",
            }}
          >
            <Bell size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No notifications yet</p>
            <p style={{ fontSize: "0.85rem" }}>
              Real-time alerts will appear here
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="stagger">
            {alerts.map((alert, i) => {
              const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
              const Icon = config.icon;
              return (
                <div
                  key={alert.id || i}
                  className="glass-card animate-fade-in"
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    gap: 14,
                    opacity: 0,
                    borderLeft: `3px solid ${config.color}`,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: config.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} style={{ color: config.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: 4 }}>
                      {alert.message}
                    </p>
                    <div style={{ display: "flex", gap: 10, fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      <span
                        style={{
                          padding: "1px 8px",
                          borderRadius: 6,
                          background: config.bg,
                          color: config.color,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {alert.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
