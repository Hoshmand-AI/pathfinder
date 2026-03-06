"use client";
import { useState } from "react";
import Link from "next/link";
import { formatPercent, formatCurrency, cn } from "@/lib/utils";
import { universities, getTopRankedUniversities } from "@/lib/data/universities";
import { majors, getTrendingMajors } from "@/lib/data/majors";
import type { CounselorStudent } from "@/lib/types";
import {
  UserCheck, Users, TrendingUp, AlertCircle, CheckCircle2,
  ChevronRight, BarChart3, BookOpen, University, DollarSign,
  Search, Download, PlusCircle, GraduationCap, Target
} from "lucide-react";

// Mock student roster for demo
const MOCK_STUDENTS: CounselorStudent[] = [
  { id: "1", name: "Maya Johnson", grade: "12th", gpa: 3.8, status: "On Track", topChoices: ["MIT", "Stanford", "UC Berkeley"], applicationsCount: 8, lastActivity: "2 hours ago" },
  { id: "2", name: "Carlos Reyes", grade: "12th", gpa: 3.2, status: "Needs Attention", topChoices: ["UT Austin", "Texas A&M", "ASU"], applicationsCount: 3, lastActivity: "3 days ago" },
  { id: "3", name: "Aisha Patel", grade: "11th", gpa: 3.9, status: "On Track", topChoices: ["Harvard", "Yale", "Princeton"], applicationsCount: 0, lastActivity: "1 day ago" },
  { id: "4", name: "James Wilson", grade: "12th", gpa: 2.8, status: "At Risk", topChoices: ["Ohio State", "Penn State"], applicationsCount: 2, lastActivity: "1 week ago" },
  { id: "5", name: "Sofia Martinez", grade: "12th", gpa: 3.5, status: "On Track", topChoices: ["NYU", "Boston University", "Northeastern"], applicationsCount: 6, lastActivity: "Yesterday" },
  { id: "6", name: "Derek Chen", grade: "11th", gpa: 4.0, status: "On Track", topChoices: ["Caltech", "MIT", "CMU"], applicationsCount: 0, lastActivity: "5 hours ago" },
  { id: "7", name: "Priya Sharma", grade: "12th", gpa: 3.6, status: "Needs Attention", topChoices: ["UNC", "Virginia", "Georgia Tech"], applicationsCount: 4, lastActivity: "4 days ago" },
  { id: "8", name: "Michael Brown", grade: "12th", gpa: 3.1, status: "At Risk", topChoices: ["Community College", "Arizona State"], applicationsCount: 1, lastActivity: "2 weeks ago" },
];

const statusColors: Record<CounselorStudent["status"], string> = {
  "On Track": "bg-green-100 text-green-700",
  "Needs Attention": "bg-yellow-100 text-yellow-700",
  "At Risk": "bg-red-100 text-red-700",
};

export default function CounselorPortalPage() {
  const [activeTab, setActiveTab] = useState<"roster" | "insights" | "resources" | "reports">("roster");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CounselorStudent["status"] | "All">("All");

  const topUnivs = getTopRankedUniversities(6);
  const trendingMajors = getTrendingMajors().slice(0, 6);

  const filteredStudents = MOCK_STUDENTS.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const onTrackCount = MOCK_STUDENTS.filter((s) => s.status === "On Track").length;
  const needsAttentionCount = MOCK_STUDENTS.filter((s) => s.status === "Needs Attention").length;
  const atRiskCount = MOCK_STUDENTS.filter((s) => s.status === "At Risk").length;

  const tabs = [
    { key: "roster", label: "Student Roster", icon: Users },
    { key: "insights", label: "Insights", icon: BarChart3 },
    { key: "resources", label: "Resources", icon: BookOpen },
    { key: "reports", label: "Reports", icon: Download },
  ] as const;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <UserCheck className="w-8 h-8 text-white" />
                  <h1 className="text-3xl font-black text-white">Counselor Portal</h1>
                </div>
                <p className="text-indigo-200">Monitor students, track applications, and share resources.</p>
              </div>
              <button className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg">
                <PlusCircle className="w-4 h-4" /> Add Student
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Students", value: MOCK_STUDENTS.length, icon: Users, color: "bg-indigo-50 text-indigo-600" },
              { label: "On Track", value: onTrackCount, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
              { label: "Needs Attention", value: needsAttentionCount, icon: AlertCircle, color: "bg-yellow-50 text-yellow-600" },
              { label: "At Risk", value: atRiskCount, icon: AlertCircle, color: "bg-red-50 text-red-600" },
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

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all",
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
                  )}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Roster */}
          {activeTab === "roster" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div className="flex gap-2">
                  {(["All", "On Track", "Needs Attention", "At Risk"] as const).map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={cn("px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex-shrink-0",
                        statusFilter === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"
                      )}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Student</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Grade / GPA</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Top Choices</th>
                      <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Apps</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Last Active</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {student.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">{student.grade}</p>
                            <p className="text-xs text-gray-500">GPA: {student.gpa.toFixed(1)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", statusColors[student.status])}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {student.topChoices.slice(0, 2).map((school) => (
                              <span key={school} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{school}</span>
                            ))}
                            {student.topChoices.length > 2 && (
                              <span className="text-xs text-gray-400">+{student.topChoices.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-sm font-bold text-gray-700">{student.applicationsCount}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-gray-500">{student.lastActivity}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors">
                            View <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-10 text-gray-400">No students match your search</div>
              )}
            </div>
          )}

          {/* Insights */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Most popular schools */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <University className="w-5 h-5 text-indigo-500" /> Most-Saved Universities
                  </h3>
                  <div className="space-y-3">
                    {topUnivs.map((u, i) => (
                      <div key={u.id} className="flex items-center gap-3">
                        <span className="text-sm font-black text-gray-400 w-5">{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                            <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${100 - i * 12}%` }} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{formatPercent(u.acceptanceRate)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending majors */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Trending Majors
                  </h3>
                  <div className="space-y-3">
                    {trendingMajors.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                        <span className="text-xl">{m.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                          <p className="text-xs text-gray-500">{m.category}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">+{m.jobGrowth}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Class breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-5">Class Application Status Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "On Track", count: onTrackCount, total: MOCK_STUDENTS.length, color: "bg-green-500" },
                    { label: "Needs Attention", count: needsAttentionCount, total: MOCK_STUDENTS.length, color: "bg-yellow-500" },
                    { label: "At Risk", count: atRiskCount, total: MOCK_STUDENTS.length, color: "bg-red-500" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                        <div className={cn("h-3 rounded-full transition-all", s.color)} style={{ width: `${(s.count / s.total) * 100}%` }} />
                      </div>
                      <p className="text-2xl font-black text-gray-900">{s.count}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resources */}
          {activeTab === "resources" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[
                {
                  icon: BookOpen,
                  title: "Major Explorer",
                  desc: "Share with students who are undecided — 20 majors with salary data, career paths, and required skills.",
                  href: "/majors",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: University,
                  title: "University Finder",
                  desc: "Filter 4,000+ schools by major, cost, acceptance rate, and location.",
                  href: "/universities",
                  color: "from-violet-500 to-violet-600",
                },
                {
                  icon: DollarSign,
                  title: "Cost Calculator",
                  desc: "Help families understand net price, financial aid, and 4-year total cost.",
                  href: "/calculator",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  icon: Target,
                  title: "Comparison Tool",
                  desc: "Side-by-side comparison of up to 4 schools for counselor sessions.",
                  href: "/compare",
                  color: "from-orange-500 to-orange-600",
                },
                {
                  icon: TrendingUp,
                  title: "Career Explorer",
                  desc: "Show students exactly what careers their major leads to, with real salary data.",
                  href: "/careers",
                  color: "from-teal-500 to-teal-600",
                },
                {
                  icon: GraduationCap,
                  title: "AI Advisor",
                  desc: "AI-powered 24/7 guidance — refer students for questions outside office hours.",
                  href: "/chat",
                  color: "from-pink-500 to-pink-600",
                },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <Link key={r.title} href={r.href}>
                    <div className={cn("bg-gradient-to-br rounded-2xl p-5 text-white cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200", r.color)}>
                      <Icon className="w-8 h-8 mb-3 opacity-90" />
                      <p className="font-bold text-lg mb-2">{r.title}</p>
                      <p className="text-white/80 text-sm leading-relaxed">{r.desc}</p>
                      <div className="flex items-center gap-1 mt-3 text-sm font-semibold opacity-90">
                        Open Tool <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Reports */}
          {activeTab === "reports" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Reports & Exports</h2>
                <p className="text-gray-500 text-sm mb-6">Download reports for admin, parents, and district records.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Student Application Status Report", desc: "All students with application status, deadlines, and completion rates", format: "CSV" },
                    { title: "College List Summary", desc: "All saved schools with acceptance rates, costs, and student fit scores", format: "PDF" },
                    { title: "At-Risk Student Alert List", desc: "Students flagged as needing immediate attention with recommended actions", format: "PDF" },
                    { title: "Class Destination Report", desc: "Aggregate data on where the class plans to apply and their top majors", format: "PDF" },
                  ].map((r) => (
                    <div key={r.title} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm mb-1">{r.title}</p>
                        <p className="text-xs text-gray-500 mb-2">{r.desc}</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{r.format}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-6 text-center">
                  Report generation available in the full premium version.
                </p>
              </div>
            </div>
          )}
        </div>
    </main>
  );
}
