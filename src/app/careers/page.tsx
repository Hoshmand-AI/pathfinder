"use client";
import { useState } from "react";
import Link from "next/link";
import { careers, getCareerCategories } from "@/lib/data/careers";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import { Search } from "lucide-react";

const OUTLOOK_STYLE: Record<string, { text: string; color: string }> = {
  Excellent: { text: "Excellent",  color: "text-[#3D8B6E]" },
  Good:      { text: "Good",       color: "text-[#4A7FB5]" },
  Fair:      { text: "Fair",       color: "text-[#C4873B]" },
  Declining: { text: "Declining",  color: "text-[#B85C5C]" },
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
      if (sortBy === "salary")   return b.avgSalary - a.avgSalary;
      if (sortBy === "growth")   return b.jobGrowth10yr - a.jobGrowth10yr;
      return b.annualOpenings - a.annualOpenings;
    });

  const selectedCareer = careers.find((c) => c.id === selected);

  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-14">
      <div className="max-w-6xl mx-auto px-6 pt-9">
        <h1 className="font-serif text-[32px] text-[#0A1628] mb-1.5">Career Path Explorer</h1>
        <p className="text-[15px] text-[#8A8178] mb-6">Explore {careers.length}+ careers with salary data, growth rates, and employer insights.</p>

        {/* Search + sort */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="relative w-[260px] flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8B0A4]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search careers..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8F6F3] border border-[#E2DDD5] rounded-md text-[13.5px] text-[#0A1628] placeholder-[#B8B0A4] focus:outline-none focus:border-[#B8B0A4]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="ml-auto bg-[#F8F6F3] border border-[#E2DDD5] text-[#6B6359] text-[13px] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#B8B0A4]"
          >
            <option value="salary">Highest Salary</option>
            <option value="growth">Fastest Growth</option>
            <option value="openings">Most Openings</option>
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className={cn("grid gap-6", selectedCareer ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1")}>
          {/* Career list */}
          <div className={cn(
            selectedCareer
              ? "space-y-3"
              : "grid grid-cols-1 md:grid-cols-2 gap-4"
          )}>
            {filtered.map((c) => {
              const isActive = selected === c.id;
              const outlook = OUTLOOK_STYLE[c.outlook] ?? { text: c.outlook, color: "text-[#8A8178]" };
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(isActive ? null : c.id)}
                  className={cn(
                    "w-full text-left bg-[#F8F6F3] rounded-lg p-5 border transition-all duration-200",
                    isActive
                      ? "border-[#C8963E] shadow-sm"
                      : "border-[#F0EDE8] hover:border-[#E2DDD5] hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={cn("text-[15px] font-semibold mb-0.5", isActive ? "text-[#C8963E]" : "text-[#0A1628]")}>{c.title}</h3>
                      <span className="text-[11px] text-[#8A8178]">{c.category}</span>
                    </div>
                    <span className={cn("text-[11px] font-medium uppercase tracking-[0.05em]", outlook.color)}>
                      {outlook.text}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#8A8178] line-clamp-2 mb-3">{c.description}</p>
                  <div className="grid grid-cols-3 gap-2 border-t border-[#F0EDE8] pt-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium mb-0.5">Avg Salary</div>
                      <div className="text-[14px] font-semibold text-[#0A1628] tabular-nums">{formatCurrency(c.avgSalary, true)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium mb-0.5">10yr Growth</div>
                      <div className="text-[14px] font-semibold text-[#3D8B6E] tabular-nums">+{c.jobGrowth10yr}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium mb-0.5">Openings/yr</div>
                      <div className="text-[14px] font-semibold text-[#0A1628] tabular-nums">{formatNumber(c.annualOpenings)}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          {selectedCareer && (
            <div className="lg:col-span-2">
              <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-6 sticky top-20">
                <h2 className="font-serif text-[26px] text-[#0A1628] mb-1">{selectedCareer.title}</h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[12px] text-[#8A8178]">{selectedCareer.category}</span>
                  <span className={cn("text-[11px] font-medium uppercase tracking-[0.05em]", OUTLOOK_STYLE[selectedCareer.outlook]?.color ?? "text-[#8A8178]")}>
                    {selectedCareer.outlook} Outlook
                  </span>
                </div>
                <p className="text-[14px] text-[#6B6359] leading-relaxed mb-6">{selectedCareer.description}</p>

                {/* Salary levels */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Entry Level", value: selectedCareer.entryLevelSalary },
                    { label: "Average",     value: selectedCareer.avgSalary },
                    { label: "Senior",      value: selectedCareer.seniorSalary },
                  ].map((s) => (
                    <div key={s.label} className="bg-white border border-[#F0EDE8] rounded-lg p-3 text-center">
                      <div className="text-[10px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium mb-1">{s.label}</div>
                      <div className="text-[18px] font-semibold text-[#0A1628] tabular-nums">{formatCurrency(s.value, true)}</div>
                    </div>
                  ))}
                </div>

                {/* Day in the life */}
                <div className="mb-5">
                  <h3 className="text-[14px] font-semibold text-[#0A1628] mb-2">A Day in the Life</h3>
                  <ul className="space-y-1.5">
                    {selectedCareer.dayInLife.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-[#6B6359]">
                        <span className="text-[#3D8B6E] mt-0.5 flex-shrink-0">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills + employers */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#0A1628] mb-2">Key Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCareer.skills.map((s) => (
                        <span key={s} className="text-[11px] bg-[rgba(74,127,181,0.06)] border-l-2 border-[#4A7FB5] text-[#4A7FB5] px-2 py-0.5 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-[#0A1628] mb-2">Top Employers</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCareer.topEmployers.slice(0, 4).map((e) => (
                        <span key={e} className="text-[11px] bg-[rgba(61,139,110,0.06)] border-l-2 border-[#3D8B6E] text-[#3D8B6E] px-2 py-0.5 font-medium">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Related majors */}
                <div>
                  <h3 className="text-[13px] font-semibold text-[#0A1628] mb-2">Related Majors</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCareer.relatedMajors.map((m) => (
                      <Link
                        key={m}
                        href={`/majors?search=${encodeURIComponent(m)}`}
                        className="text-[12px] text-[#8A8178] hover:text-[#0A1628] transition-colors duration-150"
                      >
                        {m} →
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
