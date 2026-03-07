"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, X, Bookmark, SlidersHorizontal } from "lucide-react";
import { universities, usStates } from "@/lib/data/universities";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent, getAcceptanceLabel, cn } from "@/lib/utils";

type SortKey = "ranking" | "acceptanceRate" | "tuition" | "salary";
type TypeFilter = "All" | "Public" | "Private" | "Ivy League" | "Liberal Arts" | "Community College";

const typeOptions: TypeFilter[] = ["All", "Public", "Private", "Ivy League", "Liberal Arts", "Community College"];

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [sortBy, setSortBy] = useState<SortKey>("ranking");
  const [maxTuition, setMaxTuition] = useState(70000);
  const [showFilters, setShowFilters] = useState(false);
  const { profile, toggleSavedUniversity } = useAppStore();

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

  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-14">
      <div className="max-w-6xl mx-auto px-6 pt-9">
        <h1 className="font-serif text-[32px] text-[#0A1628] mb-1.5">Find Your University</h1>
        <p className="text-[15px] text-[#8A8178] mb-6">Search 4,000+ schools by rankings, costs, and outcomes data.</p>

        {/* Search row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative w-[280px] flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B0A4]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search universities, cities..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8F6F3] border border-[#E2DDD5] rounded-md text-[13.5px] text-[#0A1628] placeholder-[#B8B0A4] focus:outline-none focus:border-[#B8B0A4]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-[#B8B0A4]" />
              </button>
            )}
          </div>

          {/* Type chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {typeOptions.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors duration-150",
                  typeFilter === t
                    ? "bg-[#0F2140] text-white border-[#0F2140]"
                    : "bg-[#F8F6F3] text-[#6B6359] border-[#F0EDE8] hover:bg-[#F0EDE8]"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "ml-auto flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors duration-150",
              showFilters
                ? "bg-[#0F2140] text-white border-[#0F2140]"
                : "bg-[#F8F6F3] text-[#6B6359] border-[#F0EDE8] hover:bg-[#F0EDE8]"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-[#F8F6F3] border border-[#E2DDD5] text-[#6B6359] text-[13px] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#B8B0A4]"
          >
            <option value="ranking">Sort: Ranking</option>
            <option value="acceptanceRate">Sort: Easiest Admission</option>
            <option value="tuition">Sort: Lowest Tuition</option>
            <option value="salary">Sort: Highest Grad Salary</option>
          </select>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-5 mb-4 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.06em] font-medium text-[#B8B0A4] mb-1.5">State</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full bg-white border border-[#E2DDD5] text-[#6B6359] text-[13px] rounded-md px-3 py-2 focus:outline-none focus:border-[#B8B0A4]"
              >
                <option value="All">All States</option>
                {usStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.06em] font-medium text-[#B8B0A4] mb-1.5">
                Max Tuition: {formatCurrency(maxTuition, true)}
              </label>
              <input
                type="range" min="3000" max="70000" step="1000"
                value={maxTuition}
                onChange={(e) => setMaxTuition(parseInt(e.target.value))}
                className="w-full accent-[#162D54]"
              />
            </div>
          </div>
        )}

        <p className="text-[12px] text-[#B8B0A4] uppercase tracking-[0.06em] font-medium mb-4">
          Showing {filtered.length} universities
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((u) => {
            const saved = profile.savedUniversities.includes(u.id);
            const acceptance = getAcceptanceLabel(u.acceptanceRate);
            return (
              <div
                key={u.id}
                className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-5 hover:border-[#E2DDD5] hover:shadow-sm transition-all duration-200 relative"
              >
                {/* Bookmark */}
                <button
                  onClick={() => toggleSavedUniversity(u.id)}
                  className="absolute top-4 right-4 text-[#B8B0A4] hover:text-[#C8963E] transition-colors duration-150"
                >
                  <Bookmark className={cn("w-4 h-4", saved && "fill-[#C8963E] text-[#C8963E]")} />
                </button>

                <Link href={`/universities/${u.id}`} className="block">
                  {/* Rank + selectivity */}
                  <div className="flex items-center gap-2 mb-1">
                    {u.ranking > 0 && (
                      <span className="text-[13px] font-bold text-[#C8963E]">#{u.ranking}</span>
                    )}
                    <span className="text-[11px] uppercase tracking-[0.05em] font-medium text-[#8A8178]">{acceptance.label}</span>
                  </div>

                  <h3 className="text-[16px] font-semibold text-[#0A1628] mb-0.5 pr-6">{u.name}</h3>
                  <p className="text-[13px] text-[#8A8178] mb-4">{u.city}, {u.state} · {u.type}</p>

                  {/* Stats 2x2 */}
                  <div className="grid grid-cols-2 gap-3 border-t border-[#F0EDE8] pt-3">
                    {[
                      { label: "Tuition",         value: formatCurrency(u.tuitionInState, true) },
                      { label: "Acceptance Rate",  value: formatPercent(u.acceptanceRate) },
                      { label: "Grad Salary",      value: formatCurrency(u.avgSalaryAfter6Yrs, true) },
                      { label: "Graduation Rate",  value: formatPercent(u.graduationRate) },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="text-[10px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium mb-0.5">{s.label}</div>
                        <div className="text-[15px] font-semibold text-[#0A1628] tabular-nums">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#B8B0A4] text-sm">No universities found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}
