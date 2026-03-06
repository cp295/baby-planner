import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { IMMUNIZATIONS, AGE_ORDER } from "../data/immunizations.js";

const DUE_DATE = new Date("2026-09-15");

function dueAtWeeks(weeks) {
  const d = new Date(DUE_DATE);
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function Immunizations() {
  const [completed, setCompleted] = useLocalStorage("completedImms", {});
  const [collapsed, setCollapsed] = useState({});
  const [filter, setFilter] = useState("all");

  const toggle = (id) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = IMMUNIZATIONS.filter((i) =>
    filter === "all" ? true : filter === "done" ? completed[i.id] : !completed[i.id]
  );

  const grouped = {};
  AGE_ORDER.forEach((label) => {
    const group = filtered.filter((i) => i.age_label === label);
    if (group.length) grouped[label] = group;
  });

  const total = IMMUNIZATIONS.length;
  const done = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">💉 Immunization Schedule</h1>
            <p className="text-slate-500 text-sm mt-0.5">CDC 2024 recommended schedule · Based on due date Sept 15, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-teal-600">{done}<span className="text-slate-400 font-normal text-xl"> / {total}</span></p>
            <p className="text-xs text-slate-500">completed</p>
          </div>
        </div>
        <div className="mt-3 bg-slate-100 rounded-full h-3">
          <div className="bg-teal-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex gap-2">
          {["all", "pending", "done"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {f === "all" ? "All" : f === "pending" ? "Upcoming" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([label, group]) => {
        const isOpen = collapsed[label] !== false;
        const weeks = group[0]?.age_weeks ?? 0;
        const groupDone = group.filter((i) => completed[i.id]).length;

        return (
          <div key={label} className="card p-0 overflow-hidden">
            <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              onClick={() => setCollapsed((c) => ({ ...c, [label]: !isOpen }))}>
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                <div className="text-left">
                  <span className="font-semibold text-slate-800">{label}</span>
                  <span className="ml-2 text-xs text-slate-400">~{dueAtWeeks(weeks)}</span>
                </div>
              </div>
              <span className={`badge ${groupDone === group.length ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700"}`}>
                {groupDone} / {group.length}
              </span>
            </button>

            {isOpen && (
              <ul className="divide-y divide-slate-50 border-t border-slate-100">
                {group.map((imm) => (
                  <li key={imm.id}
                    className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${completed[imm.id] ? "opacity-60" : ""}`}
                    onClick={() => toggle(imm.id)}>
                    {completed[imm.id]
                      ? <CheckCircle2 className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                      : <Circle className="w-6 h-6 text-slate-300 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-semibold ${completed[imm.id] ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {imm.vaccine_name}
                        </p>
                        {imm.doses > 1 && (
                          <span className="badge bg-purple-100 text-purple-700">Dose {imm.dose_number} of {imm.doses}</span>
                        )}
                      </div>
                      {imm.description && <p className="text-sm text-slate-500 mt-0.5">{imm.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
