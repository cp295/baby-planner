import { Link } from "react-router-dom";
import { Syringe, School, PiggyBank, ClipboardList, ChevronRight } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { IMMUNIZATIONS } from "../data/immunizations.js";
import { SCHOOLS } from "../data/schools.js";
import { CHECKLIST_CATEGORIES } from "../data/checklists.js";

const DUE_DATE = new Date("2026-09-15");
const CONCEPTION_DATE = new Date("2025-12-23"); // ~40 weeks before due date

function getPregnancyWeek() {
  const today = new Date();
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const week = Math.floor((today - CONCEPTION_DATE) / msPerWeek);
  return Math.min(Math.max(week, 1), 40);
}

function getDaysUntil() {
  return Math.max(0, Math.ceil((DUE_DATE - new Date()) / (1000 * 60 * 60 * 24)));
}

const WEEK_MILESTONES = {
  8: "Tiny fingers & toes forming 🤚",
  12: "Size of a lime 🍋 — first trimester ends!",
  16: "Baby can hear sounds 👂",
  20: "Halfway there! Anatomy scan time 🩻",
  24: "Viability milestone reached 🎉",
  28: "Third trimester begins 🌟",
  32: "Baby is head-down position 👶",
  36: "Full term in 1 week! Almost there ✨",
  40: "Due date — any day now! 🎊",
};

function getBabySize(week) {
  const sizes = {
    8: "raspberry 🫐", 10: "strawberry 🍓", 12: "lime 🍋", 14: "lemon 🍋",
    16: "avocado 🥑", 18: "sweet potato 🍠", 20: "banana 🍌", 22: "papaya 🧡",
    24: "ear of corn 🌽", 26: "lettuce head 🥬", 28: "eggplant 🍆",
    30: "cabbage 🥦", 32: "coconut 🥥", 34: "cantaloupe 🍈",
    36: "honeydew melon 🍈", 38: "watermelon 🍉", 40: "pumpkin 🎃",
  };
  const keys = Object.keys(sizes).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, k) => (k <= week ? k : prev), keys[0]);
  return sizes[closest];
}

const URGENT_TODOS = [
  { text: "Register for infant daycare waitlists", due: "Do this now — lists fill fast!", link: null, urgent: true },
  { text: "Open Colorado 529 account", due: "Every month counts for compound growth", link: "https://www.collegeinvest.org", urgent: true },
  { text: "Tour hospitals & choose birth location", due: "Before 32 weeks recommended", link: null, urgent: false },
  { text: "Select a pediatrician", due: "Before birth — schedule a meet & greet", link: null, urgent: false },
  { text: "Apply for FMLA / parental leave", due: "At least 30 days before due date", link: null, urgent: false },
  { text: "Add baby to health insurance", due: "You have 30 days after birth — don't miss it!", link: null, urgent: true },
  { text: "Set up nursery & install car seat", due: "By week 36", link: null, urgent: false },
  { text: "Pre-register at hospital", due: "Usually done by week 36", link: null, urgent: false },
];

export default function Dashboard() {
  const [completedImms] = useLocalStorage("completedImms", {});
  const [favorites] = useLocalStorage("schoolFavorites", {});
  const [savings] = useLocalStorage("savingsGoal", { current: 0, monthly: 300 });
  const [checkedItems] = useLocalStorage("checklistItems", {});
  const [todosDone, setTodosDone] = useLocalStorage("urgentTodos", {});

  const days = getDaysUntil();
  const weeks = Math.ceil(days / 7);
  const pregnancyWeek = getPregnancyWeek();
  const pctPreg = Math.round((pregnancyWeek / 40) * 100);

  const immDone = Object.values(completedImms).filter(Boolean).length;
  const favCount = Object.values(favorites).filter(Boolean).length;

  const totalChecklistItems = CHECKLIST_CATEGORIES.reduce((s, c) => s + c.items.length, 0);
  const doneChecklistItems = Object.values(checkedItems).filter(Boolean).length;
  const checklistPct = Math.round((doneChecklistItems / totalChecklistItems) * 100);

  const milestone = Object.entries(WEEK_MILESTONES)
    .filter(([w]) => Number(w) <= pregnancyWeek)
    .pop();

  return (
    <div className="space-y-5">
      {/* Hero countdown */}
      <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-rose-400 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">Until Your Due Date</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-6xl font-extrabold">{days}</span>
              <span className="text-2xl mb-1 font-light">days</span>
            </div>
            <p className="text-orange-100 mt-1">{weeks} weeks · September 15, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm">Pregnancy Week</p>
            <p className="text-5xl font-extrabold">{pregnancyWeek}<span className="text-xl font-light">/40</span></p>
            <p className="text-orange-100 text-sm mt-1">{getBabySize(pregnancyWeek)}</p>
          </div>
        </div>

        {/* Pregnancy progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-orange-100 mb-1">
            <span>Week 1</span>
            <span>📍 Week {pregnancyWeek}</span>
            <span>Week 40</span>
          </div>
          <div className="bg-white/20 rounded-full h-3">
            <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${pctPreg}%` }} />
          </div>
          <div className="flex justify-between text-xs text-orange-100 mt-1">
            <span>1st Trimester</span>
            <span>2nd Trimester</span>
            <span>3rd Trimester</span>
          </div>
        </div>
        {milestone && (
          <div className="mt-3 bg-white/15 rounded-xl px-4 py-2 text-sm">
            ✨ <strong>Week {milestone[0]} milestone:</strong> {milestone[1]}
          </div>
        )}
      </div>

      {/* Baby size card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/checklists" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-1">✅</div>
          <p className="text-2xl font-bold text-orange-500">{doneChecklistItems}<span className="text-slate-400 text-base font-normal">/{totalChecklistItems}</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Checklist items</p>
          <div className="mt-2 bg-slate-100 rounded-full h-1.5">
            <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: `${checklistPct}%` }} />
          </div>
        </Link>

        <Link to="/immunizations" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-1">💉</div>
          <p className="text-2xl font-bold text-teal-500">{immDone}<span className="text-slate-400 text-base font-normal">/{IMMUNIZATIONS.length}</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Vaccines done</p>
          <div className="mt-2 bg-slate-100 rounded-full h-1.5">
            <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${Math.round(immDone/IMMUNIZATIONS.length*100)}%` }} />
          </div>
        </Link>

        <Link to="/schools" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-1">🏫</div>
          <p className="text-2xl font-bold text-blue-500">{SCHOOLS.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Schools nearby</p>
          <p className="text-xs text-blue-400 mt-1">{favCount} favorited</p>
        </Link>

        <Link to="/savings" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-1">🐷</div>
          <p className="text-2xl font-bold text-green-500">${Number(savings.current || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">529 saved</p>
          <p className="text-xs text-green-400 mt-1">${savings.monthly || 300}/mo</p>
        </Link>
      </div>

      {/* Urgent to-dos */}
      <div className="card">
        <h2 className="section-title">⚡ Action Items</h2>
        <div className="space-y-2">
          {URGENT_TODOS.map((item, i) => (
            <label key={i} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${todosDone[i] ? "bg-green-50" : item.urgent ? "bg-orange-50" : "bg-slate-50"} hover:bg-orange-50`}>
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded accent-orange-500 flex-shrink-0"
                checked={!!todosDone[i]}
                onChange={() => setTodosDone(prev => ({ ...prev, [i]: !prev[i] }))}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-medium ${todosDone[i] ? "line-through text-slate-400" : "text-slate-800"}`}>{item.text}</span>
                  {item.urgent && !todosDone[i] && <span className="badge bg-red-100 text-red-600">Urgent</span>}
                  {item.link && !todosDone[i] && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 hover:underline" onClick={e => e.stopPropagation()}>
                      Open ↗
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.due}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cost snapshot */}
      <div className="card">
        <h2 className="section-title">💰 Monthly Cost Snapshot (Denver 2026)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { emoji: "👶", label: "Infant Daycare", range: "$1,500–$2,600", note: "Full-time, until age ~3" },
            { emoji: "🎒", label: "Preschool", range: "$650–$1,800", note: "Ages 3–5" },
            { emoji: "🏥", label: "Health Insurance", range: "$300–$600", note: "Add child to employer plan" },
            { emoji: "🎓", label: "529 Savings", range: "$200–$500", note: "Colorado state tax deductible" },
            { emoji: "🍼", label: "Diapers & Essentials", range: "$200–$400", note: "First 2 years" },
            { emoji: "🏫", label: "Private Elementary", range: "$900–$1,200", note: "Public school is free" },
          ].map(c => (
            <div key={c.label} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50">
              <span className="text-2xl">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm">{c.label}</p>
                <p className="text-xs text-slate-500">{c.note}</p>
              </div>
              <p className="font-bold text-slate-700 text-sm flex-shrink-0">{c.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
