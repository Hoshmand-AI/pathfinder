"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, User,
  BookOpen, Heart, DollarSign, MapPin, Sparkles
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { CareerValue } from "@/lib/types";

const steps = [
  { id: 1, label: "Basic Info", icon: User },
  { id: 2, label: "Academics", icon: BookOpen },
  { id: 3, label: "Interests", icon: Heart },
  { id: 4, label: "Financial", icon: DollarSign },
  { id: 5, label: "Location", icon: MapPin },
];

const gradeOptions = ["9th", "10th", "11th", "12th", "Community College", "Transfer", "Graduate"];

const subjectOptions = ["Mathematics", "Science/Biology", "Chemistry", "Physics", "English/Writing", "History", "Computer Science", "Economics", "Art/Music", "Foreign Language", "Physical Education", "Business"];

const interestOptions = ["Technology & Computers", "Medicine & Healthcare", "Business & Finance", "Arts & Design", "Science & Research", "Law & Justice", "Education & Teaching", "Environment & Nature", "Engineering & Building", "Sports & Fitness", "Social Work & Helping Others", "Entertainment & Media", "Government & Politics", "Mathematics & Statistics", "Music & Performing Arts"];

const careerValueOptions: { value: CareerValue; label: string; emoji: string }[] = [
  { value: "High Salary", label: "High Salary", emoji: "💰" },
  { value: "Work-Life Balance", label: "Work-Life Balance", emoji: "⚖️" },
  { value: "Making an Impact", label: "Making an Impact", emoji: "🌍" },
  { value: "Creativity", label: "Creativity", emoji: "🎨" },
  { value: "Job Security", label: "Job Security", emoji: "🛡️" },
  { value: "Prestige", label: "Prestige", emoji: "⭐" },
  { value: "Remote Work", label: "Remote Work", emoji: "🏠" },
  { value: "Helping People", label: "Helping People", emoji: "🤝" },
  { value: "Innovation", label: "Innovation", emoji: "🚀" },
  { value: "Leadership", label: "Leadership", emoji: "👥" },
];

const budgetOptions = [
  { value: "< $20k/yr", label: "Under $20,000/yr", desc: "Community college + transfers; heavy aid needed" },
  { value: "$20k-$40k/yr", label: "$20,000 – $40,000/yr", desc: "Most public in-state + some private with aid" },
  { value: "$40k-$60k/yr", label: "$40,000 – $60,000/yr", desc: "Most universities with moderate aid" },
  { value: "$60k+/yr", label: "$60,000+/yr", desc: "Full-price private universities" },
];

const campusSettingOptions = ["Urban", "Suburban", "Rural", "No preference"];
const campusSizeOptions = ["Small (<5k)", "Medium (5k-15k)", "Large (15k+)", "No preference"];
const distanceOptions = ["< 100 miles", "100-500 miles", "500+ miles", "No preference"];

const US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(1);
  const [local, setLocal] = useState({ ...profile });

  const update = (key: string, value: unknown) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: string, val: string) => {
    const arr = (local[key as keyof typeof local] as string[]) || [];
    const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
    update(key, next);
  };

  const next = () => {
    updateProfile(local);
    if (step < 5) setStep((s) => s + 1);
    else {
      updateProfile(local);
      completeOnboarding();
      router.push("/dashboard");
    }
  };

  const back = () => setStep((s) => s - 1);

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-xl">PathFinder</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Let&apos;s Build Your Profile</h1>
          <p className="text-gray-500">5 quick steps to personalized recommendations</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  done ? "bg-green-100 text-green-700" :
                  active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" :
                  "bg-gray-100 text-gray-400"
                )}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span className="hidden sm:block">{s.label}</span>
                </div>
                {s.id < steps.length && <div className={cn("w-4 h-0.5", step > s.id ? "bg-green-400" : "bg-gray-200")} />}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">About You</h2>
              <p className="text-gray-500 text-sm mb-6">Your basic information helps us personalize everything.</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={local.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={local.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="e.g. Smith"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (optional)</label>
                <input
                  type="email"
                  value={local.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Current Grade / Year</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {gradeOptions.map((g) => (
                    <button
                      key={g}
                      onClick={() => update("grade", g)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all",
                        local.grade === g
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academics */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Academics</h2>
              <p className="text-gray-500 text-sm mb-6">This helps us estimate your admission chances. Estimate if unsure.</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">GPA (4.0 scale)</label>
                  <input
                    type="number"
                    min="0" max="4" step="0.1"
                    value={local.gpa || ""}
                    onChange={(e) => update("gpa", parseFloat(e.target.value))}
                    placeholder="3.5"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">SAT Score</label>
                  <input
                    type="number"
                    min="400" max="1600"
                    value={local.satScore || ""}
                    onChange={(e) => update("satScore", parseInt(e.target.value))}
                    placeholder="1200"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ACT Score</label>
                  <input
                    type="number"
                    min="1" max="36"
                    value={local.actScore || ""}
                    onChange={(e) => update("actScore", parseInt(e.target.value))}
                    placeholder="27"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your Strongest Subjects (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {subjectOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleArray("strongSubjects", s)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                        (local.strongSubjects || []).includes(s)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests & Values */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Interests & Values</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us what you love and what matters to you in a career.</p>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">What interests you most? (pick all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleArray("interests", s)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                        (local.interests || []).includes(s)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">What matters most in your career? (pick top 3)</label>
                <div className="grid grid-cols-2 gap-2">
                  {careerValueOptions.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => toggleArray("careerValues", v.value)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                        (local.careerValues || []).includes(v.value)
                          ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/25"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300"
                      )}
                    >
                      <span className="text-lg">{v.emoji}</span>
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Financial */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Financial Picture</h2>
              <p className="text-gray-500 text-sm mb-6">Honest financial information ensures realistic recommendations.</p>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Annual budget for college (all-in)</label>
                <div className="space-y-2">
                  {budgetOptions.map((b) => (
                    <button
                      key={b.value}
                      onClick={() => update("budgetTier", b.value)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                        local.budgetTier === b.value
                          ? "bg-emerald-50 border-emerald-500 shadow-sm"
                          : "bg-gray-50 border-gray-200 hover:border-emerald-300"
                      )}
                    >
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        local.budgetTier === b.value ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                      )}>
                        {local.budgetTier === b.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{b.label}</p>
                        <p className="text-xs text-gray-500">{b.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <label className={cn(
                  "flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                  local.needsFinancialAid ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-200"
                )}>
                  <input
                    type="checkbox"
                    checked={local.needsFinancialAid}
                    onChange={(e) => update("needsFinancialAid", e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">I need financial aid</p>
                    <p className="text-xs text-gray-500">FAFSA, grants, scholarships</p>
                  </div>
                </label>
                <label className={cn(
                  "flex-1 flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                  local.willingToTakeLoans ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-200"
                )}>
                  <input
                    type="checkbox"
                    checked={local.willingToTakeLoans}
                    onChange={(e) => update("willingToTakeLoans", e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Willing to take loans</p>
                    <p className="text-xs text-gray-500">Federal and private loans</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Location */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Location & Campus Fit</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us where you want to study.</p>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred States (optional)</label>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
                  {US_STATES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleArray("statePreference", s)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                        (local.statePreference || []).includes(s)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Distance from Home</label>
                <div className="grid grid-cols-2 gap-2">
                  {distanceOptions.map((d) => (
                    <button key={d} onClick={() => update("distanceFromHome", d)}
                      className={cn("px-4 py-2.5 rounded-xl text-sm border transition-all",
                        local.distanceFromHome === d ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                      )}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Campus Setting</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {campusSettingOptions.map((o) => (
                      <button key={o} onClick={() => update("campusSetting", o)}
                        className={cn("px-4 py-2 rounded-xl text-sm border transition-all text-left",
                          local.campusSetting === o ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                        )}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Campus Size</label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {campusSizeOptions.map((o) => (
                      <button key={o} onClick={() => update("campusSize", o)}
                        className={cn("px-4 py-2 rounded-xl text-sm border transition-all text-left",
                          local.campusSize === o ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                        )}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={back}
              disabled={step === 1}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              {steps.map((s) => (
                <div key={s.id} className={cn("w-2 h-2 rounded-full transition-all",
                  s.id === step ? "bg-blue-600 w-6" : s.id < step ? "bg-green-400" : "bg-gray-200"
                )} />
              ))}
            </div>
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25 group"
            >
              {step === 5 ? (
                <><Sparkles className="w-4 h-4" /> See My Matches</>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          Your data is stored locally on your device. We never sell your information.
        </p>
      </div>
    </div>
  );
}
