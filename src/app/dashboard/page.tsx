"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { majors, getPopularMajors } from "@/lib/data/majors";
import { universities, getTopRankedUniversities } from "@/lib/data/universities";
import { formatCurrency } from "@/lib/utils";
import {
  BookOpen, Building2, MessageCircle, ClipboardList, TrendingUp,
  ArrowRight, Sparkles, DollarSign, Target, Calculator, ChevronRight,
  GraduationCap, BarChart3, Zap
} from "lucide-react";

export default function DashboardPage() {
  const { profile, onboardingComplete } = useAppStore();

  const topMajors = getPopularMajors().slice(0, 4);
  const topUnivs = getTopRankedUniversities(3);
  const appCount = profile.applications.length;
  const submittedCount = profile.applications.filter((a) => a.status === "Submitted" || a.status === "Decision Received").length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const quickLinks = [
    { label: "Explore Majors", icon: BookOpen, href: "/majors", desc: "500+ fields of study", color: "text-blue-600 bg-blue-50" },
    { label: "Find Universities", icon: Building2, href: "/universities", desc: "4,000+ schools", color: "text-violet-600 bg-violet-50" },
    { label: "Career Explorer", icon: TrendingUp, href: "/careers", desc: "800+ career paths", color: "text-emerald-600 bg-emerald-50" },
    { label: "Cost Calculator", icon: Calculator, href: "/calculator", desc: "Plan your finances", color: "text-orange-600 bg-orange-50" },
    { label: "AI Advisor", icon: MessageCircle, href: "/chat", desc: "Available 24/7", color: "text-pink-600 bg-pink-50" },
    { label: "Applications", icon: ClipboardList, href: "/applications", desc: "Track deadlines", color: "text-teal-600 bg-teal-50" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500 mb-1">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting()}{profile.firstName ? `, ${profile.firstName}` : ""} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {onboardingComplete ? "Your academic dashboard is ready." : "Complete your profile to get personalized recommendations."}
            </p>
          </div>
          {!onboardingComplete && (
            <Link
              href="/onboarding"
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Complete Profile
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Saved Majors", value: profile.savedMajors.length, icon: BookOpen, href: "/majors" },
            { label: "Saved Schools", value: profile.savedUniversities.length, icon: Building2, href: "/universities" },
            { label: "Applications", value: appCount, icon: ClipboardList, href: "/applications" },
            { label: "Submitted", value: submittedCount, icon: Target, href: "/applications" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.label} href={s.href} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm hover:border-gray-200 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </Link>
            );
          })}
        </div>

        {/* AI Banner */}
        {onboardingComplete && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI Recommendations Ready</p>
                <p className="text-gray-400 text-xs mt-0.5">Based on your profile — explore personalized major and school matches</p>
              </div>
            </div>
            <Link href="/chat" className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all flex-shrink-0">
              Ask AI <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tools</h2>
            <div className="space-y-2">
              {quickLinks.map(({ label, icon: Icon, href, desc, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3.5 hover:shadow-sm hover:border-gray-200 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Majors */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Trending Majors</h2>
                <Link href="/majors" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topMajors.map((major) => (
                  <Link key={major.id} href={`/majors/${major.id}`} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-gray-200 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{major.name}</p>
                      {major.isTrending && (
                        <span className="ml-2 text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex-shrink-0">HOT</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">{major.category}</p>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <DollarSign className="w-3 h-3" />{formatCurrency(major.avgSalaryMid)}
                      </span>
                      <span className="text-xs text-gray-400">{major.jobGrowth > 0 ? "+" : ""}{major.jobGrowth}% growth</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Universities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Top Universities</h2>
                <Link href="/universities" className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</Link>
              </div>
              <div className="space-y-2">
                {topUnivs.map((uni) => (
                  <Link key={uni.id} href={`/universities/${uni.id}`} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm hover:border-gray-200 transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-600">
                      #{uni.ranking}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{uni.name}</p>
                      <p className="text-xs text-gray-400">{uni.city}, {uni.state} · {uni.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-gray-700">{(uni.acceptanceRate * 100).toFixed(0)}%</p>
                      <p className="text-[10px] text-gray-400">acceptance</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
