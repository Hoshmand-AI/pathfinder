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
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your University</h1>
          <p className="text-gray-600">
            Browse {universities.length}+ US colleges with rankings, costs, and outcomes data.
          </p>
        </div>

        {/* Search & filter toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search universities, cities, states..."
              className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ranking">By Ranking</option>
              <option value="acceptanceRate">Easiest Admission</option>
              <option value="tuition">Lowest Tuition</option>
              <option value="salary">Highest Grad Salary</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors",
                showFilters
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {showFilters && <X className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  State
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All States</option>
                  {usStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Max In-State Tuition: {formatCurrency(maxTuition, true)}
                </label>
                <input
                  type="range" min="3000" max="70000" step="1000"
                  value={maxTuition}
                  onChange={(e) => setMaxTuition(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 mt-1"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$3k</span>
                  <span>$70k</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Type filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {typeOptions.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                typeFilter === t
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Compare bar */}
        {profile.compareList.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-700 font-medium text-sm">
                {profile.compareList.length} school{profile.compareList.length > 1 ? "s" : ""} selected for comparison
              </span>
            </div>
            <Link
              href="/compare"
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Compare Now
            </Link>
          </div>
        )}

        <p className="text-gray-500 text-sm mb-5">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> universities
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => {
            const saved = profile.savedUniversities.includes(u.id);
            const inCompare = profile.compareList.includes(u.id);
            const acceptance = getAcceptanceLabel(u.acceptanceRate);
            const chance = admissionChance(u.acceptanceRate, u.satRange, profile.satScore);

            return (
              <div
                key={u.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col"
              >
                <Link href={`/universities/${u.id}`} className="block p-5 flex-1">
                  {/* University name + location */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      {u.ranking > 0 && (
                        <span className="text-xs font-bold text-indigo-600 mb-1 block">
                          #{u.ranking} National
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {u.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 truncate">{u.city}, {u.state}</span>
                        <span className="text-gray-300 text-xs">·</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">{u.type}</span>
                      </div>
                    </div>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0", acceptance.color)}>
                      {acceptance.label}
                    </span>
                  </div>

                  {/* Key stats */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { label: "In-State Tuition", value: formatCurrency(u.tuitionInState, true) },
                      { label: "Acceptance Rate", value: formatPercent(u.acceptanceRate) },
                      { label: "Grad Salary (6yr)", value: formatCurrency(u.avgSalaryAfter6Yrs, true) },
                      { label: "Graduation Rate", value: formatPercent(u.graduationRate) },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{s.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* SAT range */}
                  {u.satRange[0] > 0 && (
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
                      <span>SAT: {u.satRange[0]}–{u.satRange[1]}</span>
                      <span>ACT: {u.actRange[0]}–{u.actRange[1]}</span>
                    </div>
                  )}

                  {/* Admission chance */}
                  {profile.satScore > 0 && u.satRange[0] > 0 && (
                    <div className={cn(
                      "mt-3 text-xs font-medium px-3 py-1.5 rounded-lg text-center",
                      chance.color.includes("emerald") ? "bg-emerald-50 text-emerald-700" :
                      chance.color.includes("blue") ? "bg-blue-50 text-blue-700" :
                      chance.color.includes("yellow") ? "bg-amber-50 text-amber-700" :
                      "bg-red-50 text-red-700"
                    )}>
                      Your Chance: {chance.label} (~{Math.round(chance.percent)}%)
                    </div>
                  )}
                </Link>

                {/* Card footer: actions */}
                <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
                  <Link
                    href={`/universities/${u.id}`}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex-1"
                  >
                    View details →
                  </Link>
                  <button
                    onClick={() => toggleSavedUniversity(u.id)}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      saved
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600"
                    )}
                    title={saved ? "Unsave" : "Save"}
                  >
                    <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-white")} />
                    {saved ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={() => toggleCompare(u.id)}
                    disabled={!inCompare && profile.compareList.length >= 4}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      inCompare
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : profile.compareList.length >= 4
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600"
                    )}
                    title={inCompare ? "Remove from compare" : "Add to compare"}
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
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No universities found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </main>
  );
}
