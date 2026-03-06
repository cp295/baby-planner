import { Routes, Route, NavLink } from "react-router-dom";
import { Syringe, School, PiggyBank, LayoutDashboard, ClipboardList } from "lucide-react";
import Dashboard from "./pages/Dashboard.jsx";
import Immunizations from "./pages/Immunizations.jsx";
import Schools from "./pages/Schools.jsx";
import Savings from "./pages/Savings.jsx";
import Checklists from "./pages/Checklists.jsx";

const NAV = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/checklists", icon: ClipboardList, label: "Checklists" },
  { to: "/immunizations", icon: Syringe, label: "Vaccines" },
  { to: "/schools", icon: School, label: "Schools" },
  { to: "/savings", icon: PiggyBank, label: "Savings" },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🍼</div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Baby Planner</h1>
            <p className="text-orange-100 text-xs">Due September 2026 · Berkeley, Denver CO</p>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-orange-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-2 flex overflow-x-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive ? "border-orange-400 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}>
              <Icon className="w-4 h-4" />{label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/immunizations" element={<Immunizations />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/savings" element={<Savings />} />
        </Routes>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4 border-t border-orange-100">
        🍼 Baby Planner · Denver, CO · Made with love for September 2026
      </footer>
    </div>
  );
}
