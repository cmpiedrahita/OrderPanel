import { STATUS_LABEL, STATUS_STYLES, STATUSES } from "../constants";

const DOT_COLOR = {
  pending:    "#fbbf24",
  preparing:  "#60a5fa",
  on_the_way: "#a78bfa",
  delivered:  "#34d399",
};

export default function OrderCard({ order, isAdmin, onStatusChange }) {
  const styles = STATUS_STYLES[order.status];
  const nextStatus = STATUSES[STATUSES.indexOf(order.status) + 1];
  const date = new Date(order.created_at).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 font-mono">#{String(order.id).padStart(4, "0")}</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          <p className="font-semibold text-white truncate">{order.customer}</p>
          <p className="text-sm text-gray-400 mt-0.5 truncate">{order.items}</p>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="relative pt-7 pb-1">
        <div className="flex gap-1">
          {STATUSES.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                STATUSES.indexOf(order.status) >= i ? styles.dot : "bg-gray-800"
              }`}
            />
          ))}
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute w-7 h-7 -top-0.5 transition-all duration-500"
          style={{
            color: DOT_COLOR[order.status],
            left: `calc(${(STATUSES.indexOf(order.status) / (STATUSES.length - 1)) * 100}% - 14px)`,
          }}
        >
          <path d="M17 4a2 2 0 0 1 2 2v.5h1.5a.5.5 0 0 1 .49.41l.01.09v2a.5.5 0 0 1-.41.49L20.5 9.5H20v.09A2 2 0 0 1 21 11v5a1 1 0 0 1-1 1h-1a3 3 0 0 1-6 0H9a3 3 0 0 1-6 0H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 .29-.71l3-3A1 1 0 0 1 5 9H7V6a2 2 0 0 1 2-2h8Zm-8 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM15 6H9v7h9v-2h-1.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H18V6h-3Z" />
        </svg>
      </div>

      {isAdmin && nextStatus && (
        <button
          onClick={() => onStatusChange(order.id, nextStatus)}
          className={`w-full py-2 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer ${STATUS_STYLES[nextStatus].btn}`}
        >
          Avanzar a {STATUS_LABEL[nextStatus]}
        </button>
      )}
    </div>
  );
}
