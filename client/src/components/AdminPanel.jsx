import { useEffect, useState } from "react";
import socket from "../socket";
import OrderCard from "./OrderCard";

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ customer: "", items: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then((r) => r.json())
      .then(setOrders);

    socket.on("order:new", (order) => setOrders((prev) => [order, ...prev]));
    socket.on("order:updated", (updated) =>
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    );

    return () => {
      socket.off("order:new");
      socket.off("order:updated");
    };
  }, []);

  async function handleStatusChange(id, status) {
    await fetch(`http://localhost:3001/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.customer || !form.items) return;
    setLoading(true);
    await fetch("http://localhost:3001/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ customer: "", items: "" });
    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Panel de administración</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <p className="text-sm font-medium text-gray-300 mb-4">Nuevo pedido</p>
        <form onSubmit={handleCreate} className="flex gap-3 flex-wrap">
          <input
            className="flex-1 min-w-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Nombre del cliente"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
          />
          <input
            className="flex-1 min-w-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Items del pedido"
            value={form.items}
            onChange={(e) => setForm({ ...form, items: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {loading ? "Creando..." : "Crear pedido"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} isAdmin={true} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
}
