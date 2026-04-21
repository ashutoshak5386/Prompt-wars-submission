"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  Clock,
  Utensils,
  Bath,
  ShoppingBag,
  DoorOpen,
  TrendingDown,
  ChevronRight,
  Check,
} from "lucide-react";

const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001").replace(/\/$/, "");

const TYPE_ICONS = {
  food: Utensils,
  restroom: Bath,
  merch: ShoppingBag,
  gate: DoorOpen,
};

const TYPE_COLORS = {
  food: "#fbbf24",
  restroom: "#38bdf8",
  merch: "#a78bfa",
  gate: "#34d399",
};

const FOOD_MENU = [
  { name: "Stadium Burger", price: 250 },
  { name: "Loaded Nachos", price: 180 },
  { name: "Cold Coffee", price: 120 },
  { name: "Pepsi 500ml", price: 80 },
  { name: "Masala Fries", price: 150 },
];

export default function QueuesPage() {
  const { connected, data } = useSocket();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("food");
  const [showPreorder, setShowPreorder] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const queues = data?.queues || [];
  const filtered = queues.filter((q) => q.type === activeTab);
  const sortedQueues = [...filtered].sort((a, b) => a.waitMinutes - b.waitMinutes);

  const handlePreorder = async () => {
    const user = JSON.parse(localStorage.getItem("h2s_user") || "{}");
    try {
      await fetch(`${BACKEND}/api/preorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: selectedItems.map((i) => FOOD_MENU[i].name),
          court: sortedQueues[0]?.zoneId || "food-court-a",
        }),
      });
      setOrderPlaced(true);
      setTimeout(() => {
        setShowPreorder(false);
        setOrderPlaced(false);
        setSelectedItems([]);
      }, 2500);
    } catch {
      // fail silently
    }
  };

  const tabs = [
    { key: "food", label: "Food", icon: Utensils },
    { key: "restroom", label: "Restrooms", icon: Bath },
    { key: "gate", label: "Gates", icon: DoorOpen },
    { key: "merch", label: "Merch", icon: ShoppingBag },
  ];

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
        <h1 style={{ fontWeight: 700, fontSize: "1rem", flex: 1 }}>Queue Wait Times</h1>
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
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 24,
            padding: 4,
            borderRadius: 14,
            background: "var(--bg-secondary)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: "0.78rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
                background: activeTab === tab.key ? "var(--bg-card)" : "transparent",
                color: activeTab === tab.key ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: activeTab === tab.key ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Best Option Banner */}
        {sortedQueues.length > 0 && (
          <div
            className="glass-card animate-fade-in"
            style={{
              padding: "16px 20px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderColor: `${TYPE_COLORS[activeTab]}33`,
            }}
          >
            <TrendingDown size={20} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Fastest: <span style={{ color: "var(--accent-green)" }}>{sortedQueues[0].name}</span>
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                ~{sortedQueues[0].waitMinutes} min • {sortedQueues[0].peopleInQueue} in queue
              </p>
            </div>
            {activeTab === "food" && (
              <button
                className="btn-primary"
                onClick={() => setShowPreorder(true)}
                style={{ marginLeft: "auto", padding: "8px 16px", fontSize: "0.75rem" }}
              >
                Pre-order
              </button>
            )}
          </div>
        )}

        {/* Queue Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="stagger">
          {sortedQueues.map((q, i) => {
            const Icon = TYPE_ICONS[q.type] || Clock;
            const color = TYPE_COLORS[q.type] || "#94a3b8";
            return (
              <div
                key={q.id}
                className="glass-card animate-fade-in"
                style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, opacity: 0 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{q.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {q.peopleInQueue} people waiting
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color:
                        q.waitMinutes < 5
                          ? "var(--accent-green)"
                          : q.waitMinutes < 15
                          ? "var(--accent-amber)"
                          : "var(--accent-red)",
                    }}
                  >
                    {q.waitMinutes}
                  </p>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>min</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Pre-order Modal */}
      {showPreorder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 24,
          }}
          onClick={() => { if (!orderPlaced) { setShowPreorder(false); } }}
        >
          <div
            className="glass-card animate-fade-in-scale"
            style={{ maxWidth: 400, width: "100%", padding: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {orderPlaced ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(52,211,153,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Check size={28} style={{ color: "var(--accent-green)" }} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Order Confirmed!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  Pick up at {sortedQueues[0]?.name || "Food Court"} in ~10 min
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>Pre-order Food</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: 20 }}>
                  Skip the queue at {sortedQueues[0]?.name || "Food Court"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {FOOD_MENU.map((item, i) => {
                    const selected = selectedItems.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() =>
                          setSelectedItems((prev) =>
                            selected ? prev.filter((x) => x !== i) : [...prev, i]
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          borderRadius: 10,
                          background: selected ? "rgba(56,189,248,0.1)" : "var(--bg-secondary)",
                          border: selected ? "1px solid rgba(56,189,248,0.3)" : "1px solid var(--border-subtle)",
                          color: "var(--text-primary)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span style={{ fontWeight: 500, fontSize: "0.85rem" }}>{item.name}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>₹{item.price}</span>
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-ghost" onClick={() => setShowPreorder(false)} style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    disabled={selectedItems.length === 0}
                    onClick={handlePreorder}
                    style={{ flex: 1, opacity: selectedItems.length === 0 ? 0.5 : 1 }}
                  >
                    Order (₹{selectedItems.reduce((s, i) => s + FOOD_MENU[i].price, 0)})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
