require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { initDB, getOrders, updateOrderStatus, createOrder, STATUSES } = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/orders", async (req, res) => {
  const orders = await getOrders();
  res.json(orders);
});

app.post("/orders", async (req, res) => {
  const { customer, items } = req.body;
  const order = await createOrder(customer, items);
  io.emit("order:new", order);
  res.status(201).json(order);
});

app.patch("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const order = await updateOrderStatus(id, status);
  if (!order) return res.status(404).json({ error: "Order not found" });

  io.emit("order:updated", order);
  res.json(order);
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("disconnect", () => console.log(`Client disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 3001;

initDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
