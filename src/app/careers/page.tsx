"use client";
import { useState } from "react";
import Link from "next/link";
import { careers, getCareerCategories } from "@/lib/data/careers";
import { formatCurrency, formatNumber, getGrowthColor, cn } from "@/lib/utils";
import { Search, TrendingUp, DollarSign, Users, Briefcase, ArrowRight, Star } from "lucide-react";

const outlookColors = {
  Excellent: "bg-emerald-100 text-emerald-700",
  Good: "bg-blue-100 text-blue-700",
  Fair: "bg-yellow-100 text-yellow-700",
  Declining: "bg-red-100 text-red-700",
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
    <main className="lg:pl-[260px] min-h-screen bg-slate-50">
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-2">Career Path Explorer</h1>
            <p className="text-emerald-200 mb-6">Explore {careers.length}+ careers with real salary data, growth rates, and employer insights.</p>
            <div className="flex gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search careers, e.g. Software Engineer..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border-0 text-gray-700 text-sm rounded-2xl px-4 py-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="salary">Highest Salary</option>
                <option value="growth">Fastest Growth</option>
                <option value="openings">Most Openings</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={cn("flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  category === c ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
                )}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Career List */}
            <div className={cn("space-y-3", selectedCareer ? "lg:col-span-1" : "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 space-y-0")}>
              {filtered.map((c) => {
                const isActive = selected === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(isActive ? null : c.id)}
                    className={cn(
                      "w-full text-left bg-white rounded-2xl p-5 border transition-all hover:shadow-lg",
                      isActive ? "border-emerald-400 shadow-lg ring-1 ring-emerald-400" : "border-gray-100 hover:-translate-y-0.5"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className={cn("font-bold text-base mb-0.5", isActive ? "text-emerald-700" : "text-gray-900")}>{c.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.category}</span>
                      </div>
                      <span className={cn("text-xs font-semibold px-2 py-1 rounded-lg", outlookColors[c.outlook])}>
                        {c.outlook}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.description}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-400">Avg Salary</p>
                        <p className="text-sm font-bold text-emerald-600">{formatCurrency(c.avgSalary, true)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">10yr Growth</p>
                        <p className={cn("text-sm font-bold", getGrowthColor(c.jobGrowth10yr))}>+{c.jobGrowth10yr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Openings/yr</p>
                        <p className="text-sm font-bold text-blue-600">{formatNumber(c.annualOpenings)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Career Detail Panel */}
            {selectedCareer && (
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-1">{selectedCareer.title}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{selectedCareer.category}</span>
                        <span className={cn("text-sm font-semibold px-2 py-0.5 rounded-full", outlookColors[selectedCareer.outlook])}>
                          {selectedCareer.outlook} Outlook
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">{selectedCareer.description}</p>

                  {/* Salary Levels */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Entry Level", value: selectedCareer.entryLevelSalary, color: "bg-blue-50 text-blue-700" },
                      { label: "Average", value: selectedCareer.avgSalary, color: "bg-emerald-50 text-emerald-700" },
                      { label: "Senior", value: selectedCareer.seniorSalary, color: "bg-violet-50 text-violet-700" },
                    ].map((s) => (
                      <div key={s.label} className={cn("rounded-2xl p-4 text-center", s.color)}>
                        <p className="text-xs font-medium mb-1">{s.label}</p>
                        <p className="text-xl font-black">{formatCurrency(s.value, true)}</p>
                        <p className="text-xs opacity-70">per year</p>
                      </div>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                      <p className="text-lg font-black text-gray-900">+{selectedCareer.jobGrowth10yr}%</p>
                      <p className="text-xs text-gray-500">10yr Growth</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-black text-gray-900">{formatNumber(selectedCareer.annualOpenings)}</p>
                      <p className="text-xs text-gray-500">Annual Openings</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Briefcase className="w-5 h-5 text-violet-500 mx-auto mb-1" />
                      <p className="text-xs font-bold text-gray-900">{selectedCareer.requiredDegree.split(" ").slice(0, 3).join(" ")}</p>
                      <p className="text-xs text-gray-500">Required Degree</p>
                    </div>
                  </div>

                  {/* A Day in the Life */}
                  <div className="mb-5">
                    <h3 className="font-bold text-gray-900 mb-3">A Day in the Life</h3>
                    <ul className="space-y-1.5">
                      {selectedCareer.dayInLife.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills & Employers grid */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">Key Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCareer.skills.map((s) => (
                          <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">Top Employers</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCareer.topEmployers.slice(0, 4).map((e) => (
                          <span key={e} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Cities */}
                  <div className="mb-5">
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">Top Cities for This Career</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.topCities.map((city) => (
                        <span key={city} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">📍 {city}</span>
                      ))}
                    </div>
                  </div>

                  {/* Related Majors */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">Related Majors to Study</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.relatedMajors.map((m) => (
                        <Link key={m} href={`/majors?search=${encodeURIComponent(m)}`}
                          className="text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full border border-violet-100 hover:bg-violet-100 transition-colors flex items-center gap-1">
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
      </div>
    </main>
  );
}
