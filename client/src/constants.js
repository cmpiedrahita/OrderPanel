export const STATUSES = ["pending", "preparing", "on_the_way", "delivered"];

export const STATUS_LABEL = {
  pending: "Pendiente",
  preparing: "Preparando",
  on_the_way: "En camino",
  delivered: "Entregado",
};

export const STATUS_STYLES = {
  pending:    { badge: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",   dot: "bg-amber-400",  btn: "bg-amber-500 hover:bg-amber-600" },
  preparing:  { badge: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",      dot: "bg-blue-400",   btn: "bg-blue-500 hover:bg-blue-600" },
  on_the_way: { badge: "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30", dot: "bg-violet-400", btn: "bg-violet-500 hover:bg-violet-600" },
  delivered:  { badge: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30", dot: "bg-emerald-400", btn: "bg-emerald-500 hover:bg-emerald-600" },
};
