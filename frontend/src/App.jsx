import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Baby, Syringe, School, PiggyBank, LayoutDashboard } from "lucide-react";
import Dashboard from "./pages/Dashboard.jsx";
import Immunizations from "./pages/Immunizations.jsx";
import Schools from "./pages/Schools.jsx";
import Savings from "./pages/Savings.jsx";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/immunizations", icon: Syringe, label: "Vaccines" },
  { to: "/schools", icon: School, label: "Schools" },
  { to: "/savings", icon: PiggyBank, label: "Savings" },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top header */}
      <header className="bg-gradient-to-r from-purple-700 to-violet-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Baby className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold leading-tight">Baby Planner</h1>
            <p className="text-purple-200 text-xs">Due September 2026 · Berkeley, Denver CO</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/immunizations" element={<Immunizations />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/savings" element={<Savings />} />
        </Routes>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4">
        Baby Planner · Denver, CO · Data current as of 2026
      </footer>
    </div>
  );
}
