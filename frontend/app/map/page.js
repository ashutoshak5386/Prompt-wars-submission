"use client";

import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { ArrowLeft, Wifi, WifiOff, Users, Info } from "lucide-react";

const TYPE_EMOJI = {
  gate: "🚪",
  seating: "💺",
  field: "⚽",
  food: "🍔",
  restroom: "🚻",
  merch: "🛍️",
  medical: "🏥",
};

export default function MapPage() {
  const { connected, data } = useSocket();
  const router = useRouter();

  const zones = data?.zones || [];
  const gridRows = 5;
  const gridCols = 5;

  // Build grid lookup
  const grid = {};
  zones.forEach((z) => {
    grid[`${z.row}-${z.col}`] = z;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Header */}
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
        <h1 style={{ fontWeight: 700, fontSize: "1rem", flex: 1 }}>Live Stadium Map</h1>
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
          {connected ? "Live" : "Offline"}
        </div>
      </header>

      <main style={{ padding: "24px", maxWidth: 700, margin: "0 auto" }}>
        {/* Legend */}
        <div
          className="glass-card animate-fade-in"
          style={{ padding: "14px 20px", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Congestion:</span>
          {[
            { label: "Low", cls: "congestion-low" },
            { label: "Moderate", cls: "congestion-moderate" },
            { label: "High", cls: "congestion-high" },
            { label: "Critical", cls: "congestion-critical" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className={l.cls} style={{ width: 16, height: 16, borderRadius: 4 }} />
              <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Grid Map */}
        <div
          className="animate-fade-in"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: 8,
            marginBottom: 24,
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
                    aspectRatio: "1",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.05)",
                  }}
                />
              );
            }

            const occupancyPct = zone.capacity > 0 ? Math.round((zone.currentOccupancy / zone.capacity) * 100) : 0;

            return (
              <div
                key={idx}
                className={`congestion-${zone.congestion || "none"}`}
                style={{
                  aspectRatio: "1",
                  borderRadius: 12,
                  padding: "10px 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "default",
                  transition: "all 0.5s ease",
                  position: "relative",
                }}
                title={`${zone.name}: ${zone.currentOccupancy}/${zone.capacity} (${occupancyPct}%)`}
              >
                <span style={{ fontSize: "1.2rem", marginBottom: 2 }}>
                  {TYPE_EMOJI[zone.type] || "📍"}
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {zone.name.replace("Sector ", "").replace("Food Court ", "FC ")}
                </span>
                {zone.capacity > 0 && (
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {occupancyPct}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Zone Details List */}
        <div className="animate-fade-in">
          <h3
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Info size={16} style={{ color: "var(--accent-cyan)" }} />
            Zone Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {zones
              .filter((z) => z.type !== "field")
              .sort((a, b) => {
                const order = { critical: 0, high: 1, moderate: 2, low: 3, none: 4 };
                return (order[a.congestion] ?? 4) - (order[b.congestion] ?? 4);
              })
              .map((zone) => {
                const pct = zone.capacity > 0 ? Math.round((zone.currentOccupancy / zone.capacity) * 100) : 0;
                return (
                  <div
                    key={zone.id}
                    className="glass-card"
                    style={{
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{TYPE_EMOJI[zone.type] || "📍"}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>{zone.name}</p>
                      <div
                        style={{
                          marginTop: 6,
                          height: 4,
                          borderRadius: 2,
                          background: "rgba(255,255,255,0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            borderRadius: 2,
                            background:
                              pct < 40
                                ? "var(--accent-green)"
                                : pct < 70
                                ? "var(--accent-amber)"
                                : "var(--accent-red)",
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 60 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color:
                            pct < 40
                              ? "var(--accent-green)"
                              : pct < 70
                              ? "var(--accent-amber)"
                              : "var(--accent-red)",
                        }}
                      >
                        {pct}%
                      </p>
                      <p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                        <Users size={10} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
                        {zone.currentOccupancy.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
