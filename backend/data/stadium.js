// Stadium layout and Points of Interest (POI) data

const zones = [
  { id: "north-gate", name: "North Gate", type: "gate", row: 0, col: 2, capacity: 5000, currentOccupancy: 0 },
  { id: "south-gate", name: "South Gate", type: "gate", row: 4, col: 2, capacity: 5000, currentOccupancy: 0 },
  { id: "east-gate", name: "East Gate", type: "gate", row: 2, col: 4, capacity: 4000, currentOccupancy: 0 },
  { id: "west-gate", name: "West Gate", type: "gate", row: 2, col: 0, capacity: 4000, currentOccupancy: 0 },

  { id: "sector-a", name: "Sector A (VIP)", type: "seating", row: 1, col: 1, capacity: 3000, currentOccupancy: 0 },
  { id: "sector-b", name: "Sector B", type: "seating", row: 1, col: 2, capacity: 5000, currentOccupancy: 0 },
  { id: "sector-c", name: "Sector C", type: "seating", row: 1, col: 3, capacity: 5000, currentOccupancy: 0 },
  { id: "sector-d", name: "Sector D", type: "seating", row: 3, col: 1, capacity: 5000, currentOccupancy: 0 },
  { id: "sector-e", name: "Sector E", type: "seating", row: 3, col: 2, capacity: 5000, currentOccupancy: 0 },
  { id: "sector-f", name: "Sector F", type: "seating", row: 3, col: 3, capacity: 5000, currentOccupancy: 0 },

  { id: "field", name: "Playing Field", type: "field", row: 2, col: 2, capacity: 0, currentOccupancy: 0 },

  { id: "food-court-a", name: "Food Court A", type: "food", row: 0, col: 1, capacity: 800, currentOccupancy: 0 },
  { id: "food-court-b", name: "Food Court B", type: "food", row: 0, col: 3, capacity: 800, currentOccupancy: 0 },
  { id: "food-court-c", name: "Food Court C", type: "food", row: 4, col: 1, capacity: 600, currentOccupancy: 0 },

  { id: "restroom-1", name: "Restroom North", type: "restroom", row: 0, col: 0, capacity: 200, currentOccupancy: 0 },
  { id: "restroom-2", name: "Restroom East", type: "restroom", row: 2, col: 4, capacity: 200, currentOccupancy: 0 },
  { id: "restroom-3", name: "Restroom South", type: "restroom", row: 4, col: 4, capacity: 200, currentOccupancy: 0 },

  { id: "merch-store", name: "Merchandise Store", type: "merch", row: 4, col: 3, capacity: 400, currentOccupancy: 0 },
  { id: "first-aid", name: "First Aid", type: "medical", row: 4, col: 0, capacity: 50, currentOccupancy: 0 },
];

const queues = [
  { id: "q-food-a", name: "Food Court A", zoneId: "food-court-a", type: "food", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-food-b", name: "Food Court B", zoneId: "food-court-b", type: "food", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-food-c", name: "Food Court C", zoneId: "food-court-c", type: "food", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-restroom-1", name: "Restroom North", zoneId: "restroom-1", type: "restroom", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-restroom-2", name: "Restroom East", zoneId: "restroom-2", type: "restroom", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-restroom-3", name: "Restroom South", zoneId: "restroom-3", type: "restroom", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-merch", name: "Merchandise Store", zoneId: "merch-store", type: "merch", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-north-gate", name: "North Gate Entry", zoneId: "north-gate", type: "gate", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-south-gate", name: "South Gate Entry", zoneId: "south-gate", type: "gate", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-east-gate", name: "East Gate Entry", zoneId: "east-gate", type: "gate", waitMinutes: 0, peopleInQueue: 0 },
  { id: "q-west-gate", name: "West Gate Entry", zoneId: "west-gate", type: "gate", waitMinutes: 0, peopleInQueue: 0 },
];

const venueInfo = {
  name: "Horizon Stadium",
  city: "Bengaluru",
  totalCapacity: 45000,
  currentAttendance: 0,
  eventName: "IPL 2026 — Qualifier 1",
  eventDate: "2026-04-18T19:30:00+05:30",
  status: "gates-open", // pre-event | gates-open | live | halftime | post-event
  carbonSavedKg: 0,
  powerUsagePct: 100,
};

const alerts = [];

module.exports = { zones, queues, venueInfo, alerts };
