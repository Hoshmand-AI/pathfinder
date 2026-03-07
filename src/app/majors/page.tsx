"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, X, Bookmark } from "lucide-react";
import { majors, majorCategories } from "@/lib/data/majors";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatGrowth, cn } from "@/lib/utils";
import type { MajorCategory } from "@/lib/types";

const CATEGORY_BADGE: Record<string, { border: string; bg: string; text: string }> = {
  "STEM":                { border: "border-[#4A7FB5]", bg: "bg-[rgba(74,127,181,0.06)]", text: "text-[#4A7FB5]" },
  "Business":            { border: "border-[#C8963E]", bg: "bg-[#FDF6E9]",                text: "text-[#B8862E]" },
  "Health & Medicine":   { border: "border-[#3D8B6E]", bg: "bg-[rgba(61,139,110,0.06)]", text: "text-[#3D8B6E]" },
  "Social Sciences":     { border: "border-[#C4873B]", bg: "bg-[rgba(196,135,59,0.06)]", text: "text-[#C4873B]" },
  "Arts & Humanities":   { border: "border-[#C4873B]", bg: "bg-[rgba(196,135,59,0.06)]", text: "text-[#C4873B]" },
  "Law & Policy":        { border: "border-[#B85C5C]", bg: "bg-[rgba(184,92,92,0.06)]",  text: "text-[#B85C5C]" },
  "Education":           { border: "border-[#4A7FB5]", bg: "bg-[rgba(74,127,181,0.06)]", text: "text-[#4A7FB5]" },
};

function getBadge(cat: string) {
  return CATEGORY_BADGE[cat] ?? { border: "border-[#B8B0A4]", bg: "bg-[#F8F6F3]", text: "text-[#8A8178]" };
}

export default function MajorsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<MajorCategory | "All">("All");
  const [sortBy, setSortBy] = useState<"popularity" | "salary" | "growth">("popularity");
  const { profile, toggleSavedMajor } = useAppStore();

  const filtered = majors
    .filter((m) => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      const matchCat = category === "All" || m.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "salary") return b.avgSalaryMid - a.avgSalaryMid;
      if (sortBy === "growth") return b.jobGrowth - a.jobGrowth;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });

  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-14">
      {/* Page header */}
      <div className="max-w-6xl mx-auto px-6 pt-9">
        <h1 className="font-serif text-[32px] text-[#0A1628] mb-1.5">Explore Majors & Degrees</h1>
        <p className="text-[15px] text-[#8A8178] mb-6">Compare 500+ majors with real salary data, job outlooks, and career paths.</p>

        {/* Search + sort row */}
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <div className="relative flex-shrink-0 w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B0A4]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search majors, e.g. Computer Science..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8F6F3] border border-[#E2DDD5] rounded-md text-[13.5px] text-[#0A1628] placeholder-[#B8B0A4] focus:outline-none focus:border-[#B8B0A4]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-[#B8B0A4]" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setCategory("All")}
              className={cn(
                "px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors duration-150",
                category === "All"
                  ? "bg-[#0F2140] text-white border-[#0F2140]"
                  : "bg-[#F8F6F3] text-[#6B6359] border-[#F0EDE8] hover:bg-[#F0EDE8]"
              )}
            >
              All
            </button>
            {majorCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors duration-150",
                  category === c
                    ? "bg-[#0F2140] text-white border-[#0F2140]"
                    : "bg-[#F8F6F3] text-[#6B6359] border-[#F0EDE8] hover:bg-[#F0EDE8]"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="ml-auto bg-[#F8F6F3] border border-[#E2DDD5] text-[#6B6359] text-[13px] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#B8B0A4]"
          >
            <option value="popularity">Sort: Popular</option>
            <option value="salary">Sort: Highest Salary</option>
            <option value="growth">Sort: Fastest Growth</option>
          </select>
        </div>

        <p className="text-[12px] text-[#B8B0A4] uppercase tracking-[0.06em] font-medium mt-4 mb-2">
          Showing {filtered.length} majors
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((m) => {
            const saved = profile.savedMajors.includes(m.id);
            const badge = getBadge(m.category);
            return (
              <div
                key={m.id}
                className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-5 hover:border-[#E2DDD5] hover:shadow-sm transition-all duration-200 relative"
              >
                {/* Bookmark */}
                <button
                  onClick={() => toggleSavedMajor(m.id)}
                  className="absolute top-4 right-4 text-[#B8B0A4] hover:text-[#C8963E] transition-colors duration-150"
                >
                  <Bookmark className={cn("w-4 h-4", saved && "fill-[#C8963E] text-[#C8963E]")} />
                </button>

                <Link href={`/majors/${m.slug}`} className="block">
                  <h3 className="text-[16px] font-semibold text-[#0A1628] mb-2 pr-6">{m.name}</h3>

                  {/* Badge */}
                  <span className={cn("inline-block text-[11px] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 border-l-[3px] mb-2", badge.border, badge.bg, badge.text)}>
                    {m.category}
                  </span>

                  <p className="text-[13.5px] text-[#8A8178] leading-snug mb-4 line-clamp-2">{m.description}</p>

                  {/* Salary row */}
                  <div className="flex justify-between border-t border-[#F0EDE8] pt-3">
                    {[
                      { label: "Entry", value: formatCurrency(m.avgSalaryEntry, true) },
                      { label: "Mid",   value: formatCurrency(m.avgSalaryMid, true) },
                      { label: "Senior", value: formatCurrency(m.avgSalarySenior, true) },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <div className="text-[10px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium mb-0.5">{s.label}</div>
                        <div className="text-[15px] font-semibold text-[#0A1628] tabular-nums">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[12.5px] font-medium text-[#3D8B6E]">↑ {formatGrowth(m.jobGrowth)} growth (10yr)</span>
                    <span className="text-[13px] font-medium text-[#8A8178] hover:text-[#0A1628] transition-colors duration-150">View details →</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#B8B0A4] text-sm">No majors found. Try a different search or category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
