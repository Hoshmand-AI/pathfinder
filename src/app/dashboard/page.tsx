"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { majors, getPopularMajors } from "@/lib/data/majors";
import { universities, getTopRankedUniversities } from "@/lib/data/universities";
import { formatCurrency, formatPercent, formatGrowth, getGrowthColor, cn } from "@/lib/utils";
import {
  BookOpen, University, MessageCircle, ClipboardList, TrendingUp,
  Bookmark, ArrowRight, Sparkles, Star, DollarSign, BarChart3,
  Target, Calculator, ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const { profile, onboardingComplete } = useAppStore();

  const savedMajorObjects = majors.filter((m) => profile.savedMajors.includes(m.id));
  const savedUniObjects = universities.filter((u) => profile.savedUniversities.includes(u.id));
  const topMajors = getPopularMajors().slice(0, 3);
  const topUnivs = getTopRankedUniversities(3);
  const appCount = profile.applications.length;
  const submittedCount = profile.applications.filter((a) => a.status === "Submitted" || a.status === "Decision Received").length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    { label: "Saved Majors", value: profile.savedMajors.length, icon: BookOpen, color: "bg-blue-50 text-blue-600", href: "/majors" },
    { label: "Saved Schools", value: profile.savedUniversities.length, icon: University, color: "bg-violet-50 text-violet-600", href: "/universities" },
    { label: "Applications", value: appCount, icon: ClipboardList, color: "bg-emerald-50 text-emerald-600", href: "/applications" },
    { label: "Submitted", value: submittedCount, icon: Target, color: "bg-orange-50 text-orange-600", href: "/applications" },
  ];

  const quickLinks = [
    { label: "Explore Majors", icon: BookOpen, href: "/majors", desc: "Browse all majors with salary data" },
    { label: "Find Universities", icon: University, href: "/universities", desc: "Filter and discover top schools" },
    { label: "Career Explorer", icon: TrendingUp, href: "/careers", desc: "See where majors lead" },
    { label: "Cost Calculator", icon: Calculator, href: "/calculator", desc: "Calculate true college costs" },
    { label: "AI Advisor", icon: MessageCircle, href: "/chat", desc: "Get personalized guidance" },
    { label: "Track Applications", icon: ClipboardList, href: "/applications", desc: "Manage your college list" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {greeting()}{profile.firstName ? `, ${profile.firstName}` : ""}! 👋
              </h1>
              <p className="text-gray-500 mt-1">
                {onboardingComplete
                  ? "Your personalized academic dashboard is ready."
                  : "Complete your profile to get personalized recommendations."}
              </p>
            </div>
            {!onboardingComplete && (
              <Link
                href="/onboarding"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-violet-700 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Complete Profile
              </Link>
            )}
          </div>

          {/* AI Recommendation Banner */}
          {onboardingComplete && (
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-violet-700 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-full opacity-10">
                <div className="w-full h-full bg-gradient-to-l from-white rounded-full scale-150 translate-x-1/3" />
              </div>
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Your AI Advisor is Ready</h3>
                  <p className="text-blue-200 text-sm">
                    Based on your interests in{" "}
                    <span className="text-white font-medium">
                      {profile.interests.slice(0, 2).join(" & ") || "various fields"}
                    </span>
                    , we have personalized recommendations waiting for you.
                  </p>
                </div>
                <Link href="/chat" className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors flex-shrink-0">
                  Chat Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href={s.href}>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", s.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-black text-gray-900 mb-0.5">{s.value}</p>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {quickLinks.map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link key={l.href} href={l.href}>
                      <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{l.label}</p>
                          <p className="text-xs text-gray-500 truncate">{l.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Trending Majors */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Top Majors</h2>
                <Link href="/majors" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {topMajors.map((m) => (
                  <Link key={m.id} href={`/majors/${m.slug}`}>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                            {m.isTrending && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">Trending</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{m.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs font-semibold text-emerald-600">{formatCurrency(m.avgSalaryMid, true)}/yr mid</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-blue-500" />
                              <span className={cn("text-xs font-semibold", getGrowthColor(m.jobGrowth))}>
                                {formatGrowth(m.jobGrowth)} growth
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Universities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Top Schools</h2>
                <Link href="/universities" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {topUnivs.map((u) => (
                  <Link key={u.id} href={`/universities/${u.id}`}>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.city}, {u.state}</p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0">
                          #{u.ranking}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Acceptance</p>
                          <p className="text-sm font-bold text-gray-800">{formatPercent(u.acceptanceRate)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Avg Salary</p>
                          <p className="text-sm font-bold text-emerald-600">{formatCurrency(u.avgSalaryAfter6Yrs, true)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Saved Items */}
          {(savedMajorObjects.length > 0 || savedUniObjects.length > 0) && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-600" /> Saved Items
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {savedMajorObjects.map((m) => (
                  <Link key={m.id} href={`/majors/${m.slug}`}>
                    <div className="bg-white rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all text-center">
                      <span className="text-2xl mb-2 block">{m.icon}</span>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{m.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{formatCurrency(m.avgSalaryMid, true)}/yr</p>
                    </div>
                  </Link>
                ))}
                {savedUniObjects.map((u) => (
                  <Link key={u.id} href={`/universities/${u.id}`}>
                    <div className="bg-white rounded-xl p-4 border border-violet-100 hover:shadow-md transition-all">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{u.shortName}</p>
                      <p className="text-xs text-gray-500">{u.state}</p>
                      <p className="text-xs text-violet-600 font-medium">#{u.ranking} Ranked</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>
    </main>
  );
}
