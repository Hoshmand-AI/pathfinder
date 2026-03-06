"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Scale, Bookmark, X, SlidersHorizontal } from "lucide-react";
import { universities, usStates } from "@/lib/data/universities";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent, getAcceptanceLabel, admissionChance, cn } from "@/lib/utils";

type SortKey = "ranking" | "acceptanceRate" | "tuition" | "salary";
type TypeFilter = "All" | "Public" | "Private" | "Ivy League" | "Liberal Arts" | "Community College";

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [sortBy, setSortBy] = useState<SortKey>("ranking");
  const [maxTuition, setMaxTuition] = useState(70000);
  const [showFilters, setShowFilters] = useState(false);
  const { profile, toggleSavedUniversity, toggleCompare } = useAppStore();

  const filtered = universities
    .filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q) || u.state.toLowerCase().includes(q);
      const matchState = stateFilter === "All" || u.state === stateFilter;
      const matchType = typeFilter === "All" || u.type === typeFilter;
      const matchTuition = u.tuitionInState <= maxTuition;
      return matchSearch && matchState && matchType && matchTuition;
    })
    .sort((a, b) => {
      if (sortBy === "ranking") return (a.ranking || 999) - (b.ranking || 999);
      if (sortBy === "acceptanceRate") return b.acceptanceRate - a.acceptanceRate;
      if (sortBy === "tuition") return a.tuitionInState - b.tuitionInState;
      if (sortBy === "salary") return b.avgSalaryAfter6Yrs - a.avgSalaryAfter6Yrs;
      return 0;
    });

  const typeOptions: TypeFilter[] = ["All", "Public", "Private", "Ivy League", "Liberal Arts", "Community College"];

  return (
    <main className="min-h-screen bg-gray-50 pt-14">
      <div className="bg-white border-b border-gray-100 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Your University</h1>
            <p className="text-gray-500 text-sm mb-5">Browse {universities.length}+ US colleges with rankings, costs, and outcomes data.</p>
            <div className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search universities, cities, states..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all border",
                  showFilters ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    <option value="All">All States</option>
                    {usStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max In-State Tuition: {formatCurrency(maxTuition, true)}</label>
                  <input
                    type="range" min="3000" max="70000" step="1000"
                    value={maxTuition}
                    onChange={(e) => setMaxTuition(parseInt(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    <option value="ranking">National Ranking</option>
                    <option value="acceptanceRate">Acceptance Rate (Easiest)</option>
                    <option value="tuition">Lowest Tuition</option>
                    <option value="salary">Highest Graduate Salary</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Type filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            {typeOptions.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={cn("flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  typeFilter === t ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                )}>
                {t}
              </button>
            ))}
          </div>

          {/* Compare bar */}
          {profile.compareList.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium text-sm">
                  {profile.compareList.length} school{profile.compareList.length > 1 ? "s" : ""} in comparison
                </span>
              </div>
              <Link href="/compare" className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                Compare Now
              </Link>
            </div>
          )}

          <p className="text-gray-500 text-sm mb-5">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> universities
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((u) => {
              const saved = profile.savedUniversities.includes(u.id);
              const inCompare = profile.compareList.includes(u.id);
              const acceptance = getAcceptanceLabel(u.acceptanceRate);
              const chance = admissionChance(u.acceptanceRate, u.satRange, profile.satScore);

              return (
                <div key={u.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
                  {/* Color band */}
                  <div className="h-2" style={{ background: `linear-gradient(90deg, ${u.colors[0] || '#2563eb'}, ${u.colors[1] || '#7c3aed'})` }} />

                  <Link href={`/universities/${u.id}`} className="block p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {u.ranking > 0 && (
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-lg">
                              #{u.ranking}
                            </span>
                          )}
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", acceptance.color)}>
                            {acceptance.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-1">{u.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{u.city}, {u.state} · {u.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-xs text-gray-400">In-State Tuition</p>
                        <p className="text-sm font-bold text-gray-800">{formatCurrency(u.tuitionInState, true)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-xs text-gray-400">Acceptance Rate</p>
                        <p className="text-sm font-bold text-gray-800">{formatPercent(u.acceptanceRate)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-xs text-gray-400">Grad Salary (6yr)</p>
                        <p className="text-sm font-bold text-emerald-600">{formatCurrency(u.avgSalaryAfter6Yrs, true)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <p className="text-xs text-gray-400">Graduation Rate</p>
                        <p className="text-sm font-bold text-blue-600">{formatPercent(u.graduationRate)}</p>
                      </div>
                    </div>

                    {/* SAT Range */}
                    {u.satRange[0] > 0 && (
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>SAT: {u.satRange[0]}–{u.satRange[1]}</span>
                        <span>ACT: {u.actRange[0]}–{u.actRange[1]}</span>
                      </div>
                    )}

                    {/* Admission chance for this student */}
                    {profile.satScore > 0 && u.satRange[0] > 0 && (
                      <div className={cn("text-xs font-semibold px-2 py-1.5 rounded-lg text-center", chance.color, "bg-opacity-10 bg-current")}>
                        Your Chance: {chance.label} (~{Math.round(chance.percent)}%)
                      </div>
                    )}
                  </Link>

                  {/* Actions */}
                  <div className="px-5 pb-4 flex gap-2">
                    <button
                      onClick={() => toggleSavedUniversity(u.id)}
                      className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border transition-all",
                        saved ? "bg-violet-600 text-white border-violet-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600"
                      )}
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-white")} />
                      {saved ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={() => toggleCompare(u.id)}
                      disabled={!inCompare && profile.compareList.length >= 4}
                      className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border transition-all",
                        inCompare ? "bg-blue-600 text-white border-blue-600" :
                        profile.compareList.length >= 4 ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" :
                        "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                      )}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      {inCompare ? "Added" : "Compare"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🏫</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No universities found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
      </div>
    </main>
  );
}
