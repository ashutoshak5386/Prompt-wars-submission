// Simulation service — generates realistic crowd movement, queue wait times, and random events

const { zones, queues, venueInfo, alerts } = require("../data/stadium");

let simulationInterval = null;
let tickCount = 0;

/**
 * Get congestion level label for a zone based on occupancy ratio
 */
function getCongestionLevel(zone) {
  if (zone.capacity === 0) return "none";
  const ratio = zone.currentOccupancy / zone.capacity;
  if (ratio < 0.4) return "low";
  if (ratio < 0.7) return "moderate";
  if (ratio < 0.9) return "high";
  return "critical";
}

/**
 * Random integer between min and max (inclusive)
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simulate one tick of crowd movement
 */
function simulateTick() {
  tickCount++;
  let totalOccupancy = 0;
  let emptyZones = 0;
  let totalZones = 0;

  // Update each zone's occupancy
  zones.forEach((zone) => {
    if (zone.type === "field") return;
    totalZones++;

    const maxDelta = Math.ceil(zone.capacity * 0.06);
    const delta = randInt(-maxDelta, maxDelta * 1.3); // slight upward bias during event
    zone.currentOccupancy = Math.max(0, Math.min(zone.capacity, zone.currentOccupancy + delta));
    zone.congestion = getCongestionLevel(zone);
    totalOccupancy += zone.currentOccupancy;
    
    if (zone.congestion === "low" || zone.congestion === "none") {
      emptyZones++;
    }
  });

  venueInfo.currentAttendance = totalOccupancy;
  
  // Power savings logic
  const powerDownRatio = emptyZones / Math.max(1, totalZones);
  venueInfo.powerUsagePct = Math.max(40, 100 - Math.floor(powerDownRatio * 40)); // Minimum 60% power
  venueInfo.carbonSavedKg = parseFloat((venueInfo.carbonSavedKg + (powerDownRatio * 12.5)).toFixed(2));

  // Update queue wait times
  queues.forEach((q) => {
    const zone = zones.find((z) => z.id === q.zoneId);
    if (!zone) return;
    const ratio = zone.currentOccupancy / (zone.capacity || 1);
    q.peopleInQueue = Math.floor(ratio * randInt(10, 80));
    q.waitMinutes = Math.max(0, Math.floor(q.peopleInQueue * 0.4 + randInt(-2, 5)));
  });

  // Smart AI Food Upsell Logic
  if (tickCount % 3 === 0) {
    const longGates = queues.filter((q) => q.type === "gate" && q.waitMinutes >= 5);
    const emptyFoodCourts = queues.filter((q) => q.type === "food" && q.waitMinutes <= 15);
    
    if (longGates.length > 0 && emptyFoodCourts.length > 0) {
      const targetFood = emptyFoodCourts[0];
      const alert = {
        id: `ALT-${Date.now()}`,
        type: "promo",
        message: `Skip the gate queue! 🍔 15% off at ${targetFood.name} right now.`,
        severity: "info",
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      const exists = alerts.find((a) => a.type === "promo" && (Date.now() - new Date(a.timestamp).getTime() < 120000));
      if (!exists) {
        alerts.unshift(alert);
        if (alerts.length > 50) alerts.length = 50;
      }
    }
  }

  // Random event alerts (roughly every 10-15 ticks)
  if (tickCount % randInt(10, 15) === 0) {
    const eventTypes = [
      { type: "congestion", message: "High congestion detected at {zone}", severity: "warning" },
      { type: "gate-change", message: "Gate assignment updated for Sector E", severity: "info" },
      { type: "weather", message: "Light rain expected — covered zones recommended", severity: "info" },
      { type: "security", message: "Security sweep in progress near {zone}", severity: "warning" },
      { type: "promo", message: "50% off at Food Court B for the next 10 minutes!", severity: "info" },
    ];
    const evt = eventTypes[randInt(0, eventTypes.length - 1)];
    const randomZone = zones[randInt(0, zones.length - 1)];
    const alert = {
      id: `ALT-${Date.now()}`,
      ...evt,
      message: evt.message.replace("{zone}", randomZone.name),
      timestamp: new Date().toISOString(),
      read: false,
    };
    alerts.unshift(alert);
    if (alerts.length > 50) alerts.length = 50; // cap stored alerts
  }
}

/**
 * Start the simulation loop and broadcast via Socket.io
 */
function startSimulation(io, intervalMs = 3000) {
  // Seed initial occupancy
  zones.forEach((zone) => {
    if (zone.type === "field") return;
    zone.currentOccupancy = Math.floor(zone.capacity * (0.2 + Math.random() * 0.4));
    zone.congestion = getCongestionLevel(zone);
  });
  simulateTick(); // initial state

  simulationInterval = setInterval(() => {
    simulateTick();

    const payload = {
      zones: zones.map((z) => ({
        id: z.id,
        name: z.name,
        type: z.type,
        row: z.row,
        col: z.col,
        capacity: z.capacity,
        currentOccupancy: z.currentOccupancy,
        congestion: z.congestion || getCongestionLevel(z),
      })),
      queues: queues.map((q) => ({ ...q })),
      venue: { ...venueInfo },
      latestAlert: alerts[0] || null,
      timestamp: new Date().toISOString(),
    };

    io.emit("simulation:update", payload);
  }, intervalMs);

  console.log(`[Simulator] Running every ${intervalMs}ms`);
}

/**
 * Stop the simulation
 */
function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("[Simulator] Stopped");
  }
}

/**
 * Get a snapshot of the current state
 */
function getSnapshot() {
  return {
    zones: zones.map((z) => ({
      id: z.id,
      name: z.name,
      type: z.type,
      row: z.row,
      col: z.col,
      capacity: z.capacity,
      currentOccupancy: z.currentOccupancy,
      congestion: z.congestion || getCongestionLevel(z),
    })),
    queues: queues.map((q) => ({ ...q })),
    venue: { ...venueInfo },
    alerts: alerts.slice(0, 20),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Manually push an admin alert
 */
function pushAlert(alertData) {
  const alert = {
    id: `ALT-${Date.now()}`,
    type: alertData.type || "admin",
    message: alertData.message,
    severity: alertData.severity || "warning",
    timestamp: new Date().toISOString(),
    read: false,
  };
  alerts.unshift(alert);
  if (alerts.length > 50) alerts.length = 50;
  return alert;
}

module.exports = { startSimulation, stopSimulation, getSnapshot, pushAlert };
