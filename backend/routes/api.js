// REST API routes

const express = require("express");
const router = express.Router();
const { users, preorders } = require("../data/users");
const { getSnapshot, pushAlert } = require("../services/simulator");

// GET /api/snapshot — full current state
router.get("/snapshot", (req, res) => {
  res.json(getSnapshot());
});

// GET /api/tickets/:id — ticket lookup
router.get("/tickets/:id", (req, res) => {
  const ticket = users.find(
    (u) => u.ticketId.toLowerCase() === req.params.id.toLowerCase() || u.id.toLowerCase() === req.params.id.toLowerCase()
  );
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

// GET /api/users — list all mock users (admin)
router.get("/users", (req, res) => {
  res.json(users);
});

// POST /api/alerts — admin push alert
router.post("/alerts", (req, res) => {
  const { message, severity, type } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });
  const alert = pushAlert({ message, severity, type });
  // broadcast via io (attached in server.js)
  if (req.app.get("io")) {
    req.app.get("io").emit("alert:new", alert);
  }
  res.status(201).json(alert);
});

// POST /api/preorder — attendee food pre-order
router.post("/preorder", (req, res) => {
  const { userId, items, court } = req.body;
  if (!userId || !items) return res.status(400).json({ error: "userId and items required" });
  const order = {
    id: `ORD-${Date.now()}`,
    userId,
    items,
    court: court || "food-court-a",
    status: "confirmed",
    estimatedReady: new Date(Date.now() + 10 * 60000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  preorders.push(order);
  res.status(201).json(order);
});

// GET /api/preorders/:userId
router.get("/preorders/:userId", (req, res) => {
  const userOrders = preorders.filter((o) => o.userId === req.params.userId);
  res.json(userOrders);
});

module.exports = router;
