// Mock user/ticket data

const users = [
  {
    id: "USR-001",
    name: "Ashutosh Kumar",
    ticketId: "TKT-2026-0001",
    sector: "sector-a",
    seat: "A-12",
    gate: "north-gate",
    type: "VIP",
    avatar: "AK",
    points: 1250,
    tier: "Gold",
  },
  {
    id: "USR-002",
    name: "Priya Sharma",
    ticketId: "TKT-2026-0002",
    sector: "sector-b",
    seat: "B-44",
    gate: "north-gate",
    type: "General",
    avatar: "PS",
    points: 120,
    tier: "Bronze",
  },
  {
    id: "USR-003",
    name: "Rahul Verma",
    ticketId: "TKT-2026-0003",
    sector: "sector-d",
    seat: "D-18",
    gate: "south-gate",
    type: "General",
    avatar: "RV",
    points: 450,
    tier: "Silver",
  },
  {
    id: "USR-004",
    name: "Ananya Patel",
    ticketId: "TKT-2026-0004",
    sector: "sector-c",
    seat: "C-7",
    gate: "east-gate",
    type: "Premium",
    avatar: "AP",
    points: 890,
    tier: "Gold",
  },
  {
    id: "USR-005",
    name: "Demo User",
    ticketId: "DEMO",
    sector: "sector-a",
    seat: "A-1",
    gate: "north-gate",
    type: "VIP",
    avatar: "DU",
    points: 350,
    tier: "Silver",
  },
];

const preorders = [];

module.exports = { users, preorders };
