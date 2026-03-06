import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { PiggyBank, TrendingUp, Target, ExternalLink } from "lucide-react";
import api from "../api/client.js";

const COLLEGE_COST_TODAY = 115000;
const YEARS_UNTIL_COLLEGE = 18;
const FUTURE_COLLEGE_COST = Math.round(COLLEGE_COST_TODAY * Math.pow(1.05, YEARS_UNTIL_COLLEGE));

function fmt(n) {
  return `$${Math.round(n).toLocaleString()}`;
}

function calcMonthlyNeeded(target, years, rate) {
  const n = years * 12;
  const r = rate / 100 / 12;
  if (r === 0) return target / n;
  return (target * r) / (Math.pow(1 + r, n) - 1);
}

export default function Savings() {
  const [goals, setGoals] = useState([]);
  const [projection, setProjection] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculator inputs
  const [monthly, setMonthly] = useState(300);
  const [initialAmount, setInitialAmount] = useState(0);
  const [rate, setRate] = useState(7.0);
  const [years, setYears] = useState(18);

  useEffect(() => {
    api.get("/savings/goals").then((r) => { setGoals(r.data); setLoading(false); });
  }, []);

  useEffect(() => {
    api.post("/savings/project", {
      initial_amount: Number(initialAmount),
      monthly_contribution: Number(monthly),
      annual_rate: Number(rate),
      years: Number(years),
      target_amount: FUTURE_COLLEGE_COST,
    }).then((r) => setProjection(r.data));
  }, [monthly, initialAmount, rate, years]);

  const updateGoal = async (id, field, value) => {
    const updated = await api.patch(`/savings/goals/${id}`, { [field]: Number(value) });
    setGoals((prev) => prev.map((g) => (g.id === id ? updated.data : g)));
  };

  const monthlyNeeded = calcMonthlyNeeded(FUTURE_COLLEGE_COST, years, rate);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">🐷 College Savings Planner</h1>
            <p className="text-slate-500 text-sm mt-0.5">Colorado CollegeInvest 529 · CU Boulder cost projection</p>
          </div>
          <a
            href="https://www.collegeinvest.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Open a 529 at CollegeInvest ↗
          </a>
        </div>

        {/* Cost estimate cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">4-Year Cost Today</p>
            <p className="text-2xl font-bold text-slate-700">{fmt(COLLEGE_COST_TODAY)}</p>
            <p className="text-xs text-slate-400">CU Boulder (tuition + room)</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Est. Cost in 2044</p>
            <p className="text-2xl font-bold text-amber-700">{fmt(FUTURE_COLLEGE_COST)}</p>
            <p className="text-xs text-slate-400">+5% annual inflation over {YEARS_UNTIL_COLLEGE}yrs</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Monthly to Hit Goal</p>
            <p className="text-2xl font-bold text-green-700">{fmt(monthlyNeeded)}/mo</p>
            <p className="text-xs text-slate-400">Starting from $0 at {rate}% return</p>
          </div>
        </div>
      </div>

      {/* Calculator controls */}
      <div className="card">
        <h2 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          529 Growth Calculator
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <label className="block">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Starting Amount</span>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-slate-400">$</span>
              <input
                type="number"
                min="0"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Monthly Contrib.</span>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-slate-400">$</span>
              <input
                type="number"
                min="0"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Annual Return %</span>
            <div className="relative mt-1">
              <input
                type="number"
                min="1"
                max="15"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Years</span>
            <div className="relative mt-1">
              <input
                type="number"
                min="1"
                max="25"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </label>
        </div>

        {/* Results */}
        {projection && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center bg-green-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Final Balance</p>
              <p className="text-xl font-bold text-green-700">{fmt(projection.final_balance)}</p>
            </div>
            <div className="text-center bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Total Contributed</p>
              <p className="text-xl font-bold text-blue-700">{fmt(projection.total_contributions)}</p>
            </div>
            <div className="text-center bg-purple-50 rounded-xl p-3">
              <p className="text-xs text-slate-500">Investment Earnings</p>
              <p className="text-xl font-bold text-purple-700">{fmt(projection.total_earnings)}</p>
            </div>
          </div>
        )}

        {/* Chart */}
        {projection && (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={projection.points} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) => [fmt(value), name === "balance" ? "Total Balance" : name === "contributions" ? "Contributions" : "Earnings"]}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Legend formatter={(v) => v === "balance" ? "Total Balance" : v === "contributions" ? "Contributions" : "Earnings"} />
              <Area type="monotone" dataKey="contributions" stroke="#3b82f6" fill="url(#colorContrib)" strokeWidth={2} />
              <Area type="monotone" dataKey="balance" stroke="#a855f7" fill="url(#colorEarnings)" strokeWidth={2} />
              {/* Target line annotation */}
              <CartesianGrid horizontal={false} strokeDasharray="" stroke="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* Target vs actual */}
        {projection && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 flex items-center gap-4 flex-wrap">
            <Target className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                Target: {fmt(FUTURE_COLLEGE_COST)} by year {years}
              </p>
              {projection.final_balance >= FUTURE_COLLEGE_COST ? (
                <p className="text-sm text-green-600">
                  ✅ On track! You'll exceed the goal by {fmt(projection.final_balance - FUTURE_COLLEGE_COST)}.
                </p>
              ) : (
                <p className="text-sm text-orange-600">
                  ⚠️ Shortfall of {fmt(FUTURE_COLLEGE_COST - projection.final_balance)}.
                  Try saving {fmt(projection.monthly_needed)}/month instead.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Saved goals */}
      {!loading && goals.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-green-600" />
            My 529 Goals
          </h2>
          <div className="space-y-4">
            {goals.map((goal) => {
              const pct = Math.min(100, goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0);
              return (
                <div key={goal.id} className="p-4 rounded-xl bg-slate-50">
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <div>
                      <h3 className="font-bold text-slate-800">{goal.goal_name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{goal.notes?.split(".")[0]}.</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">{fmt(goal.current_amount)}</p>
                      <p className="text-xs text-slate-500">of {fmt(goal.target_amount)}</p>
                    </div>
                  </div>

                  <div className="mt-3 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{pct.toFixed(1)}% funded</p>

                  <div className="mt-3 flex gap-3 flex-wrap">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Current balance:</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1 text-slate-400 text-xs">$</span>
                        <input
                          type="number"
                          min="0"
                          defaultValue={goal.current_amount}
                          onBlur={(e) => updateGoal(goal.id, "current_amount", e.target.value)}
                          className="pl-5 pr-2 py-1 border border-slate-200 rounded-lg text-sm w-28 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Monthly:</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1 text-slate-400 text-xs">$</span>
                        <input
                          type="number"
                          min="0"
                          defaultValue={goal.monthly_contribution}
                          onBlur={(e) => updateGoal(goal.id, "monthly_contribution", e.target.value)}
                          className="pl-5 pr-2 py-1 border border-slate-200 rounded-lg text-sm w-24 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CO tax benefit callout */}
      <div className="card bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <h3 className="font-bold text-green-800 mb-2">💡 Colorado 529 Tax Benefit</h3>
        <p className="text-sm text-green-700">
          Colorado residents can deduct up to <strong>$20,000/year</strong> (joint filers) in 529 contributions
          from state income taxes. Colorado has a flat 4.4% state income tax rate — that's up to{" "}
          <strong>$880 back per year</strong> on maximum contributions.
        </p>
        <a
          href="https://www.collegeinvest.org/529-tax-benefits/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-sm text-green-700 font-medium hover:underline"
        >
          Learn more at CollegeInvest ↗
        </a>
      </div>
    </div>
  );
}
