"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { CareerValue } from "@/lib/types";

const STEPS = [
  { id: 1, label: "About You" },
  { id: 2, label: "Academics" },
  { id: 3, label: "Interests" },
  { id: 4, label: "Financial" },
  { id: 5, label: "Location" },
];

const gradeOptions = ["9th", "10th", "11th", "12th", "Community College", "Transfer", "Graduate"];

const subjectOptions = [
  "Mathematics", "Science/Biology", "Chemistry", "Physics", "English/Writing",
  "History", "Computer Science", "Economics", "Art/Music", "Foreign Language",
  "Physical Education", "Business",
];

const interestOptions = [
  "Technology & Computers", "Medicine & Healthcare", "Business & Finance",
  "Arts & Design", "Science & Research", "Law & Justice", "Education & Teaching",
  "Environment & Nature", "Engineering & Building", "Sports & Fitness",
  "Social Work & Helping Others", "Entertainment & Media", "Government & Politics",
  "Mathematics & Statistics", "Music & Performing Arts",
];

const careerValueOptions: { value: CareerValue; label: string }[] = [
  { value: "High Salary",        label: "High Salary" },
  { value: "Work-Life Balance",  label: "Work-Life Balance" },
  { value: "Making an Impact",   label: "Making an Impact" },
  { value: "Creativity",         label: "Creativity" },
  { value: "Job Security",       label: "Job Security" },
  { value: "Prestige",           label: "Prestige" },
  { value: "Remote Work",        label: "Remote Work" },
  { value: "Helping People",     label: "Helping People" },
  { value: "Innovation",         label: "Innovation" },
  { value: "Leadership",         label: "Leadership" },
];

const budgetOptions = [
  { value: "< $20k/yr",      label: "Under $20,000/yr",        desc: "Community college + transfers; heavy aid needed" },
  { value: "$20k-$40k/yr",   label: "$20,000 – $40,000/yr",    desc: "Most public in-state + some private with aid" },
  { value: "$40k-$60k/yr",   label: "$40,000 – $60,000/yr",    desc: "Most universities with moderate aid" },
  { value: "$60k+/yr",       label: "$60,000+/yr",             desc: "Full-price private universities" },
];

const campusSettingOptions = ["Urban", "Suburban", "Rural", "No preference"];
const campusSizeOptions    = ["Small (<5k)", "Medium (5k-15k)", "Large (15k+)", "No preference"];
const distanceOptions      = ["< 100 miles", "100-500 miles", "500+ miles", "No preference"];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const inputClass = "w-full bg-[#F8F6F3] border border-[#E2DDD5] rounded-md px-4 py-3 text-[14px] text-[#0A1628] placeholder-[#B8B0A4] focus:outline-none focus:border-[#B8B0A4] transition-colors duration-150";
const labelClass = "block text-[11px] uppercase tracking-[0.06em] font-medium text-[#B8B0A4] mb-1.5";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-[13px] font-medium border transition-colors duration-150",
        active
          ? "bg-[#0F2140] text-white border-[#0F2140]"
          : "bg-[#F8F6F3] text-[#6B6359] border-[#E2DDD5] hover:bg-[#F0EDE8]"
      )}
    >
      {children}
    </button>
  );
}

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
    update(key, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
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

  return (
    <div className="min-h-screen bg-[#FDFCFA] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-serif text-[22px] text-[#0A1628] mb-1">PathFinder</div>
          <h1 className="font-serif text-[28px] text-[#0A1628] mb-1">Let&apos;s Build Your Profile</h1>
          <p className="text-[14px] text-[#8A8178]">5 quick steps to personalized recommendations</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => {
            const done    = step > s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold transition-colors duration-150",
                  done    ? "bg-[#0F2140] border-[#0F2140] text-white" :
                  current ? "bg-white border-[#C8963E] text-[#C8963E]" :
                            "bg-white border-[#E2DDD5] text-[#B8B0A4]"
                )}>
                  {done ? "✓" : s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("w-8 h-0.5 mx-1", step > s.id ? "bg-[#0F2140]" : "bg-[#E2DDD5]")} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white border border-[#F0EDE8] rounded-lg p-8">
          {/* Step 1: About You */}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-[22px] text-[#0A1628] mb-1">About You</h2>
              <p className="text-[13px] text-[#8A8178] mb-6">Your basic information helps us personalize everything.</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" value={local.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="e.g. Alex" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" value={local.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="e.g. Smith" className={inputClass} />
                </div>
              </div>
              <div className="mb-5">
                <label className={labelClass}>Email (optional)</label>
                <input type="email" value={local.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Current Grade / Year</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {gradeOptions.map((g) => (
                    <Chip key={g} active={local.grade === g} onClick={() => update("grade", g)}>{g}</Chip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academics */}
          {step === 2 && (
            <div>
              <h2 className="font-serif text-[22px] text-[#0A1628] mb-1">Your Academics</h2>
              <p className="text-[13px] text-[#8A8178] mb-6">Helps us estimate admission chances. Estimate if unsure.</p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <label className={labelClass}>GPA (4.0)</label>
                  <input type="number" min="0" max="4" step="0.1" value={local.gpa || ""} onChange={(e) => update("gpa", parseFloat(e.target.value))} placeholder="3.5" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>SAT Score</label>
                  <input type="number" min="400" max="1600" value={local.satScore || ""} onChange={(e) => update("satScore", parseInt(e.target.value))} placeholder="1200" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>ACT Score</label>
                  <input type="number" min="1" max="36" value={local.actScore || ""} onChange={(e) => update("actScore", parseInt(e.target.value))} placeholder="27" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Strongest Subjects</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subjectOptions.map((s) => (
                    <Chip key={s} active={(local.strongSubjects || []).includes(s)} onClick={() => toggleArray("strongSubjects", s)}>{s}</Chip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests & Values */}
          {step === 3 && (
            <div>
              <h2 className="font-serif text-[22px] text-[#0A1628] mb-1">Interests & Values</h2>
              <p className="text-[13px] text-[#8A8178] mb-6">Tell us what you love and what matters to you in a career.</p>
              <div className="mb-6">
                <label className={labelClass}>What interests you most?</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interestOptions.map((s) => (
                    <Chip key={s} active={(local.interests || []).includes(s)} onClick={() => toggleArray("interests", s)}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>What matters most in your career? (pick top 3)</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {careerValueOptions.map((v) => (
                    <Chip key={v.value} active={(local.careerValues || []).includes(v.value)} onClick={() => toggleArray("careerValues", v.value)}>
                      {v.label}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Financial */}
          {step === 4 && (
            <div>
              <h2 className="font-serif text-[22px] text-[#0A1628] mb-1">Financial Picture</h2>
              <p className="text-[13px] text-[#8A8178] mb-6">Honest financial info ensures realistic recommendations.</p>
              <div className="space-y-2 mb-5">
                <label className={labelClass}>Annual budget for college (all-in)</label>
                {budgetOptions.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => update("budgetTier", b.value)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-md border text-left transition-colors duration-150",
                      local.budgetTier === b.value
                        ? "bg-[#FDF6E9] border-[#C8963E]"
                        : "bg-[#F8F6F3] border-[#E2DDD5] hover:border-[#B8B0A4]"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                      local.budgetTier === b.value ? "border-[#C8963E]" : "border-[#E2DDD5]"
                    )}>
                      {local.budgetTier === b.value && <div className="w-2 h-2 bg-[#C8963E] rounded-full" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#0A1628]">{b.label}</p>
                      <p className="text-[12px] text-[#8A8178]">{b.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                {[
                  { key: "needsFinancialAid",  label: "I need financial aid",  desc: "FAFSA, grants, scholarships" },
                  { key: "willingToTakeLoans", label: "Willing to take loans", desc: "Federal and private loans" },
                ].map((item) => (
                  <label key={item.key} className={cn(
                    "flex-1 flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors duration-150",
                    (local[item.key as keyof typeof local] as boolean)
                      ? "bg-[#FDF6E9] border-[#C8963E]"
                      : "bg-[#F8F6F3] border-[#E2DDD5]"
                  )}>
                    <input
                      type="checkbox"
                      checked={(local[item.key as keyof typeof local] as boolean) || false}
                      onChange={(e) => update(item.key, e.target.checked)}
                      className="w-4 h-4 accent-[#C8963E] mt-0.5"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-[#0A1628]">{item.label}</p>
                      <p className="text-[11px] text-[#8A8178]">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Location */}
          {step === 5 && (
            <div>
              <h2 className="font-serif text-[22px] text-[#0A1628] mb-1">Location & Campus Fit</h2>
              <p className="text-[13px] text-[#8A8178] mb-6">Tell us where you want to study.</p>
              <div className="mb-5">
                <label className={labelClass}>Preferred States (optional)</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto mt-2">
                  {US_STATES.map((s) => (
                    <Chip key={s} active={(local.statePreference || []).includes(s)} onClick={() => toggleArray("statePreference", s)}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className={labelClass}>Distance from Home</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {distanceOptions.map((d) => (
                    <Chip key={d} active={local.distanceFromHome === d} onClick={() => update("distanceFromHome", d)}>{d}</Chip>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Campus Setting</label>
                  <div className="space-y-1.5 mt-2">
                    {campusSettingOptions.map((o) => (
                      <Chip key={o} active={local.campusSetting === o} onClick={() => update("campusSetting", o)}>{o}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Campus Size</label>
                  <div className="space-y-1.5 mt-2">
                    {campusSizeOptions.map((o) => (
                      <Chip key={o} active={local.campusSize === o} onClick={() => update("campusSize", o)}>{o}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F0EDE8]">
            <button
              onClick={back}
              disabled={step === 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-md text-[13px] font-medium transition-colors duration-150",
                step === 1 ? "text-[#B8B0A4] cursor-not-allowed" : "text-[#6B6359] hover:bg-[#F8F6F3]"
              )}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div key={s.id} className={cn(
                  "rounded-full transition-all duration-150",
                  s.id === step ? "w-5 h-2 bg-[#C8963E]" :
                  s.id < step  ? "w-2 h-2 bg-[#0F2140]" :
                                  "w-2 h-2 bg-[#E2DDD5]"
                )} />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[13px] font-semibold rounded-md transition-colors duration-150"
            >
              {step === 5 ? "See My Matches" : <>Continue <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#B8B0A4] mt-4">
          Your data is stored locally on your device. We never sell your information.
        </p>
      </div>
    </div>
  );
}
