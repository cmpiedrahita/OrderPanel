import { useState } from "react";
import OrderBoard from "./components/OrderBoard";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [view, setView] = useState("board");

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">OrderPanel</h1>
            <p className="text-xs text-gray-400 mt-0.5">Seguimiento de pedidos en tiempo real</p>
          </div>
          <nav className="flex gap-1 bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setView("board")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                view === "board" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => setView("admin")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                view === "admin" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {view === "board" ? <OrderBoard /> : <AdminPanel />}
      </main>
    </div>
  );
}
