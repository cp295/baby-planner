import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Syringe, School, PiggyBank, CalendarHeart, AlertCircle } from "lucide-react";
import api from "../api/client.js";

const DUE_DATE = new Date("2026-09-15");

function daysUntilDue() {
  const today = new Date();
  const diff = DUE_DATE - today;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function weeksUntilDue() {
  return Math.max(0, Math.ceil(daysUntilDue() / 7));
}

const MILESTONES = [
  { label: "Open 529 account", by: "Before birth", link: "https://www.collegeinvest.org" },
  { label: "Add baby to health insurance (30-day window)", by: "Within 30 days of birth", link: null },
  { label: "Register for daycare waitlists", by: "Now — lists are 2–6 months", link: null },
  { label: "Apply for birth certificate & SSN", by: "At hospital / within 2 weeks", link: null },
  { label: "First pediatrician appointment", by: "1–3 days after birth", link: null },
  { label: "Apply for FMLA/parental leave", by: "30 days before due date", link: null },
  { label: "Denver Language School lottery", by: "January before kindergarten (2031)", link: "https://www.denverlanguageschool.org" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard").then((r) => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const days = daysUntilDue();
  const weeks = weeksUntilDue();

  return (
    <div className="space-y-6">
      {/* Hero countdown */}
      <div className="card bg-gradient-to-br from-purple-600 to-violet-500 text-white border-0">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-purple-200 text-sm font-medium uppercase tracking-wide">Due Date Countdown</p>
            <p className="text-5xl font-extrabold mt-1">{days}<span className="text-2xl font-normal ml-2">days</span></p>
            <p className="text-purple-200 mt-1">{weeks} weeks · Est. September 15, 2026</p>
          </div>
          <CalendarHeart className="w-20 h-20 text-purple-300 opacity-60" />
        </div>
      </div>

      {/* Stat cards */}
      {!loading && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/immunizations" className="card hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <Syringe className="w-5 h-5 text-teal-600" />
              </div>
              <span className="font-semibold text-slate-700">Vaccines</span>
            </div>
            <p className="text-3xl font-bold text-teal-600">{stats.immunizations.completed}<span className="text-slate-400 text-lg font-normal"> / {stats.immunizations.total}</span></p>
            <div className="mt-2 bg-slate-100 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${stats.immunizations.percent}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-1">{stats.immunizations.percent}% complete</p>
          </Link>

          <Link to="/schools" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <School className="w-5 h-5 text-amber-600" />
              </div>
              <span className="font-semibold text-slate-700">Schools</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{stats.schools.total}</p>
            <p className="text-xs text-slate-500 mt-1">{stats.schools.favorited} favorited · Daycares through High School</p>
          </Link>

          <Link to="/savings" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-semibold text-slate-700">College Savings</span>
            </div>
            <p className="text-3xl font-bold text-green-600">${stats.savings.total_saved.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">{stats.savings.goals} active goal{stats.savings.goals !== 1 ? "s" : ""}</p>
          </Link>
        </div>
      )}

      {/* Action checklist */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold text-slate-800 text-lg">Important Action Items</h2>
        </div>
        <ul className="space-y-3">
          {MILESTONES.map((m) => (
            <li key={m.label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-orange-50 transition-colors">
              <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {m.link ? (
                  <a href={m.link} target="_blank" rel="noopener noreferrer" className="font-medium text-purple-700 hover:underline">
                    {m.label} ↗
                  </a>
                ) : (
                  <span className="font-medium text-slate-800">{m.label}</span>
                )}
                <p className="text-xs text-slate-500 mt-0.5">{m.by}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Cost overview */}
      <div className="card">
        <h2 className="font-bold text-slate-800 text-lg mb-4">📊 Estimated Annual Costs (Denver, 2026)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Infant Daycare (full-time)", low: 18000, high: 31200, note: "Until age ~3" },
            { label: "Preschool", low: 7800, high: 21600, note: "Ages 3–5" },
            { label: "Private Elementary", low: 10800, high: 14400, note: "Public is free" },
            { label: "Health Insurance Premium", low: 3600, high: 7200, note: "Adding child to employer plan" },
            { label: "529 Savings (recommended)", low: 2400, high: 6000, note: "$200–500/month" },
            { label: "Diapers, Food & Basics", low: 2400, high: 4800, note: "First 2 years especially" },
          ].map((c) => (
            <div key={c.label} className="flex justify-between items-start p-3 rounded-xl bg-slate-50">
              <div>
                <p className="font-medium text-slate-800 text-sm">{c.label}</p>
                <p className="text-xs text-slate-500">{c.note}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-bold text-slate-700 text-sm">
                  ${(c.low / 12).toFixed(0)}–${(c.high / 12).toFixed(0)}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </p>
                <p className="text-xs text-slate-400">${c.low.toLocaleString()}–${c.high.toLocaleString()}/yr</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
