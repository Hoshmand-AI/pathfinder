"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, Bookmark, X, SlidersHorizontal } from "lucide-react";
import { majors, majorCategories } from "@/lib/data/majors";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatGrowth, getGrowthColor, CATEGORY_COLORS, cn } from "@/lib/utils";
import type { MajorCategory } from "@/lib/types";

const difficultyColors = {
  Low: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
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
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Majors & Degrees</h1>
          <p className="text-gray-600">
            Discover {majors.length}+ fields of study with real salary data, job outlooks, and career paths.
          </p>
        </div>

        {/* Search & Sort row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search majors, e.g. Computer Science..."
              className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTrending(!showTrending)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                showTrending
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Trending
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popularity">Sort: Popular</option>
              <option value="salary">Sort: Highest Salary</option>
              <option value="growth">Sort: Fastest Growth</option>
            </select>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setCategory("All")}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
              category === "All"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            )}
          >
            All Majors
          </button>
          {majorCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                category === c
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-5">
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> majors
        </p>

        {/* Majors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((m) => {
            const saved = profile.savedMajors.includes(m.id);
            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden group flex flex-col"
              >
                <Link href={`/majors/${m.slug}`} className="block p-6 flex-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{m.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base group-hover:text-indigo-600 transition-colors leading-snug">
                          {m.name}
                        </h3>
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block", CATEGORY_COLORS[m.category])}>
                          {m.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {m.isTrending && (
                        <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium border border-orange-100">
                          Trending
                        </span>
                      )}
                      {m.isPopular && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{m.description}</p>

                  {/* Salary row */}
                  <div className="flex justify-between mb-4 py-3 border-t border-gray-100">
                    {[
                      { label: "Entry", value: formatCurrency(m.avgSalaryEntry, true) },
                      { label: "Mid", value: formatCurrency(m.avgSalaryMid, true) },
                      { label: "Senior", value: formatCurrency(m.avgSalarySenior, true) },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{s.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className={cn("w-3.5 h-3.5", getGrowthColor(m.jobGrowth))} />
                      <span className={cn("text-xs font-medium", getGrowthColor(m.jobGrowth))}>
                        {formatGrowth(m.jobGrowth)} growth (10yr)
                      </span>
                    </div>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-md", difficultyColors[m.difficulty])}>
                      {m.difficulty}
                    </span>
                  </div>
                </Link>

                {/* Footer with save */}
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/majors/${m.slug}`}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View details →
                  </Link>
                  <button
                    onClick={() => toggleSavedMajor(m.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      saved
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600"
                    )}
                    aria-label={saved ? "Unsave major" : "Save major"}
                  >
                    <Bookmark className={cn("w-3.5 h-3.5", saved && "fill-white")} />
                    {saved ? "Saved" : "Save"}
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
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No majors found</h3>
            <p className="text-gray-400 text-sm">Try a different search term or category</p>
          </div>
        )}
      </div>
    </main>
  );
}
