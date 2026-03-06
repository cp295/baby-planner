import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PiggyBank, TrendingUp, Target, ExternalLink } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const COLLEGE_COST_TODAY = 115000;
const YEARS = 18;
const FUTURE_COST = Math.round(COLLEGE_COST_TODAY * Math.pow(1.05, YEARS));

function fmt(n) { return `$${Math.round(n).toLocaleString()}`; }

function projectSavings(initial, monthly, rate, years) {
  const r = rate / 100 / 12;
  let balance = initial;
  let contributions = initial;
  const points = [];
  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthly;
      contributions += monthly;
    }
    points.push({ year, balance: Math.round(balance), contributions: Math.round(contributions), earnings: Math.round(Math.max(balance - contributions, 0)) });
  }
  return points;
}

function monthlyNeeded(target, years, rate) {
  const n = years * 12;
  const r = rate / 100 / 12;
  if (r === 0) return target / n;
  return (target * r) / (Math.pow(1 + r, n) - 1);
}

export default function Savings() {
  const [saved, setSaved] = useLocalStorage("savingsGoal", { current: 0, monthly: 300, rate: 7 });
  const [monthly, setMonthly] = useState(saved.monthly || 300);
  const [initial, setInitial] = useState(saved.current || 0);
  const [rate, setRate] = useState(saved.rate || 7);
  const [years, setYears] = useState(18);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    setPoints(projectSavings(Number(initial), Number(monthly), Number(rate), Number(years)));
  }, [initial, monthly, rate, years]);

  const handleSave = () => {
    setSaved({ current: Number(initial), monthly: Number(monthly), rate: Number(rate) });
  };

  const finalBalance = points[points.length - 1]?.balance ?? 0;
  const totalContribs = points[points.length - 1]?.contributions ?? 0;
  const totalEarnings = points[points.length - 1]?.earnings ?? 0;
  const needed = monthlyNeeded(FUTURE_COST, years, rate);
  const onTrack = finalBalance >= FUTURE_COST;

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">🐷 College Savings Planner</h1>
            <p className="text-slate-500 text-sm mt-0.5">Colorado CollegeInvest 529 · CU Boulder cost projection</p>
          </div>
          <a href="https://www.collegeinvest.org" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:underline">
            <ExternalLink className="w-4 h-4" /> Open a 529 at CollegeInvest ↗
          </a>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">4-Year Cost Today</p>
            <p className="text-2xl font-bold text-slate-700">{fmt(COLLEGE_COST_TODAY)}</p>
            <p className="text-xs text-slate-400">CU Boulder est.</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Est. Cost in 2044</p>
            <p className="text-2xl font-bold text-amber-700">{fmt(FUTURE_COST)}</p>
            <p className="text-xs text-slate-400">+5%/yr inflation · {YEARS} years</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Monthly to Hit Goal</p>
            <p className="text-2xl font-bold text-green-700">{fmt(needed)}/mo</p>
            <p className="text-xs text-slate-400">From $0 at {rate}% return</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" /> 529 Growth Calculator
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Starting Amount", value: initial, set: setInitial, prefix: "$" },
            { label: "Monthly Contrib.", value: monthly, set: setMonthly, prefix: "$" },
            { label: "Annual Return %", value: rate, set: setRate, prefix: "" },
            { label: "Years", value: years, set: setYears, prefix: "" },
          ].map(({ label, value, set, prefix }) => (
            <label key={label} className="block">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
              <div className="relative mt-1">
                {prefix && <span className="absolute left-3 top-2 text-slate-400">{prefix}</span>}
                <input type="number" value={value} onChange={(e) => set(e.target.value)}
                  className={`w-full ${prefix ? "pl-7" : "pl-3"} pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300`} />
              </div>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center bg-green-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Final Balance</p>
            <p className="text-xl font-bold text-green-700">{fmt(finalBalance)}</p>
          </div>
          <div className="text-center bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Contributed</p>
            <p className="text-xl font-bold text-blue-700">{fmt(totalContribs)}</p>
          </div>
          <div className="text-center bg-purple-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Earnings</p>
            <p className="text-xl font-bold text-purple-700">{fmt(totalEarnings)}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={points} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, n) => [fmt(v), n === "balance" ? "Balance" : n === "contributions" ? "Contributed" : "Earnings"]} labelFormatter={(l) => `Year ${l}`} />
            <Legend formatter={(v) => v === "balance" ? "Total Balance" : v === "contributions" ? "Contributions" : "Earnings"} />
            <Area type="monotone" dataKey="contributions" stroke="#3b82f6" fill="url(#gContrib)" strokeWidth={2} />
            <Area type="monotone" dataKey="balance" stroke="#a855f7" fill="url(#gBalance)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>

        <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 flex-wrap ${onTrack ? "bg-green-50" : "bg-orange-50"}`}>
          <Target className={`w-5 h-5 flex-shrink-0 mt-0.5 ${onTrack ? "text-green-600" : "text-orange-600"}`} />
          <div>
            <p className="font-semibold text-slate-800">Target: {fmt(FUTURE_COST)} by year {years}</p>
            {onTrack
              ? <p className="text-sm text-green-700">✅ On track! You'll exceed the goal by {fmt(finalBalance - FUTURE_COST)}.</p>
              : <p className="text-sm text-orange-700">⚠️ Shortfall of {fmt(FUTURE_COST - finalBalance)}. Try saving {fmt(needed)}/month to hit the goal.</p>}
          </div>
        </div>

        <button onClick={handleSave} className="mt-4 btn-primary w-full sm:w-auto">
          <PiggyBank className="w-4 h-4 inline mr-2" />Save these numbers to dashboard
        </button>
      </div>

      <div className="card bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <h3 className="font-bold text-green-800 mb-2">💡 Colorado 529 Tax Benefit</h3>
        <p className="text-sm text-green-700">
          Colorado residents can deduct up to <strong>$20,000/year</strong> (joint filers) in 529 contributions from state income taxes.
          At Colorado's 4.4% flat rate, that's up to <strong>$880 back per year</strong> on maximum contributions.
        </p>
        <a href="https://www.collegeinvest.org/529-tax-benefits/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-sm text-green-700 font-medium hover:underline">
          Learn more at CollegeInvest ↗
        </a>
      </div>
    </div>
  );
}
