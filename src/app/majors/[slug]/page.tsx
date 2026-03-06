"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMajorBySlug } from "@/lib/data/majors";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatNumber, formatGrowth, getGrowthColor, CATEGORY_COLORS, cn } from "@/lib/utils";
import {
  ArrowLeft, Bookmark, TrendingUp, DollarSign, Users, Award,
  ChevronRight, CheckCircle2, Clock, GraduationCap, BarChart3, Briefcase
} from "lucide-react";

export default function MajorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const major = getMajorBySlug(slug);
  const { profile, toggleSavedMajor } = useAppStore();

  if (!major) return notFound();

  const saved = profile.savedMajors.includes(major.id);

  const salaryData = [
    { stage: "Entry Level", salary: major.avgSalaryEntry, color: "bg-blue-400", width: (major.avgSalaryEntry / major.avgSalarySenior) * 100 },
    { stage: "Mid Career", salary: major.avgSalaryMid, color: "bg-blue-500", width: (major.avgSalaryMid / major.avgSalarySenior) * 100 },
    { stage: "Senior Level", salary: major.avgSalarySenior, color: "bg-blue-600", width: 100 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-14">
      <div>
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-700 to-violet-700 px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <Link href="/majors" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Majors
            </Link>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{major.icon}</span>
                  <div>
                    <h1 className="text-4xl font-black text-white mb-1">{major.name}</h1>
                    <span className={cn("text-sm font-medium px-3 py-1 rounded-full bg-white/20 text-white")}>
                      {major.category}
                    </span>
                  </div>
                </div>
                <p className="text-blue-200 max-w-2xl leading-relaxed">{major.description}</p>
              </div>
              <button
                onClick={() => toggleSavedMajor(major.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all flex-shrink-0",
                  saved
                    ? "bg-white text-blue-700"
                    : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                )}
              >
                <Bookmark className={cn("w-5 h-5", saved && "fill-blue-700")} />
                {saved ? "Saved!" : "Save Major"}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: DollarSign, label: "Mid-Career Salary", value: formatCurrency(major.avgSalaryMid), sub: "Average", color: "text-emerald-600 bg-emerald-50" },
              { icon: TrendingUp, label: "Job Growth (10yr)", value: formatGrowth(major.jobGrowth), sub: "BLS Projection", color: `${getGrowthColor(major.jobGrowth)} bg-green-50` },
              { icon: Users, label: "Annual Openings", value: formatNumber(major.annualJobOpenings), sub: "New jobs/year", color: "text-blue-600 bg-blue-50" },
              { icon: Clock, label: "Typical Duration", value: major.typicalDuration, sub: "Full-time study", color: "text-violet-600 bg-violet-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xl font-black text-gray-900 mb-0.5">{s.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Major</h2>
                <p className="text-gray-600 leading-relaxed">{major.longDescription}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {major.degreeTypes.map((d) => (
                    <span key={d} className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Salary Progression */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Salary Progression</h2>
                <div className="space-y-4">
                  {salaryData.map((s) => (
                    <div key={s.stage}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{s.stage}</span>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(s.salary)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className={cn("h-3 rounded-full transition-all", s.color)}
                          style={{ width: `${s.width}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">* Based on Bureau of Labor Statistics national averages</p>
              </div>

              {/* Top Careers */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">Where This Major Leads</h2>
                  <Link href="/careers" className="text-blue-600 text-sm font-medium flex items-center gap-1">
                    Career Explorer <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {major.topCareers.map((c) => (
                    <div key={c.title} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800">{c.title}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-sm font-bold text-emerald-600">{formatCurrency(c.avgSalary, true)}/yr</span>
                        <span className={cn("text-xs font-semibold", getGrowthColor(c.growth))}>
                          {formatGrowth(c.growth)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Courses You Will Take</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {major.courseHighlights.map((c) => (
                    <div key={c} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              {/* Skills */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Required Skills</h3>
                <div className="space-y-2">
                  {major.requiredSkills.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {major.certifications && major.certifications.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" /> Key Certifications
                  </h3>
                  <div className="space-y-2">
                    {major.certifications.map((c) => (
                      <div key={c} className="bg-amber-50 text-amber-700 rounded-lg px-3 py-2 text-sm font-medium">
                        🏆 {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Majors */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Related Majors</h3>
                <div className="space-y-2">
                  {major.relatedMajors.map((r) => (
                    <div key={r} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
                      <span className="text-sm text-gray-700">{r}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className={cn("rounded-2xl p-5 border",
                major.difficulty === "High" ? "bg-red-50 border-red-100" :
                major.difficulty === "Medium" ? "bg-yellow-50 border-yellow-100" :
                "bg-green-50 border-green-100"
              )}>
                <h3 className="font-bold text-gray-900 mb-2">Difficulty Level</h3>
                <p className={cn("text-2xl font-black mb-1",
                  major.difficulty === "High" ? "text-red-600" :
                  major.difficulty === "Medium" ? "text-yellow-600" : "text-green-600"
                )}>
                  {major.difficulty}
                </p>
                <p className="text-xs text-gray-500">
                  {major.difficulty === "High" ? "Expect rigorous coursework, especially in math and sciences." :
                   major.difficulty === "Medium" ? "Moderate workload with a mix of theory and application." :
                   "Generally accessible with dedication and effort."}
                </p>
              </div>

              {/* CTA */}
              <Link href="/universities" className="block bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 text-white hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25">
                <GraduationCap className="w-6 h-6 mb-3" />
                <p className="font-bold mb-1">Find Universities for {major.name}</p>
                <p className="text-blue-200 text-sm">See top schools offering this major with rankings, costs, and admission data.</p>
                <div className="flex items-center gap-1 mt-3 text-sm font-semibold">
                  Search Universities <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
