import { useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { CHECKLIST_CATEGORIES, COLOR_MAP } from "../data/checklists.js";

export default function Checklists() {
  const [checkedItems, setCheckedItems] = useLocalStorage("checklistItems", {});
  const [collapsed, setCollapsed] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");

  const toggleItem = (catId, idx) => {
    const key = `${catId}-${idx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetCategory = (catId) => {
    const cat = CHECKLIST_CATEGORIES.find(c => c.id === catId);
    const updates = {};
    cat.items.forEach((_, i) => { updates[`${catId}-${i}`] = false; });
    setCheckedItems(prev => ({ ...prev, ...updates }));
  };

  const totalAll = CHECKLIST_CATEGORIES.reduce((s, c) => s + c.items.length, 0);
  const doneAll = Object.values(checkedItems).filter(Boolean).length;
  const overallPct = Math.round((doneAll / totalAll) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">✅ Checklists</h1>
            <p className="text-slate-500 text-sm mt-0.5">Everything you need before baby arrives</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-500">{doneAll}<span className="text-slate-400 text-lg font-normal">/{totalAll}</span></p>
            <p className="text-xs text-slate-500">{overallPct}% complete</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4 bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }} />
        </div>

        {/* Filter tabs */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {["all", "pending", "done"].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-orange-50"}`}>
              {f === "all" ? "All items" : f === "pending" ? "Still to do" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Category cards */}
      {CHECKLIST_CATEGORIES.map(cat => {
        const colors = COLOR_MAP[cat.color];
        const catDone = cat.items.filter((_, i) => checkedItems[`${cat.id}-${i}`]).length;
        const catPct = Math.round((catDone / cat.items.length) * 100);
        const isOpen = collapsed[cat.id] !== false;

        const visibleItems = cat.items
          .map((item, idx) => ({ item, idx, done: !!checkedItems[`${cat.id}-${idx}`] }))
          .filter(({ done }) =>
            activeFilter === "all" ? true : activeFilter === "done" ? done : !done
          );

        if (visibleItems.length === 0 && activeFilter !== "all") return null;

        return (
          <div key={cat.id} className={`card border ${colors.border} p-0 overflow-hidden`}>
            {/* Category header */}
            <button
              className={`w-full flex items-center justify-between px-5 py-4 ${colors.bg} hover:opacity-90 transition-opacity`}
              onClick={() => setCollapsed(c => ({ ...c, [cat.id]: !isOpen }))}>
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                <span className="text-xl">{cat.emoji}</span>
                <div className="text-left">
                  <p className="font-bold text-slate-800">{cat.title}</p>
                  <p className="text-xs text-slate-500">{catDone} of {cat.items.length} done</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {catDone === cat.items.length && (
                  <span className="badge bg-green-100 text-green-700">✓ Complete!</span>
                )}
                <div className="w-16 bg-white/60 rounded-full h-2">
                  <div className={`${colors.prog} h-2 rounded-full transition-all`} style={{ width: `${catPct}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-700 w-8 text-right">{catPct}%</span>
              </div>
            </button>

            {/* Items */}
            {isOpen && (
              <div>
                <ul className="divide-y divide-slate-50">
                  {visibleItems.map(({ item, idx, done }) => (
                    <li key={idx}>
                      <label className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors hover:${colors.bg} ${done ? "opacity-60" : ""}`}>
                        <input
                          type="checkbox"
                          className={`w-4 h-4 rounded flex-shrink-0 ${colors.check}`}
                          checked={done}
                          onChange={() => toggleItem(cat.id, idx)}
                        />
                        <span className={`text-sm ${done ? "line-through text-slate-400" : "text-slate-700"}`}>{item}</span>
                      </label>
                    </li>
                  ))}
                </ul>

                {/* Reset button */}
                {catDone > 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
                    <button onClick={() => resetCategory(cat.id)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors">
                      <RotateCcw className="w-3 h-3" />Reset category
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
