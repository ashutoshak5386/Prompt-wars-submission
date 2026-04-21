// Backend entry point — Express + Socket.io server

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const apiRoutes = require("./routes/api");
const { startSimulation, getSnapshot } = require("./services/simulator");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:3000"] : "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to app so routes can broadcast
app.set("io", io);

// REST API
app.use("/api", apiRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Root checkout status page
app.get("/", (req, res) => {
  res.send("Horizon Stadium Backend is up and running! 🚀");
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  // Send current snapshot immediately on connect
  socket.emit("simulation:update", {
    ...getSnapshot(),
    timestamp: new Date().toISOString(),
  });

  socket.on("disconnect", () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

// Start simulation loop (broadcasts to all clients every 3s)
startSimulation(io, 3000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n  🏟️  Horizon Stadium Backend`);
  console.log(`  ➜  REST API:    http://localhost:${PORT}/api`);
  console.log(`  ➜  WebSocket:   ws://localhost:${PORT}`);
  console.log(`  ➜  Health:      http://localhost:${PORT}/health\n`);
});
