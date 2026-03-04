"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, DollarSign, Bookmark, Filter, X } from "lucide-react";
import { majors, majorCategories } from "@/lib/data/majors";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatGrowth, getGrowthColor, CATEGORY_COLORS, cn } from "@/lib/utils";
import type { MajorCategory } from "@/lib/types";

const difficultyColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export default function MajorsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MajorCategory | "All">("All");
  const [sortBy, setSortBy] = useState<"popularity" | "salary" | "growth">("popularity");
  const [showTrending, setShowTrending] = useState(false);
  const { profile, toggleSavedMajor } = useAppStore();

  const filtered = majors
    .filter((m) => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      const matchCat = category === "All" || m.category === category;
      const matchTrend = !showTrending || m.isTrending;
      return matchSearch && matchCat && matchTrend;
    })
    .sort((a, b) => {
      if (sortBy === "salary") return b.avgSalaryMid - a.avgSalaryMid;
      if (sortBy === "growth") return b.jobGrowth - a.jobGrowth;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });

  return (
    <main className="lg:pl-[260px] min-h-screen bg-slate-50">
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-2">Explore Majors & Degrees</h1>
            <p className="text-blue-200 mb-6">Discover {majors.length}+ fields of study with real salary data, job outlooks, and career paths.</p>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search majors, e.g. Computer Science, Nursing..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
              <button
                onClick={() => setCategory("All")}
                className={cn("flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  category === "All" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                )}
              >
                All Majors
              </button>
              {majorCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn("flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                    category === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowTrending(!showTrending)}
                className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  showTrending ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                )}
              >
                <TrendingUp className="w-4 h-4" /> Trending
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="popularity">Sort: Popular</option>
                <option value="salary">Sort: Highest Salary</option>
                <option value="growth">Sort: Fastest Growth</option>
              </select>
            </div>
          </div>

          <p className="text-gray-500 text-sm mb-5">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> majors
          </p>

          {/* Majors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((m) => {
              const saved = profile.savedMajors.includes(m.id);
              return (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
                  <Link href={`/majors/${m.slug}`} className="block p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{m.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{m.name}</h3>
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", CATEGORY_COLORS[m.category])}>
                            {m.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {m.isTrending && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">🔥 Hot</span>}
                        {m.isPopular && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">★ Popular</span>}
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{m.description}</p>

                    {/* Salary & Growth */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-gray-400 mb-0.5">Entry</p>
                        <p className="text-sm font-bold text-gray-700">{formatCurrency(m.avgSalaryEntry, true)}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-gray-400 mb-0.5">Mid</p>
                        <p className="text-sm font-bold text-emerald-700">{formatCurrency(m.avgSalaryMid, true)}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-gray-400 mb-0.5">Senior</p>
                        <p className="text-sm font-bold text-blue-700">{formatCurrency(m.avgSalarySenior, true)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className={cn("w-4 h-4", getGrowthColor(m.jobGrowth))} />
                        <span className={cn("text-sm font-semibold", getGrowthColor(m.jobGrowth))}>
                          {formatGrowth(m.jobGrowth)} growth (10yr)
                        </span>
                      </div>
                      <span className={cn("text-xs font-medium px-2 py-1 rounded-lg", difficultyColors[m.difficulty])}>
                        {m.difficulty} difficulty
                      </span>
                    </div>
                  </Link>

                  {/* Save button */}
                  <div className="px-6 pb-4">
                    <button
                      onClick={() => toggleSavedMajor(m.id)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all",
                        saved
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                      )}
                    >
                      <Bookmark className={cn("w-4 h-4", saved && "fill-white")} />
                      {saved ? "Saved" : "Save Major"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No majors found</h3>
              <p className="text-gray-400">Try a different search term or category</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
