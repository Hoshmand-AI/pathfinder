"use client";
import { useState } from "react";
import { formatCurrency, calculateROI, cn } from "@/lib/utils";
import { TrendingUp, AlertCircle, CheckCircle2, Info } from "lucide-react";

const LOAN_RATES = { federal: 0.0653, private: 0.085 };

function calcMonthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal === 0) return 0;
  const r = annualRate / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const presets = [
  { label: "In-State Public", tuition: 12000, roomBoard: 11000, grants: 4000, scholarships: 1500 },
  { label: "Out-of-State Public", tuition: 35000, roomBoard: 12000, grants: 4000, scholarships: 2000 },
  { label: "Private University", tuition: 58000, roomBoard: 18000, grants: 20000, scholarships: 5000 },
  { label: "Community College", tuition: 3500, roomBoard: 0, grants: 2500, scholarships: 500 },
];

function SliderField({
  label, value, onChange, min, max, step = 500,
}: {
  label: string; value: number; onChange: (n: number) => void;
  min: number; max: number; step?: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-indigo-600 h-1.5 rounded-full"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatCurrency(min, true)}</span>
        <span>{formatCurrency(max, true)}</span>
      </div>
    </div>
  );
}

function SummaryLine({ label, value, valueClass = "text-gray-900", border = true }: {
  label: string; value: string; valueClass?: string; border?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between py-2.5", border && "border-b border-gray-100")}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className={cn("text-sm font-semibold tabular-nums", valueClass)}>{value}</span>
    </div>
  );
}

export default function CalculatorPage() {
  const [tuition, setTuition] = useState(20000);
  const [roomBoard, setRoomBoard] = useState(12000);
  const [booksPersonal, setBooksPersonal] = useState(3000);
  const [grants, setGrants] = useState(5000);
  const [scholarships, setScholarships] = useState(2000);
  const [workStudy, setWorkStudy] = useState(2500);
  const [parentContrib, setParentContrib] = useState(5000);
  const [expectedSalary, setExpectedSalary] = useState(70000);
  const [loanType, setLoanType] = useState<"federal" | "private">("federal");
  const [years, setYears] = useState(4);

  const totalAnnualCost = tuition + roomBoard + booksPersonal;
  const totalAid = grants + scholarships + workStudy + parentContrib;
  const annualGap = Math.max(0, totalAnnualCost - totalAid);
  const totalLoanNeeded = annualGap * years;
  const monthlyPayment = calcMonthlyPayment(totalLoanNeeded, LOAN_RATES[loanType], 120);
  const totalRepayment = monthlyPayment * 120;
  const totalInterest = totalRepayment - totalLoanNeeded;
  const totalProgramCost = totalAnnualCost * years;
  const roi10yr = calculateROI(totalProgramCost, expectedSalary, 10);
  const debtToSalaryRatio = totalLoanNeeded / expectedSalary;

  const applyPreset = (p: typeof presets[0]) => {
    setTuition(p.tuition);
    setRoomBoard(p.roomBoard);
    setGrants(p.grants);
    setScholarships(p.scholarships);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">College Cost Calculator</h1>
          <p className="text-gray-600">
            Calculate the real 4-year cost, financial aid, loan burden, and ROI of your college choice.
          </p>
        </div>

        {/* Quick presets */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main layout: 3/5 inputs + 2/5 results */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ─── Left: Input panels ─── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Annual Costs */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Annual Costs</h2>
              <p className="text-xs text-gray-500 mb-5">Enter costs per academic year</p>
              <SliderField label="Tuition & Fees" value={tuition} onChange={setTuition} min={3000} max={70000} />
              <SliderField label="Room & Board" value={roomBoard} onChange={setRoomBoard} min={0} max={25000} />
              <SliderField label="Books, Supplies & Personal" value={booksPersonal} onChange={setBooksPersonal} min={1000} max={8000} step={200} />
              <div className="flex items-center justify-between py-3 border-t border-gray-100 mt-2">
                <span className="text-sm font-medium text-gray-700">Total Annual Cost</span>
                <span className="text-lg font-bold text-gray-900 tabular-nums">{formatCurrency(totalAnnualCost)}</span>
              </div>
            </div>

            {/* Financial Aid */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Financial Aid & Contributions</h2>
              <p className="text-xs text-gray-500 mb-5">Enter all sources of funding that reduce your cost</p>
              <SliderField label="Federal/State Grants (FAFSA)" value={grants} onChange={setGrants} min={0} max={30000} step={250} />
              <SliderField label="Scholarships (Merit & Need-Based)" value={scholarships} onChange={setScholarships} min={0} max={30000} step={250} />
              <SliderField label="Work-Study Program" value={workStudy} onChange={setWorkStudy} min={0} max={8000} step={250} />
              <SliderField label="Family / Parent Contribution" value={parentContrib} onChange={setParentContrib} min={0} max={40000} />
              <div className="flex items-center justify-between py-3 border-t border-gray-100 mt-2">
                <span className="text-sm font-medium text-gray-700">Total Annual Aid</span>
                <span className="text-lg font-bold text-emerald-600 tabular-nums">− {formatCurrency(totalAid)}</span>
              </div>
            </div>

            {/* Program & Loan settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Loan & Career Settings</h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Program Length
                  </label>
                  <div className="flex gap-2">
                    {[2, 4].map((y) => (
                      <button
                        key={y}
                        onClick={() => setYears(y)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                          years === y
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {y} Years
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Loan Type
                  </label>
                  <div className="flex gap-2">
                    {(["federal", "private"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setLoanType(t)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize",
                          loanType === t
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <SliderField
                label="Expected Starting Salary After Graduation"
                value={expectedSalary}
                onChange={setExpectedSalary}
                min={30000}
                max={200000}
                step={1000}
              />
            </div>
          </div>

          {/* ─── Right: Results ─── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Annual gap highlight */}
              <div className={cn(
                "rounded-xl p-5 border",
                annualGap === 0
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-amber-50 border-amber-200"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  {annualGap === 0
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    : <AlertCircle className="w-4 h-4 text-amber-600" />}
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Annual Gap (Loan Needed)
                  </span>
                </div>
                <p className={cn("text-3xl font-bold tabular-nums mt-1",
                  annualGap === 0 ? "text-emerald-700" : "text-amber-700"
                )}>
                  {formatCurrency(annualGap)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Per year after all aid applied</p>
              </div>

              {/* Loan summary card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Loan Summary</h3>
                <SummaryLine label="Total Loan Amount" value={formatCurrency(totalLoanNeeded)} />
                <SummaryLine label={`Monthly Payment (10yr)`} value={formatCurrency(monthlyPayment)} valueClass="text-indigo-700" />
                <SummaryLine label="Total Repaid" value={formatCurrency(totalRepayment)} />
                <SummaryLine label="Interest Paid" value={formatCurrency(totalInterest)} valueClass="text-amber-700" border={false} />
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                  {(LOAN_RATES[loanType] * 100).toFixed(2)}% {loanType} rate · 10-year repayment
                </p>
              </div>

              {/* Debt-to-Income */}
              <div className={cn("rounded-xl p-5 border",
                debtToSalaryRatio < 0.5 ? "bg-emerald-50 border-emerald-200" :
                debtToSalaryRatio < 1.0 ? "bg-amber-50 border-amber-200" :
                "bg-red-50 border-red-200"
              )}>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Debt-to-Income Ratio</h3>
                <p className={cn("text-3xl font-bold tabular-nums",
                  debtToSalaryRatio < 0.5 ? "text-emerald-700" :
                  debtToSalaryRatio < 1.0 ? "text-amber-700" : "text-red-700"
                )}>
                  {debtToSalaryRatio.toFixed(2)}×
                </p>
                <p className="text-xs text-gray-500 mt-1">Total loan ÷ starting salary</p>
                <p className="text-xs text-gray-600 mt-2">
                  {debtToSalaryRatio < 0.5
                    ? "Excellent — well within manageable range."
                    : debtToSalaryRatio < 1.0
                    ? "Manageable — avoid additional lifestyle debt."
                    : "High — consider more aid or a lower-cost school."}
                </p>
              </div>

              {/* ROI */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-gray-900">10-Year ROI</h3>
                </div>
                <p className={cn("text-3xl font-bold tabular-nums mb-1",
                  roi10yr > 200 ? "text-emerald-700" : roi10yr > 100 ? "text-gray-900" : "text-amber-700"
                )}>
                  +{roi10yr.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 mb-3">Returns vs. total investment over 10 years</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${Math.min(roi10yr / 5, 100)}%` }}
                  />
                </div>
              </div>

              {/* {years}-Year Total Summary */}
              <div className="bg-gray-900 rounded-xl p-5 text-white">
                <h3 className="text-sm font-semibold mb-4">{years}-Year Total Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Cost</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(totalProgramCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Aid</span>
                    <span className="font-semibold text-emerald-400 tabular-nums">− {formatCurrency(totalAid * years)}</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-gray-700">
                    <span className="font-medium">Out-of-Pocket Total</span>
                    <span className="text-xl font-bold tabular-nums">{formatCurrency(annualGap * years)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
