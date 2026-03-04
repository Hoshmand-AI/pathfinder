"use client";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { universities } from "@/lib/data/universities";
import { majors } from "@/lib/data/majors";
import { formatCurrency, formatPercent, calculateROI, cn } from "@/lib/utils";
import Link from "next/link";
import {
  Users, DollarSign, TrendingUp, GraduationCap, PieChart,
  AlertCircle, CheckCircle2, ChevronRight, Info, Calendar,
  University, BookOpen, Scale
} from "lucide-react";

export default function ParentDashboardPage() {
  const { profile } = useAppStore();
  const [activeSection, setActiveSection] = useState<"overview" | "financial" | "schools" | "timeline">("overview");

  const savedUnis = universities.filter((u) => profile.savedUniversities.includes(u.id));
  const apps = profile.applications;
  const submittedApps = apps.filter((a) => a.status === "Submitted" || a.status === "Decision Received");
  const acceptances = apps.filter((a) => a.decision === "Accepted");

  const lowestCostUni = savedUnis.length > 0
    ? savedUnis.reduce((a, b) => a.avgNetPrice < b.avgNetPrice ? a : b)
    : null;

  const avgNetPrice = savedUnis.length > 0
    ? savedUnis.reduce((sum, u) => sum + u.avgNetPrice, 0) / savedUnis.length
    : 0;

  const applicationTimeline = [
    { month: "August–October", tasks: ["Finalize college list", "Start Common App", "Request recommendation letters", "Begin supplemental essays"] },
    { month: "October–November", tasks: ["Submit Early Decision/Early Action applications", "Check FAFSA opens October 1", "Submit FAFSA as early as possible"] },
    { month: "November–December", tasks: ["Track Early Decision results", "Continue regular decision essays", "Verify transcripts sent"] },
    { month: "January", tasks: ["Submit Regular Decision applications", "File CSS Profile if required", "Review financial aid offers"] },
    { month: "March–April", tasks: ["Receive admission decisions", "Compare financial aid packages", "Visit accepted schools"] },
    { month: "May 1", tasks: ["National Decision Day — commit to your school", "Decline other offers", "Pay enrollment deposit"] },
  ];

  const navItems = [
    { key: "overview", label: "Overview", icon: PieChart },
    { key: "financial", label: "Financial Planning", icon: DollarSign },
    { key: "schools", label: "School Analysis", icon: University },
    { key: "timeline", label: "Application Timeline", icon: Calendar },
  ] as const;

  return (
    <main className="lg:pl-[260px] min-h-screen bg-slate-50">
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-700 px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-black text-white">Parent Dashboard</h1>
            </div>
            <p className="text-blue-200">
              Financial planning, school analysis, and timeline overview for{" "}
              {profile.firstName ? `${profile.firstName}'s` : "your student's"} college journey.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Sub-nav */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all",
                    activeSection === item.key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Overview */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Schools on List", value: savedUnis.length, icon: University, color: "bg-blue-50 text-blue-600" },
                  { label: "Applications", value: apps.length, icon: GraduationCap, color: "bg-violet-50 text-violet-600" },
                  { label: "Submitted", value: submittedApps.length, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
                  { label: "Acceptances", value: acceptances.length, icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-3xl font-black text-gray-900 mb-0.5">{s.value}</p>
                      <p className="text-sm text-gray-500">{s.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Student profile summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Student Profile Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Grade", value: profile.grade || "Not set" },
                    { label: "GPA", value: profile.gpa ? `${profile.gpa}/4.0` : "Not set" },
                    { label: "SAT Score", value: profile.satScore ? profile.satScore.toString() : "Not set" },
                    { label: "Annual Budget", value: profile.budgetTier || "Not set" },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className="font-bold text-gray-800">{s.value}</p>
                    </div>
                  ))}
                </div>
                {!profile.firstName && (
                  <div className="mt-4 flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Student profile not set up</p>
                      <p className="text-xs text-amber-600 mt-1">Have your student complete the onboarding for personalized recommendations.</p>
                      <Link href="/onboarding" className="text-xs text-amber-700 font-semibold mt-2 inline-block">
                        Complete Setup →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Compare Schools", desc: "Side-by-side cost & outcome analysis", href: "/compare", icon: Scale, color: "from-blue-500 to-blue-600" },
                  { title: "Cost Calculator", desc: "See the real 4-year financial picture", href: "/calculator", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
                  { title: "Track Applications", desc: "Monitor deadlines and progress", href: "/applications", icon: GraduationCap, color: "from-violet-500 to-violet-600" },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link key={a.title} href={a.href}>
                      <div className={cn("bg-gradient-to-br rounded-2xl p-5 text-white cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200", a.color)}>
                        <Icon className="w-7 h-7 mb-3 opacity-90" />
                        <p className="font-bold text-lg mb-1">{a.title}</p>
                        <p className="text-white/80 text-sm">{a.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Financial Planning */}
          {activeSection === "financial" && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm mb-1">Key Financial Insight for Parents</p>
                  <p className="text-amber-700 text-sm">
                    The <strong>sticker price</strong> is not the real price. The <strong>net price</strong> (after grants and scholarships)
                    is what matters. Many expensive private universities end up costing LESS than public schools once aid is factored in.
                    Always compare net prices, not sticker prices.
                  </p>
                </div>
              </div>

              {/* Saved school costs */}
              {savedUnis.length > 0 ? (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Financial Comparison: Saved Schools</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 pr-4">School</th>
                          <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-3">Sticker Price</th>
                          <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-3">Net Price (Avg)</th>
                          <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-3">4-Year Est.</th>
                          <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-3">Grad Salary</th>
                          <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3 px-3">ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedUnis.map((u) => {
                          const sticker = u.tuitionOutState + u.roomBoard + u.booksSupplies + u.personalExpenses;
                          const roi = calculateROI(u.avgNetPrice * 4, u.avgSalaryAfter10Yrs);
                          const isBestValue = u.id === lowestCostUni?.id;
                          return (
                            <tr key={u.id} className={cn("border-b border-gray-50", isBestValue && "bg-green-50")}>
                              <td className="py-4 pr-4">
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                    {u.shortName}
                                    {isBestValue && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Best Value</span>}
                                  </p>
                                  <p className="text-xs text-gray-500">{u.type}</p>
                                </div>
                              </td>
                              <td className="py-4 px-3 text-center">
                                <span className="text-sm font-medium text-gray-600">{formatCurrency(sticker, true)}</span>
                              </td>
                              <td className="py-4 px-3 text-center">
                                <span className="text-sm font-bold text-emerald-600">{formatCurrency(u.avgNetPrice, true)}</span>
                              </td>
                              <td className="py-4 px-3 text-center">
                                <span className="text-sm font-medium text-gray-800">{formatCurrency(u.avgNetPrice * 4)}</span>
                              </td>
                              <td className="py-4 px-3 text-center">
                                <span className="text-sm font-medium text-blue-600">{formatCurrency(u.avgSalaryAfter6Yrs, true)}</span>
                              </td>
                              <td className="py-4 px-3 text-center">
                                <span className={cn("text-sm font-bold", roi > 200 ? "text-emerald-600" : "text-yellow-600")}>
                                  +{roi.toFixed(0)}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
                  <p className="text-gray-400 mb-4">No schools saved yet</p>
                  <Link href="/universities" className="text-blue-600 font-semibold text-sm hover:text-blue-700">
                    Browse Universities →
                  </Link>
                </div>
              )}

              {/* Financial Aid Guide */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Financial Aid Essentials for Parents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "FAFSA",
                      sub: "Free Application for Federal Student Aid",
                      desc: "Opens October 1 each year. File as early as possible. Determines eligibility for all federal aid, and most state/institutional aid.",
                      action: "File at studentaid.gov",
                      color: "border-blue-200 bg-blue-50",
                    },
                    {
                      title: "CSS Profile",
                      sub: "College Scholarship Service Profile",
                      desc: "Required by ~400 private colleges for institutional aid. More detailed than FAFSA. Due by school's priority deadline.",
                      action: "Apply at cssprofile.org",
                      color: "border-violet-200 bg-violet-50",
                    },
                    {
                      title: "Merit Scholarships",
                      sub: "Based on academics, not need",
                      desc: "Many schools offer automatic merit scholarships for strong GPAs/test scores. Research each school's merit aid thresholds.",
                      action: "Research school-specific aid",
                      color: "border-emerald-200 bg-emerald-50",
                    },
                    {
                      title: "529 Plans",
                      sub: "Tax-advantaged college savings",
                      desc: "Contributions grow tax-free. Withdrawals for qualified education expenses are tax-free. Start early — even small amounts compound significantly.",
                      action: "Open at your state's plan",
                      color: "border-orange-200 bg-orange-50",
                    },
                  ].map((item) => (
                    <div key={item.title} className={cn("rounded-2xl p-5 border", item.color)}>
                      <h3 className="font-bold text-gray-900 mb-0.5">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.sub}</p>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">{item.desc}</p>
                      <p className="text-xs font-semibold text-gray-600">→ {item.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loan warning */}
              <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  The Student Loan Reality Check
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Average US Student Debt at Graduation", value: "$37,000" },
                    { label: "Monthly Payment (10yr, ~6.5%)", value: "$418/month" },
                    { label: "Max Recommended Debt", value: "= 1× Starting Salary" },
                  ].map((s) => (
                    <div key={s.label} className="bg-orange-50 rounded-xl p-4">
                      <p className="text-xl font-black text-orange-700 mb-1">{s.value}</p>
                      <p className="text-xs text-orange-600">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                  <strong>The Rule of Thumb:</strong> Total student loan debt should not exceed the student&apos;s expected first-year salary.
                  Use our <Link href="/calculator" className="text-blue-600 font-semibold">Cost Calculator</Link> to model different scenarios.
                </p>
              </div>
            </div>
          )}

          {/* School Analysis */}
          {activeSection === "schools" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Saved Schools Analysis</h2>
                {savedUnis.length > 0 ? (
                  <div className="space-y-4">
                    {savedUnis.map((u) => (
                      <Link key={u.id} href={`/universities/${u.id}`}>
                        <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                          <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ background: u.colors[0] || '#2563eb' }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{u.name}</p>
                              {u.ranking > 0 && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">#{u.ranking}</span>}
                            </div>
                            <p className="text-xs text-gray-500">{u.city}, {u.state} · {u.type} · Acceptance: {formatPercent(u.acceptanceRate)}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-emerald-600">{formatCurrency(u.avgNetPrice, true)}/yr</p>
                            <p className="text-xs text-gray-400">Net Price</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-3">No schools saved yet</p>
                    <Link href="/universities" className="text-blue-600 font-semibold text-sm">Browse Universities →</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          {activeSection === "timeline" && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  This timeline assumes applying for the upcoming fall semester. Dates may vary by school and application type.
                  Always check individual school deadlines.
                </p>
              </div>
              <div className="space-y-4">
                {applicationTimeline.map((period, i) => (
                  <div key={period.month} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-5">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">
                        {i + 1}
                      </div>
                      {i < applicationTimeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-200 to-transparent min-h-[20px]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-3">{period.month}</h3>
                      <ul className="space-y-2">
                        {period.tasks.map((task) => (
                          <li key={task} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
