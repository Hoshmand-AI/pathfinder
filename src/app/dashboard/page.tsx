"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getPopularMajors } from "@/lib/data/majors";
import { getTopRankedUniversities } from "@/lib/data/universities";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { profile, onboardingComplete } = useAppStore();

  const topMajors = getPopularMajors().slice(0, 3);
  const topUnivs = getTopRankedUniversities(3);
  const appCount = profile.applications.length;
  const submittedCount = profile.applications.filter(
    (a) => a.status === "Submitted" || a.status === "Decision Received"
  ).length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    { label: "Explore Majors",     desc: "Browse all majors with salary data",    href: "/majors" },
    { label: "Find Universities",  desc: "Filter and discover top schools",        href: "/universities" },
    { label: "Cost Calculator",    desc: "Calculate true college costs",           href: "/calculator" },
    { label: "AI Advisor",         desc: "Get personalized guidance",              href: "/chat" },
    { label: "Application Tracker", desc: "Track deadlines and tasks",             href: "/applications" },
  ];

  return (
    <main className="min-h-screen bg-[#FDFCFA] pt-14">
      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Welcome banner */}
        <div className="bg-[#0F2140] rounded-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-[22px] text-white font-normal mb-1">
              {greeting()}{profile.firstName ? `, ${profile.firstName}` : ""}.
            </h2>
            <p className="text-[13.5px] text-white/45">
              {onboardingComplete && profile.interests.length > 0
                ? <>Based on your interests in{" "}
                    <span className="text-[#D4A94F]">{profile.interests.slice(0, 2).join(" & ")}</span>
                    {", here are your recommendations."}
                  </>
                : "Complete your profile to get personalized recommendations."
              }
            </p>
          </div>
          <Link
            href="/chat"
            className="flex-shrink-0 bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[13px] font-semibold px-5 py-2 rounded-md transition-colors duration-150"
          >
            Chat with Advisor →
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Saved Majors",  value: profile.savedMajors.length,      href: "/majors" },
            { label: "Saved Schools", value: profile.savedUniversities.length, href: "/universities" },
            { label: "Applications",  value: appCount,                         href: "/applications" },
            { label: "Submitted",     value: submittedCount,                   href: "/applications" },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg px-5 py-4 hover:border-[#E2DDD5] hover:shadow-sm transition-all duration-200"
            >
              <div className="text-[28px] font-bold text-[#0A1628] tabular-nums">{s.value}</div>
              <div className="text-[11px] uppercase tracking-[0.06em] text-[#B8B0A4] font-medium mt-0.5">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Two-column section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Majors */}
          <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#0A1628]">Top Majors for You</h3>
              <Link href="/majors" className="text-[12px] text-[#B8B0A4] hover:text-[#8A8178] transition-colors duration-150">View All →</Link>
            </div>
            <div className="divide-y divide-[#F0EDE8]">
              {topMajors.map((major, i) => (
                <Link key={major.id} href={`/majors/${major.id}`} className="flex items-center gap-3 py-3 group">
                  <span className="text-[12px] font-bold text-[#C8963E] min-w-[24px]">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-[#0A1628] truncate group-hover:text-[#C8963E] transition-colors duration-150">{major.name}</div>
                    <div className="text-[12px] text-[#B8B0A4]">{major.category} · High demand</div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#3D8B6E] tabular-nums flex-shrink-0">
                    {formatCurrency(major.avgSalaryMid, true)} mid
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Schools */}
          <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#0A1628]">Top Schools for You</h3>
              <Link href="/universities" className="text-[12px] text-[#B8B0A4] hover:text-[#8A8178] transition-colors duration-150">View All →</Link>
            </div>
            <div className="divide-y divide-[#F0EDE8]">
              {topUnivs.map((uni, i) => (
                <Link key={uni.id} href={`/universities/${uni.id}`} className="flex items-center gap-3 py-3 group">
                  <span className="text-[12px] font-bold text-[#C8963E] min-w-[24px]">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-[#0A1628] truncate group-hover:text-[#C8963E] transition-colors duration-150">{uni.name}</div>
                    <div className="text-[12px] text-[#B8B0A4]">{uni.city}, {uni.state} · {(uni.acceptanceRate * 100).toFixed(0)}% acceptance</div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#3D8B6E] tabular-nums flex-shrink-0">
                    {formatCurrency(uni.avgSalaryAfter6Yrs, true)} avg
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-5">
          <h3 className="text-[14px] font-semibold text-[#0A1628] mb-3">Quick Actions</h3>
          <div className="divide-y divide-[#F0EDE8]">
            {quickActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center py-3 text-[13.5px] font-medium text-[#6B6359] hover:text-[#0A1628] transition-colors duration-150 group"
              >
                <span className="flex-1">{a.label} — <span className="text-[#B8B0A4] font-normal">{a.desc}</span></span>
                <span className="text-[#B8B0A4] group-hover:text-[#8A8178] transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>

        {!onboardingComplete && (
          <div className="mt-4 text-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[13px] font-semibold px-5 py-2 rounded-md transition-colors duration-150"
            >
              Complete Your Profile →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
