import { useEffect, useState } from "react";
import socket from "../socket";
import OrderCard from "./OrderCard";
import { STATUS_LABEL, STATUSES, STATUS_STYLES } from "../constants";

export default function OrderBoard() {
  const [orders, setOrders] = useState([]);
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:3001/orders")
      .then((r) => r.json())
      .then(setOrders);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("order:new", (order) => setOrders((prev) => [order, ...prev]));
    socket.on("order:updated", (updated) =>
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    );

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("order:new");
      socket.off("order:updated");
    };
  }, []);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Pedidos en vivo</h2>
          <p className="text-sm text-gray-500">{orders.length} pedidos totales</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400" : "bg-red-500"}`} />
          <span className="text-xs text-gray-400">{connected ? "En vivo" : "Desconectado"}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "all" : s)}
            className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
              filter === s ? "border-gray-600 bg-gray-800" : "border-gray-800 bg-gray-900 hover:border-gray-700"
            }`}
          >
            <p className="text-2xl font-bold">{counts[s]}</p>
            <p className={`text-xs font-medium mt-0.5 ${STATUS_STYLES[s].badge.includes("amber") ? "text-amber-400" : STATUS_STYLES[s].badge.includes("blue") ? "text-blue-400" : STATUS_STYLES[s].badge.includes("violet") ? "text-violet-400" : "text-emerald-400"}`}>
              {STATUS_LABEL[s]}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <p className="text-center text-gray-600 py-12">No hay pedidos en este estado</p>
        )}
        {visible.map((order) => (
          <OrderCard key={order.id} order={order} isAdmin={false} />
        ))}
      </div>
    </div>
  );
}
