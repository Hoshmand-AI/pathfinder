"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUniversityById } from "@/lib/data/universities";
import { useAppStore } from "@/lib/store";
import { formatCurrency, formatPercent, formatNumber, getAcceptanceLabel, admissionChance, calculateROI, cn } from "@/lib/utils";
import {
  ArrowLeft, Bookmark, MapPin, Users, GraduationCap, DollarSign,
  TrendingUp, Scale, BookOpen, CheckCircle2, ExternalLink, Star, Award, Building
} from "lucide-react";

export default function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const university = getUniversityById(id);
  const { profile, toggleSavedUniversity, toggleCompare, addApplication } = useAppStore();

  if (!university) return notFound();

  const saved = profile.savedUniversities.includes(university.id);
  const inCompare = profile.compareList.includes(university.id);
  const acceptance = getAcceptanceLabel(university.acceptanceRate);
  const chance = admissionChance(university.acceptanceRate, university.satRange, profile.satScore);
  const totalCost4yr = (university.tuitionOutState + university.roomBoard + university.booksSupplies + university.personalExpenses) * 4;
  const roi = calculateROI(totalCost4yr, university.avgSalaryAfter10Yrs);

  const handleAddApplication = () => {
    addApplication({
      universityId: university.id,
      universityName: university.name,
      status: "Planning",
      type: "Regular Decision",
      deadline: "January 1",
      notes: "",
      priority: chance.percent > 50 ? "Safety" : chance.percent > 25 ? "Match" : "Reach",
    });
    alert(`${university.shortName} added to your Application Tracker!`);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, ${university.colors[0] || '#1e40af'}, ${university.colors[1] || '#7c3aed'})` }}
          className="px-6 py-10">
          <div className="max-w-5xl mx-auto">
            <Link href="/universities" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Universities
            </Link>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {university.ranking > 0 && (
                    <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
                      #{university.ranking} National
                    </span>
                  )}
                  <span className={cn("text-sm font-medium px-3 py-1 rounded-full bg-white/20 text-white")}>
                    {university.type}
                  </span>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/20 text-white">
                    Est. {university.founded}
                  </span>
                </div>
                <h1 className="text-4xl font-black text-white mb-2">{university.name}</h1>
                <div className="flex items-center gap-2 text-white/70">
                  <MapPin className="w-4 h-4" />
                  <span>{university.city}, {university.state} · {university.setting} · {university.size} Campus</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleSavedUniversity(university.id)}
                  className={cn("flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all",
                    saved ? "bg-white text-gray-800" : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                  )}>
                  <Bookmark className={cn("w-4 h-4", saved && "fill-gray-800")} />
                  {saved ? "Saved" : "Save School"}
                </button>
                <button
                  onClick={() => toggleCompare(university.id)}
                  className={cn("flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all",
                    inCompare ? "bg-white text-blue-700" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  )}>
                  <Scale className="w-4 h-4" />
                  {inCompare ? "In Compare" : "Add to Compare"}
                </button>
                <button
                  onClick={handleAddApplication}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm bg-white/20 text-white hover:bg-white/30 border border-white/30 transition-all">
                  <CheckCircle2 className="w-4 h-4" />
                  Track Application
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Acceptance Rate", value: formatPercent(university.acceptanceRate), sub: acceptance.label, color: "bg-orange-50", textColor: "text-orange-600" },
              { label: "In-State Tuition", value: formatCurrency(university.tuitionInState, true), sub: "Per year", color: "bg-blue-50", textColor: "text-blue-600" },
              { label: "Grad Salary (6yr)", value: formatCurrency(university.avgSalaryAfter6Yrs, true), sub: "After graduation", color: "bg-emerald-50", textColor: "text-emerald-600" },
              { label: "Graduation Rate", value: formatPercent(university.graduationRate), sub: "4-year rate", color: "bg-violet-50", textColor: "text-violet-600" },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-2xl p-5 border border-gray-100", s.color)}>
                <p className={cn("text-2xl font-black mb-1", s.textColor)}>{s.value}</p>
                <p className="text-sm font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Admission chance banner */}
          {profile.satScore > 0 && university.satRange[0] > 0 && (
            <div className={cn("rounded-2xl p-5 mb-8 border flex items-center gap-4",
              chance.percent >= 50 ? "bg-green-50 border-green-200" :
              chance.percent >= 25 ? "bg-blue-50 border-blue-200" :
              "bg-orange-50 border-orange-200"
            )}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0",
                chance.percent >= 50 ? "bg-green-500" : chance.percent >= 25 ? "bg-blue-500" : "bg-orange-500"
              )}>
                {Math.round(chance.percent)}%
              </div>
              <div>
                <p className="font-bold text-gray-900">{chance.label} for You</p>
                <p className="text-sm text-gray-600">Based on your SAT score of {profile.satScore} vs. their range of {university.satRange[0]}–{university.satRange[1]}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {university.shortName}</h2>
                <p className="text-gray-600 leading-relaxed">{university.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {university.strengths.map((s) => (
                    <span key={s} className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Full Cost Breakdown</h2>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[
                    { label: "Tuition (In-State)", value: university.tuitionInState },
                    { label: "Tuition (Out-of-State)", value: university.tuitionOutState },
                    { label: "Room & Board", value: university.roomBoard },
                    { label: "Books & Supplies", value: university.booksSupplies },
                    { label: "Personal Expenses", value: university.personalExpenses },
                    { label: "Avg Net Price (after aid)", value: university.avgNetPrice },
                  ].map((c) => (
                    <div key={c.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">{c.label}</p>
                      <p className="text-base font-bold text-gray-800">{formatCurrency(c.value)}/yr</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Estimated 4-Year Total (Out-of-State)</p>
                      <p className="text-xs text-gray-500">Tuition + room/board + expenses</p>
                    </div>
                    <p className="text-2xl font-black text-blue-700">{formatCurrency(totalCost4yr)}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">10-Year ROI vs. cost</p>
                    <p className={cn("text-sm font-bold", roi > 0 ? "text-emerald-600" : "text-red-500")}>
                      {roi > 0 ? "+" : ""}{roi.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Admissions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Admissions Profile</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Acceptance Rate", value: formatPercent(university.acceptanceRate) },
                    { label: "SAT Range", value: university.satRange[0] > 0 ? `${university.satRange[0]}–${university.satRange[1]}` : "Test Optional" },
                    { label: "ACT Range", value: university.actRange[0] > 0 ? `${university.actRange[0]}–${university.actRange[1]}` : "Test Optional" },
                    { label: "Student/Faculty Ratio", value: `${university.studentFacultyRatio}:1` },
                    { label: "Total Enrollment", value: formatNumber(university.enrollment) },
                    { label: "Founded", value: university.founded.toString() },
                  ].map((s) => (
                    <div key={s.label} className="text-center bg-gray-50 rounded-xl p-3">
                      <p className="text-base font-bold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Majors */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Majors Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {university.topMajors.map((m) => (
                    <span key={m} className="bg-violet-50 text-violet-700 text-sm font-medium px-3 py-1.5 rounded-full border border-violet-100">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Outcomes */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" /> Graduate Outcomes
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Salary at 6 Years", value: formatCurrency(university.avgSalaryAfter6Yrs, true) },
                    { label: "Salary at 10 Years", value: formatCurrency(university.avgSalaryAfter10Yrs, true) },
                    { label: "Graduation Rate", value: formatPercent(university.graduationRate) },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">{s.label}</span>
                      <span className="text-sm font-bold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notable Alumni */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" /> Notable Alumni
                </h3>
                <div className="space-y-2">
                  {university.notableAlumni.slice(0, 4).map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <button
                  onClick={handleAddApplication}
                  className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-2xl font-semibold text-sm hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  + Track My Application
                </button>
                <Link href="/compare" className="block w-full text-center border border-gray-200 text-gray-700 py-3 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-all">
                  Compare with Other Schools
                </Link>
                <a
                  href={`https://www.${university.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 py-3 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Visit Official Website
                </a>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
