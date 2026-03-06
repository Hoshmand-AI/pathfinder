"use client";
import { useState } from "react";
import { formatCurrency, calculateROI, cn } from "@/lib/utils";
import { Calculator, TrendingUp, DollarSign, AlertCircle, CheckCircle2, Info } from "lucide-react";

const LOAN_RATES = { federal: 0.0653, private: 0.085 };

function calcMonthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal === 0) return 0;
  const r = annualRate / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function CalculatorPage() {
  const [school, setSchool] = useState<"inState" | "outState" | "community">("inState");
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

  const presets = [
    { label: "In-State Public", tuition: 12000, roomBoard: 11000, grants: 4000, scholarships: 1500 },
    { label: "Out-of-State Public", tuition: 35000, roomBoard: 12000, grants: 4000, scholarships: 2000 },
    { label: "Private University", tuition: 58000, roomBoard: 18000, grants: 20000, scholarships: 5000 },
    { label: "Community College", tuition: 3500, roomBoard: 0, grants: 2500, scholarships: 500 },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setTuition(p.tuition);
    setRoomBoard(p.roomBoard);
    setGrants(p.grants);
    setScholarships(p.scholarships);
  };

  const Slider = ({ label, value, onChange, min, max, step = 500 }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-lg">{formatCurrency(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{formatCurrency(min, true)}</span>
        <span>{formatCurrency(max, true)}</span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F5F5F7] pt-14">
      <div className="bg-white border-b border-gray-200 px-6 py-8 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Calculator className="w-5 h-5 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">College Cost Calculator</h1>
            </div>
            <p className="text-gray-500 text-sm">Calculate the real cost, financial aid, loan burden, and ROI of your college choice.</p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Presets */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button key={p.label} onClick={() => applyPreset(p)}
                  className="px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inputs */}
            <div className="lg:col-span-2 space-y-5">
              {/* Costs */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Annual Costs</h2>
                <p className="text-gray-500 text-sm mb-5">Enter costs per year</p>
                <Slider label="Tuition & Fees" value={tuition} onChange={setTuition} min={3000} max={70000} step={500} />
                <Slider label="Room & Board" value={roomBoard} onChange={setRoomBoard} min={0} max={25000} step={500} />
                <Slider label="Books, Supplies & Personal Expenses" value={booksPersonal} onChange={setBooksPersonal} min={1000} max={8000} step={200} />
                <div className="bg-gray-50 rounded-xl p-4 mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Annual Cost</span>
                  <span className="text-xl font-black text-gray-900">{formatCurrency(totalAnnualCost)}</span>
                </div>
              </div>

              {/* Aid */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Financial Aid & Contributions</h2>
                <p className="text-gray-500 text-sm mb-5">Enter all sources of money that reduce your cost</p>
                <Slider label="Federal/State Grants (FAFSA-based)" value={grants} onChange={setGrants} min={0} max={30000} step={250} />
                <Slider label="Scholarships (Merit & Need-Based)" value={scholarships} onChange={setScholarships} min={0} max={30000} step={250} />
                <Slider label="Work-Study Program" value={workStudy} onChange={setWorkStudy} min={0} max={8000} step={250} />
                <Slider label="Family / Parent Contribution" value={parentContrib} onChange={setParentContrib} min={0} max={40000} step={500} />
                <div className="bg-green-50 rounded-xl p-4 mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Annual Aid</span>
                  <span className="text-xl font-black text-green-600">- {formatCurrency(totalAid)}</span>
                </div>
              </div>

              {/* Program & Loan */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Loan & Career Projection</h2>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Program Length</label>
                    <div className="flex gap-2">
                      {[2, 4].map((y) => (
                        <button key={y} onClick={() => setYears(y)}
                          className={cn("flex-1 py-2 rounded-xl text-sm font-semibold border transition-all",
                            years === y ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-200"
                          )}>
                          {y} Years
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Type</label>
                    <div className="flex gap-2">
                      {(["federal", "private"] as const).map((t) => (
                        <button key={t} onClick={() => setLoanType(t)}
                          className={cn("flex-1 py-2 rounded-xl text-sm font-semibold border transition-all capitalize",
                            loanType === t ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-600 border-gray-200"
                          )}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Slider label="Expected Starting Salary After Graduation" value={expectedSalary} onChange={setExpectedSalary} min={30000} max={200000} step={1000} />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Annual gap */}
              <div className={cn("rounded-2xl p-5 border-2",
                annualGap === 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {annualGap === 0
                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                    : <AlertCircle className="w-5 h-5 text-orange-600" />}
                  <span className="text-sm font-semibold text-gray-700">Annual Gap (Loan Needed)</span>
                </div>
                <p className={cn("text-3xl font-black mb-1", annualGap === 0 ? "text-green-700" : "text-orange-700")}>
                  {formatCurrency(annualGap)}
                </p>
                <p className="text-xs text-gray-500">Per year after all aid</p>
              </div>

              {/* Total loan */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Total Loan Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Loan Amount", value: formatCurrency(totalLoanNeeded), color: "text-gray-900" },
                    { label: "Monthly Payment (10yr)", value: formatCurrency(monthlyPayment), color: "text-blue-700" },
                    { label: "Total Repaid", value: formatCurrency(totalRepayment), color: "text-gray-700" },
                    { label: "Interest Paid", value: formatCurrency(totalInterest), color: "text-red-600" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-600">{r.label}</span>
                      <span className={cn("text-sm font-bold", r.color)}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Based on {(LOAN_RATES[loanType] * 100).toFixed(2)}% {loanType} rate, 10-year repayment</p>
              </div>

              {/* Debt to Income */}
              <div className={cn("rounded-2xl p-5 border",
                debtToSalaryRatio < 0.5 ? "bg-green-50 border-green-200" :
                debtToSalaryRatio < 1.0 ? "bg-yellow-50 border-yellow-200" :
                "bg-red-50 border-red-200"
              )}>
                <h3 className="font-bold text-gray-900 mb-2">Debt-to-Income Ratio</h3>
                <p className={cn("text-3xl font-black mb-1",
                  debtToSalaryRatio < 0.5 ? "text-green-700" :
                  debtToSalaryRatio < 1.0 ? "text-yellow-700" : "text-red-700"
                )}>
                  {(debtToSalaryRatio).toFixed(2)}x
                </p>
                <p className="text-xs text-gray-600 mb-2">Loan / Starting Salary</p>
                <p className="text-xs text-gray-500">
                  {debtToSalaryRatio < 0.5 ? "✅ Excellent — well within manageable range." :
                   debtToSalaryRatio < 1.0 ? "⚠️ Manageable — avoid lifestyle creep." :
                   "🚨 High — consider more aid or a lower-cost school."}
                </p>
              </div>

              {/* ROI */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-gray-900">10-Year ROI</h3>
                </div>
                <p className={cn("text-3xl font-black mb-1",
                  roi10yr > 200 ? "text-emerald-700" : roi10yr > 100 ? "text-green-700" : "text-yellow-700"
                )}>
                  +{roi10yr.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 mb-3">Returns vs. total investment over 10 years</p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500"
                    style={{ width: `${Math.min(roi10yr / 5, 100)}%` }} />
                </div>
              </div>

              {/* Full Cost Summary */}
              <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-5 text-white">
                <h3 className="font-bold mb-4">Total {years}-Year Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Cost</span>
                    <span className="font-bold">{formatCurrency(totalProgramCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Aid Received</span>
                    <span className="font-bold text-green-300">- {formatCurrency(totalAid * years)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span className="font-semibold">Out-of-Pocket Total</span>
                    <span className="font-black text-xl">{formatCurrency(annualGap * years)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </main>
  );
}
