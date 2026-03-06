"use client";
import { useState } from "react";
import Link from "next/link";
import { careers, getCareerCategories } from "@/lib/data/careers";
import { formatCurrency, formatNumber, getGrowthColor, cn } from "@/lib/utils";
import { Search, TrendingUp, Users, Briefcase, ArrowRight, X } from "lucide-react";

const outlookColors = {
  Excellent: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Good: "bg-blue-50 text-blue-700 border-blue-100",
  Fair: "bg-amber-50 text-amber-700 border-amber-100",
  Declining: "bg-red-50 text-red-700 border-red-100",
};

export default function CareersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"salary" | "growth" | "openings">("salary");
  const [selected, setSelected] = useState<string | null>(null);

  const categories = ["All", ...getCareerCategories()];

  const filtered = careers
    .filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      const matchCat = category === "All" || c.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "salary") return b.avgSalary - a.avgSalary;
      if (sortBy === "growth") return b.jobGrowth10yr - a.jobGrowth10yr;
      return b.annualOpenings - a.annualOpenings;
    });

  const selectedCareer = careers.find((c) => c.id === selected);

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Path Explorer</h1>
          <p className="text-gray-600">
            Explore {careers.length}+ careers with real salary data, growth rates, and employer insights.
          </p>
        </div>

        {/* Search & sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search careers, e.g. Software Engineer..."
              className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="salary">Highest Salary</option>
            <option value="growth">Fastest Growth</option>
            <option value="openings">Most Openings</option>
          </select>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((c) => (
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
          Showing <span className="font-semibold text-gray-800">{filtered.length}</span> careers
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="ml-3 text-indigo-600 hover:text-indigo-700 font-medium text-xs"
            >
              Clear selection ×
            </button>
          )}
        </p>

        <div className={cn(
          "grid gap-6",
          selectedCareer ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {/* Career list */}
          <div className={cn(
            selectedCareer
              ? "lg:col-span-1 space-y-2"
              : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          )}>
            {filtered.map((c) => {
              const isActive = selected === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(isActive ? null : c.id)}
                  className={cn(
                    "w-full text-left bg-white rounded-xl border transition-all hover:shadow-md p-5",
                    isActive
                      ? "border-indigo-300 shadow-md ring-1 ring-indigo-200"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className={cn(
                        "font-semibold text-sm leading-snug mb-1",
                        isActive ? "text-indigo-700" : "text-gray-900"
                      )}>
                        {c.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {c.category}
                      </span>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0",
                      outlookColors[c.outlook]
                    )}>
                      {c.outlook}
                    </span>
                  </div>

                  {!selectedCareer && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description}</p>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Avg Salary</p>
                      <p className="text-sm font-semibold text-emerald-600 tabular-nums">
                        {formatCurrency(c.avgSalary, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">10yr Growth</p>
                      <p className={cn("text-sm font-semibold tabular-nums", getGrowthColor(c.jobGrowth10yr))}>
                        +{c.jobGrowth10yr}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Openings/yr</p>
                      <p className="text-sm font-semibold text-gray-900 tabular-nums">
                        {formatNumber(c.annualOpenings)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className={cn("text-center py-16", !selectedCareer && "col-span-full")}>
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">No careers found</h3>
                <p className="text-gray-400 text-sm">Try a different search term or category</p>
              </div>
            )}
          </div>

          {/* Career detail panel */}
          {selectedCareer && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedCareer.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {selectedCareer.category}
                      </span>
                      <span className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full border",
                        outlookColors[selectedCareer.outlook]
                      )}>
                        {selectedCareer.outlook} Outlook
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">{selectedCareer.description}</p>

                {/* Salary levels */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Entry Level", value: selectedCareer.entryLevelSalary, cls: "bg-gray-50" },
                    { label: "Average", value: selectedCareer.avgSalary, cls: "bg-emerald-50" },
                    { label: "Senior", value: selectedCareer.seniorSalary, cls: "bg-indigo-50" },
                  ].map((s) => (
                    <div key={s.label} className={cn("rounded-xl p-4 text-center", s.cls)}>
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className="text-lg font-bold text-gray-900 tabular-nums">
                        {formatCurrency(s.value, true)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">per year</p>
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                    <p className="text-base font-bold text-gray-900">+{selectedCareer.jobGrowth10yr}%</p>
                    <p className="text-xs text-gray-500 mt-0.5">10yr Growth</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Users className="w-4 h-4 text-blue-500 mx-auto mb-1.5" />
                    <p className="text-base font-bold text-gray-900">{formatNumber(selectedCareer.annualOpenings)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Annual Openings</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Briefcase className="w-4 h-4 text-violet-500 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-gray-900 leading-snug">{selectedCareer.requiredDegree.split(" ").slice(0, 3).join(" ")}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Required Degree</p>
                  </div>
                </div>

                {/* Day in the life */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">A Day in the Life</h3>
                  <ul className="space-y-1.5">
                    {selectedCareer.dayInLife.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-emerald-500 mt-px flex-shrink-0 font-bold">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills & Employers */}
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCareer.skills.map((s) => (
                        <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Top Employers</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCareer.topEmployers.slice(0, 5).map((e) => (
                        <span key={e} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Cities */}
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Top Cities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.topCities.map((city) => (
                      <span key={city} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Majors */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Related Majors to Study
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.relatedMajors.map((m) => (
                      <Link
                        key={m}
                        href={`/majors?search=${encodeURIComponent(m)}`}
                        className="text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full border border-violet-100 hover:bg-violet-100 transition-colors flex items-center gap-1"
                      >
                        {m} <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
