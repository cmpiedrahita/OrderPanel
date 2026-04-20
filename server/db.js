const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const STATUSES = ["pending", "preparing", "on_the_way", "delivered"];

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer TEXT NOT NULL,
      items TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*) FROM orders");
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO orders (customer, items, status) VALUES
        ('Carlos López', 'Pizza Margherita x2', 'pending'),
        ('Ana García', 'Burger + Fries', 'preparing'),
        ('Luis Martínez', 'Sushi Roll x3', 'on_the_way'),
        ('María Torres', 'Pasta Carbonara', 'delivered');
    `);
  }
}

async function getOrders() {
  const { rows } = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  return rows;
}

async function updateOrderStatus(id, status) {
  const { rows } = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return rows[0];
}

async function createOrder(customer, items) {
  const { rows } = await pool.query(
    "INSERT INTO orders (customer, items, status) VALUES ($1, $2, 'pending') RETURNING *",
    [customer, items]
  );
  return rows[0];
}

module.exports = { initDB, getOrders, updateOrderStatus, createOrder, STATUSES };
