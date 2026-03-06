import { useEffect, useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronRight } from "lucide-react";
import api from "../api/client.js";

// Approximate date from birth date + weeks
const DUE_DATE = new Date("2026-09-15");

function dueAtWeeks(weeks) {
  const d = new Date(DUE_DATE);
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const AGE_ORDER = [
  "Birth", "1–2 months", "2 months", "4 months",
  "6 months", "6–18 months", "12–15 months", "12–23 months",
  "15–18 months", "18–23 months", "4–6 years",
  "11–12 years", "16 years (booster)", "16–18 years",
];

export default function Immunizations() {
  const [imms, setImms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState({});
  const [filter, setFilter] = useState("all"); // all | pending | done

  useEffect(() => {
    api.get("/immunizations/").then((r) => { setImms(r.data); setLoading(false); });
  }, []);

  const toggle = async (imm) => {
    const updated = await api.patch(`/immunizations/${imm.id}`, {
      is_completed: !imm.is_completed,
      completed_date: !imm.is_completed ? new Date().toISOString().slice(0, 10) : null,
    });
    setImms((prev) => prev.map((i) => (i.id === imm.id ? updated.data : i)));
  };

  const filteredImms = imms.filter((i) =>
    filter === "all" ? true : filter === "done" ? i.is_completed : !i.is_completed
  );

  // Group by age_label
  const grouped = {};
  AGE_ORDER.forEach((label) => {
    const group = filteredImms.filter((i) => i.age_label === label);
    if (group.length) grouped[label] = group;
  });
  // Catch any not in AGE_ORDER
  filteredImms.forEach((i) => {
    if (!AGE_ORDER.includes(i.age_label)) {
      grouped[i.age_label] = grouped[i.age_label] || [];
      if (!grouped[i.age_label].find((x) => x.id === i.id)) grouped[i.age_label].push(i);
    }
  });

  const total = imms.length;
  const done = imms.filter((i) => i.is_completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  if (loading) return <div className="text-center py-20 text-slate-400">Loading...</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">💉 Immunization Schedule</h1>
            <p className="text-slate-500 text-sm mt-0.5">CDC 2024 recommended schedule · Based on due date Sept 15, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-teal-600">{done}<span className="text-slate-400 font-normal text-xl"> / {total}</span></p>
            <p className="text-xs text-slate-500">vaccines completed</p>
          </div>
        </div>
        <div className="mt-4 bg-slate-100 rounded-full h-3">
          <div className="bg-teal-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          {["all", "pending", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === f ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "all" ? "All" : f === "pending" ? "Upcoming" : "Completed"}
            </button>
          ))}
        </div>
      </div>

      {/* Groups */}
      {Object.entries(grouped).map(([label, group]) => {
        const isOpen = collapsed[label] !== false; // default open
        const weeks = group[0]?.age_weeks ?? 0;
        const allDone = group.every((i) => i.is_completed);

        return (
          <div key={label} className="card p-0 overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              onClick={() => setCollapsed((c) => ({ ...c, [label]: !isOpen }))}
            >
              <div className="flex items-center gap-3">
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                <div className="text-left">
                  <span className="font-semibold text-slate-800">{label}</span>
                  <span className="ml-2 text-xs text-slate-400">~{dueAtWeeks(weeks)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${allDone ? "bg-teal-100 text-teal-700" : "bg-orange-100 text-orange-700"}`}>
                  {group.filter((i) => i.is_completed).length} / {group.length}
                </span>
              </div>
            </button>

            {isOpen && (
              <ul className="divide-y divide-slate-50 border-t border-slate-100">
                {group.map((imm) => (
                  <li
                    key={imm.id}
                    className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      imm.is_completed ? "opacity-60" : ""
                    }`}
                    onClick={() => toggle(imm)}
                  >
                    {imm.is_completed ? (
                      <CheckCircle2 className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-semibold ${imm.is_completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {imm.vaccine_name}
                        </p>
                        {imm.doses > 1 && (
                          <span className="badge bg-purple-100 text-purple-700">
                            Dose {imm.dose_number} of {imm.doses}
                          </span>
                        )}
                      </div>
                      {imm.description && (
                        <p className="text-sm text-slate-500 mt-0.5">{imm.description}</p>
                      )}
                      {imm.completed_date && (
                        <p className="text-xs text-teal-600 mt-1">✓ Completed {imm.completed_date}</p>
                      )}
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
