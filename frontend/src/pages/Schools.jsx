import { useState } from "react";
import { Heart, MapPin, Phone, ExternalLink, Star } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { SCHOOLS } from "../data/schools.js";

const TYPE_LABELS = { daycare: "👶 Daycare", preschool: "🎨 Preschool", elementary: "🏫 Elementary", middle: "📚 Middle School", high: "🎓 High School" };
const TYPE_ORDER = ["daycare", "preschool", "elementary", "middle", "high"];
const TYPE_COLORS = { daycare: "bg-pink-100 text-pink-700", preschool: "bg-orange-100 text-orange-700", elementary: "bg-amber-100 text-amber-700", middle: "bg-blue-100 text-blue-700", high: "bg-purple-100 text-purple-700" };

function Stars({ rating }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
      ))}
      <span className="text-xs text-slate-500 ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function Schools() {
  const [favorites, setFavorites] = useLocalStorage("schoolFavorites", {});
  const [activeType, setActiveType] = useState("all");
  const [favOnly, setFavOnly] = useState(false);

  const toggleFav = (id) => setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered = SCHOOLS
    .filter((s) => activeType === "all" || s.type === activeType)
    .filter((s) => !favOnly || favorites[s.id]);

  const grouped = {};
  TYPE_ORDER.forEach((t) => {
    const g = filtered.filter((s) => s.type === t);
    if (g.length) grouped[t] = g;
  });

  return (
    <div className="space-y-5">
      <div className="card">
        <h1 className="text-2xl font-bold text-slate-800">🏫 Schools & Daycares</h1>
        <p className="text-slate-500 text-sm mt-0.5">Near 3280 W Hayward Pl, Denver CO 80211 · Berkeley / Highlands</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setActiveType("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeType === "all" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            All
          </button>
          {TYPE_ORDER.map((t) => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${activeType === t ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {TYPE_LABELS[t]}
            </button>
          ))}
          <button onClick={() => setFavOnly((f) => !f)}
            className={`ml-auto px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${favOnly ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            <Heart className={`w-3.5 h-3.5 ${favOnly ? "fill-red-500 text-red-500" : ""}`} />
            Favorites
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([type, list]) => (
        <div key={type}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{TYPE_LABELS[type]} ({list.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((school) => (
              <div key={school.id} className="card hover:shadow-md transition-shadow relative">
                <button className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors" onClick={() => toggleFav(school.id)}>
                  <Heart className={`w-5 h-5 transition-colors ${favorites[school.id] ? "fill-red-500 text-red-500" : "text-slate-300 hover:text-red-400"}`} />
                </button>

                <div className="pr-10">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <span className={`badge ${TYPE_COLORS[school.type]}`}>{TYPE_LABELS[school.type]}</span>
                    {school.monthly_cost_min === 0 && <span className="badge bg-green-100 text-green-700">Free (Public)</span>}
                    {school.waitlist_months > 6 && <span className="badge bg-red-100 text-red-700">Long waitlist</span>}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mt-1">{school.name}</h3>
                  <Stars rating={school.rating} />
                </div>

                <div className="mt-3 space-y-1.5 text-sm">
                  {school.address && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" />
                      <span>{school.address}</span>
                      <span className="text-xs text-slate-400 flex-shrink-0">({school.distance_miles} mi)</span>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${school.phone}`} className="hover:text-purple-600">{school.phone}</a>
                    </div>
                  )}
                  {school.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline truncate">
                        {school.website.replace("https://", "")}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-slate-400">Cost/Month</p>
                    <p className="font-semibold text-slate-700 text-sm">
                      {school.monthly_cost_min === 0 && school.monthly_cost_max === 0 ? "Free"
                        : `$${school.monthly_cost_min?.toLocaleString()}–$${school.monthly_cost_max?.toLocaleString()}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Waitlist</p>
                    <p className={`font-semibold text-sm ${school.waitlist_months > 6 ? "text-red-600" : "text-slate-700"}`}>
                      {school.waitlist_months ? `${school.waitlist_months} mo` : "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Ages</p>
                    <p className="font-semibold text-slate-700 text-sm">
                      {school.enrollment_age_min}–{school.enrollment_age_max}
                      {school.type === "daycare" || school.type === "preschool" ? " mo" : " yr"}
                    </p>
                  </div>
                </div>

                {school.notes && (
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">{school.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
