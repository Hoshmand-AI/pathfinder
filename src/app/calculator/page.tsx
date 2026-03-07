"use client";
import { useState } from "react";
import { formatCurrency, calculateROI, cn } from "@/lib/utils";

const LOAN_RATES = { federal: 0.0653, private: 0.085 };

function calcMonthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal === 0) return 0;
  const r = annualRate / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const presets = [
  { label: "In-State Public",    tuition: 12000, roomBoard: 11000, grants: 4000,  scholarships: 1500 },
  { label: "Out-of-State",       tuition: 35000, roomBoard: 12000, grants: 4000,  scholarships: 2000 },
  { label: "Private University", tuition: 58000, roomBoard: 18000, grants: 20000, scholarships: 5000 },
  { label: "Community College",  tuition: 3500,  roomBoard: 0,     grants: 2500,  scholarships: 500 },
];

function Slider({
  label, value, onChange, min, max, step = 500,
}: {
  label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[13px] font-medium text-[#4A443C]">{label}</label>
        <span className="text-[13px] font-semibold text-[#0A1628] tabular-nums">{formatCurrency(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-[#162D54]"
        style={{
          background: `linear-gradient(to right, #162D54 0%, #162D54 ${((value - min) / (max - min)) * 100}%, #E2DDD5 ${((value - min) / (max - min)) * 100}%, #E2DDD5 100%)`,
        }}
      />
      <div className="flex justify-between text-[11px] text-[#B8B0A4] mt-0.5">
        <span>{formatCurrency(min, true)}</span>
        <span>{formatCurrency(max, true)}</span>
      </div>
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
    <main className="min-h-screen bg-[#FDFCFA] pt-14">
      <div className="max-w-6xl mx-auto px-6 pt-9 pb-12">
        <h1 className="font-serif text-[32px] text-[#0A1628] mb-1.5">College Cost Calculator</h1>
        <p className="text-[15px] text-[#8A8178] mb-6">Estimate the real cost of your degree with financial aid, loans, and ROI projections.</p>

        {/* Preset tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-md text-[13px] font-medium border bg-[#F8F6F3] text-[#6B6359] border-[#F0EDE8] hover:bg-[#F0EDE8] hover:border-[#E2DDD5] transition-colors duration-150"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs — left 3/5 */}
          <div className="lg:col-span-3 space-y-5">
            {/* Annual Costs */}
            <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-6">
              <h2 className="text-[15px] font-semibold text-[#0A1628] mb-1">Annual Costs</h2>
              <p className="text-[13px] text-[#8A8178] mb-5">Enter costs per year</p>
              <Slider label="Tuition & Fees" value={tuition} onChange={setTuition} min={3000} max={70000} step={500} />
              <Slider label="Room & Board" value={roomBoard} onChange={setRoomBoard} min={0} max={25000} step={500} />
              <Slider label="Books, Supplies & Personal" value={booksPersonal} onChange={setBooksPersonal} min={1000} max={8000} step={200} />
              <div className="flex items-center justify-between bg-[#F0EDE8] rounded-md px-4 py-3 mt-2">
                <span className="text-[13px] font-medium text-[#4A443C] uppercase tracking-wider text-[11px]">Total Annual Cost</span>
                <span className="text-[18px] font-semibold text-[#0A1628] tabular-nums">{formatCurrency(totalAnnualCost)}</span>
              </div>
            </div>

            {/* Financial Aid */}
            <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-6">
              <h2 className="text-[15px] font-semibold text-[#0A1628] mb-1">Financial Aid & Contributions</h2>
              <p className="text-[13px] text-[#8A8178] mb-5">All sources that reduce your cost</p>
              <Slider label="Federal/State Grants (FAFSA)" value={grants} onChange={setGrants} min={0} max={30000} step={250} />
              <Slider label="Scholarships" value={scholarships} onChange={setScholarships} min={0} max={30000} step={250} />
              <Slider label="Work-Study Program" value={workStudy} onChange={setWorkStudy} min={0} max={8000} step={250} />
              <Slider label="Family / Parent Contribution" value={parentContrib} onChange={setParentContrib} min={0} max={40000} step={500} />
              <div className="flex items-center justify-between bg-[rgba(61,139,110,0.06)] rounded-md px-4 py-3 mt-2">
                <span className="text-[11px] font-medium text-[#4A443C] uppercase tracking-wider">Total Annual Aid</span>
                <span className="text-[18px] font-semibold text-[#3D8B6E] tabular-nums">– {formatCurrency(totalAid)}</span>
              </div>
            </div>

            {/* Loan & Career */}
            <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-6">
              <h2 className="text-[15px] font-semibold text-[#0A1628] mb-5">Loan & Career Projection</h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#B8B0A4] font-medium mb-2">Program Length</label>
                  <div className="flex gap-2">
                    {[2, 4].map((y) => (
                      <button key={y} onClick={() => setYears(y)}
                        className={cn("flex-1 py-2 rounded-md text-[13px] font-semibold border transition-colors duration-150",
                          years === y ? "bg-[#0F2140] text-white border-[#0F2140]" : "bg-white text-[#6B6359] border-[#E2DDD5]"
                        )}>
                        {y} Years
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#B8B0A4] font-medium mb-2">Loan Type</label>
                  <div className="flex gap-2">
                    {(["federal", "private"] as const).map((t) => (
                      <button key={t} onClick={() => setLoanType(t)}
                        className={cn("flex-1 py-2 rounded-md text-[13px] font-semibold border capitalize transition-colors duration-150",
                          loanType === t ? "bg-[#0F2140] text-white border-[#0F2140]" : "bg-white text-[#6B6359] border-[#E2DDD5]"
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

          {/* Summary — right 2/5, sticky */}
          <div className="lg:col-span-2">
            <div className="bg-[#F8F6F3] border border-[#F0EDE8] rounded-lg p-6 sticky top-20 space-y-4">
              {/* Annual gap */}
              <div>
                <h3 className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B0A4] mb-3">Annual Gap (Loan Needed)</h3>
                <p className={cn("text-[28px] font-semibold tabular-nums", annualGap === 0 ? "text-[#3D8B6E]" : "text-[#C4873B]")}>
                  {formatCurrency(annualGap)}
                </p>
                <p className="text-[12px] text-[#B8B0A4]">Per year after all aid</p>
              </div>

              {/* Line items */}
              <div className="border-t border-[#F0EDE8] pt-4 space-y-0">
                {[
                  { label: "Total Loan Amount",    value: formatCurrency(totalLoanNeeded),  color: "text-[#0A1628]" },
                  { label: "Monthly Payment (10yr)", value: formatCurrency(monthlyPayment), color: "text-[#4A7FB5]" },
                  { label: "Total Repaid",          value: formatCurrency(totalRepayment),  color: "text-[#4A443C]" },
                  { label: "Interest Paid",         value: formatCurrency(totalInterest),   color: "text-[#B85C5C]" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2 border-b border-[#F0EDE8] last:border-0">
                    <span className="text-[13px] text-[#6B6359]">{r.label}</span>
                    <span className={cn("text-[13px] font-semibold tabular-nums", r.color)}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Debt-to-income */}
              <div className="border-t border-[#F0EDE8] pt-4">
                <h3 className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B0A4] mb-2">Debt-to-Income Ratio</h3>
                <p className={cn("text-[24px] font-semibold tabular-nums",
                  debtToSalaryRatio < 0.5 ? "text-[#3D8B6E]" :
                  debtToSalaryRatio < 1.0 ? "text-[#C4873B]" : "text-[#B85C5C]"
                )}>
                  {debtToSalaryRatio.toFixed(2)}x
                </p>
                <p className="text-[12px] text-[#8A8178] mt-1">
                  {debtToSalaryRatio < 0.5 ? "Excellent — well within manageable range." :
                   debtToSalaryRatio < 1.0 ? "Manageable — avoid lifestyle creep." :
                   "High — consider more aid or a lower-cost school."}
                </p>
              </div>

              {/* ROI */}
              <div className="border-t border-[#F0EDE8] pt-4">
                <h3 className="text-[11px] uppercase tracking-wider font-semibold text-[#B8B0A4] mb-2">10-Year ROI</h3>
                <p className={cn("text-[24px] font-semibold tabular-nums",
                  roi10yr > 200 ? "text-[#3D8B6E]" : roi10yr > 100 ? "text-[#3D8B6E]" : "text-[#C4873B]"
                )}>
                  +{roi10yr.toFixed(0)}%
                </p>
              </div>

              {/* 4-year summary box */}
              <div className="bg-[#0F2140] text-white p-4 rounded-md">
                <h3 className="text-[11px] uppercase tracking-wider font-semibold text-white/50 mb-3">Total {years}-Year Summary</h3>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-white/50">Total Cost</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(totalProgramCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Total Aid Received</span>
                    <span className="font-semibold text-[#C8963E] tabular-nums">– {formatCurrency(totalAid * years)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="font-medium text-white/80">Out-of-Pocket Total</span>
                    <span className="text-[18px] font-bold tabular-nums">{formatCurrency(annualGap * years)}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#B8B0A4]">
                Based on {(LOAN_RATES[loanType] * 100).toFixed(2)}% {loanType} rate, 10-year repayment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
