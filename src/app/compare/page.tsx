"use client";
import Link from "next/link";
import { useState } from "react";
import { universities } from "@/lib/data/universities";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent, formatNumber, calculateROI, cn } from "@/lib/utils";
import { Scale, X, Plus, CheckCircle2, XCircle, University } from "lucide-react";

const metrics = [
  { key: "ranking", label: "National Ranking", format: (v: number) => v > 0 ? `#${v}` : "Unranked", good: "lower" },
  { key: "acceptanceRate", label: "Acceptance Rate", format: (v: number) => formatPercent(v), good: "neutral" },
  { key: "tuitionInState", label: "In-State Tuition", format: (v: number) => formatCurrency(v), good: "lower" },
  { key: "tuitionOutState", label: "Out-of-State Tuition", format: (v: number) => formatCurrency(v), good: "lower" },
  { key: "roomBoard", label: "Room & Board", format: (v: number) => formatCurrency(v), good: "lower" },
  { key: "avgNetPrice", label: "Avg Net Price (w/ Aid)", format: (v: number) => formatCurrency(v), good: "lower" },
  { key: "enrollment", label: "Total Enrollment", format: (v: number) => formatNumber(v), good: "neutral" },
  { key: "studentFacultyRatio", label: "Student/Faculty Ratio", format: (v: number) => `${v}:1`, good: "lower" },
  { key: "graduationRate", label: "Graduation Rate", format: (v: number) => formatPercent(v), good: "higher" },
  { key: "avgSalaryAfter6Yrs", label: "Salary at 6 Years", format: (v: number) => formatCurrency(v), good: "higher" },
  { key: "avgSalaryAfter10Yrs", label: "Salary at 10 Years", format: (v: number) => formatCurrency(v), good: "higher" },
] as const;

export default function ComparePage() {
  const { profile, toggleCompare, clearCompare } = useAppStore();
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const comparedUniversities = universities.filter((u) => profile.compareList.includes(u.id));
  const availableToAdd = universities.filter((u) => !profile.compareList.includes(u.id));
  const [addSearch, setAddSearch] = useState("");

  const filtered = availableToAdd.filter((u) =>
    u.name.toLowerCase().includes(addSearch.toLowerCase()) ||
    u.state.toLowerCase().includes(addSearch.toLowerCase())
  ).slice(0, 6);

  const getBest = (key: string, good: string) => {
    if (good === "neutral" || comparedUniversities.length < 2) return null;
    const vals = comparedUniversities.map((u) => u[key as keyof typeof u] as number);
    if (good === "lower") return Math.min(...vals);
    return Math.max(...vals);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-14">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Scale className="w-5 h-5 text-gray-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Compare Universities</h1>
                </div>
                <p className="text-gray-500 text-sm">Side-by-side comparison of up to 4 universities</p>
              </div>
              {comparedUniversities.length > 0 && (
                <button onClick={clearCompare} className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors">
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {comparedUniversities.length === 0 ? (
            <div className="text-center py-20">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No schools to compare yet</h3>
              <p className="text-gray-400 mb-6">Go to the Universities page and click &quot;Compare&quot; on up to 4 schools</p>
              <Link href="/universities" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors">
                <University className="w-5 h-5" /> Browse Universities
              </Link>
            </div>
          ) : (
            <>
              {/* School headers */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <td className="w-44 pb-4 pr-4">
                        <p className="text-sm font-semibold text-gray-500">Metric</p>
                      </td>
                      {comparedUniversities.map((u) => (
                        <td key={u.id} className="pb-4 px-3 text-center">
                          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm relative">
                            <button
                              onClick={() => toggleCompare(u.id)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                            >
                              <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                            </button>
                            <div className="h-2 rounded-full mb-3" style={{ background: `linear-gradient(90deg, ${u.colors[0] || '#2563eb'}, ${u.colors[1] || '#7c3aed'})` }} />
                            <p className="font-bold text-gray-900 text-sm leading-tight mb-1">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.city}, {u.state}</p>
                            <p className="text-xs text-blue-600 font-medium mt-1">{u.type}</p>
                          </div>
                        </td>
                      ))}
                      {comparedUniversities.length < 4 && (
                        <td className="pb-4 px-3 text-center">
                          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 min-h-[120px] flex flex-col items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-xs text-gray-400">Add a school</p>
                          </div>
                        </td>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric) => {
                      const best = getBest(metric.key, metric.good);
                      return (
                        <tr
                          key={metric.key}
                          onMouseEnter={() => setHoveredMetric(metric.key)}
                          onMouseLeave={() => setHoveredMetric(null)}
                          className={cn("transition-colors", hoveredMetric === metric.key && "bg-blue-50/50")}
                        >
                          <td className="py-3 pr-4">
                            <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                          </td>
                          {comparedUniversities.map((u) => {
                            const val = u[metric.key as keyof typeof u] as number;
                            const isBest = best !== null && val === best;
                            return (
                              <td key={u.id} className="py-3 px-3 text-center">
                                <div className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold",
                                  isBest
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-50 text-gray-700"
                                )}>
                                  {isBest && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  {metric.format(val)}
                                </div>
                              </td>
                            );
                          })}
                          {comparedUniversities.length < 4 && <td />}
                        </tr>
                      );
                    })}

                    {/* ROI row */}
                    <tr className="border-t border-gray-100">
                      <td className="py-3 pr-4">
                        <span className="text-sm font-bold text-gray-700">10-Year ROI</span>
                      </td>
                      {comparedUniversities.map((u) => {
                        const cost = (u.tuitionOutState + u.roomBoard + u.booksSupplies + u.personalExpenses) * 4;
                        const roi = calculateROI(cost, u.avgSalaryAfter10Yrs);
                        return (
                          <td key={u.id} className="py-3 px-3 text-center">
                            <span className={cn("inline-block px-3 py-2 rounded-xl text-sm font-bold",
                              roi > 200 ? "bg-emerald-100 text-emerald-700" :
                              roi > 100 ? "bg-green-100 text-green-700" :
                              "bg-yellow-100 text-yellow-700"
                            )}>
                              {roi.toFixed(0)}%
                            </span>
                          </td>
                        );
                      })}
                      {comparedUniversities.length < 4 && <td />}
                    </tr>

                    {/* Top Majors row */}
                    <tr className="border-t border-gray-100">
                      <td className="py-3 pr-4">
                        <span className="text-sm font-medium text-gray-600">Top Majors</span>
                      </td>
                      {comparedUniversities.map((u) => (
                        <td key={u.id} className="py-3 px-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {u.topMajors.slice(0, 3).map((m) => (
                              <span key={m} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                      {comparedUniversities.length < 4 && <td />}
                    </tr>

                    {/* Actions row */}
                    <tr>
                      <td className="py-4" />
                      {comparedUniversities.map((u) => (
                        <td key={u.id} className="py-4 px-3">
                          <Link
                            href={`/universities/${u.id}`}
                            className="block w-full text-center bg-gradient-to-r from-blue-600 to-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-violet-700 transition-all"
                          >
                            View Full Profile
                          </Link>
                        </td>
                      ))}
                      {comparedUniversities.length < 4 && <td />}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Add more */}
              {comparedUniversities.length < 4 && (
                <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Add a School to Compare</h3>
                  <input
                    type="text"
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.target.value)}
                    placeholder="Search universities..."
                    className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filtered.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => toggleCompare(u.id)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: u.colors[0] || '#2563eb' }} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{u.shortName}</p>
                          <p className="text-xs text-gray-500">{u.state}</p>
                        </div>
                        <Plus className="w-4 h-4 text-blue-500 flex-shrink-0 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </main>
  );
}
