import Link from "next/link";
import Footer from "@/components/layout/Footer";

const stats = [
  { value: "4,000+", label: "Universities" },
  { value: "500+",   label: "Majors & Degrees" },
  { value: "800+",   label: "Career Paths" },
  { value: "Free",   label: "To Get Started" },
];

const features = [
  {
    icon: "📊",
    title: "Major Explorer",
    description: "Browse 500+ majors with real salary data, job outlooks, and career paths.",
  },
  {
    icon: "🏛",
    title: "University Finder",
    description: "Filter 4,000+ schools by major, location, cost, acceptance rate, and outcomes.",
  },
  {
    icon: "💰",
    title: "Cost Calculator",
    description: "See the real 4-year cost with financial aid, compare ROI, and plan for loans.",
  },
  {
    icon: "📈",
    title: "Career Paths",
    description: "Visualize where any major leads — real job titles, salaries, and growth rates.",
  },
  {
    icon: "💬",
    title: "AI Advisor",
    description: "Ask anything — available 24/7. Get personalized advice tailored to your profile.",
  },
  {
    icon: "📋",
    title: "Application Tracker",
    description: "Manage your college list, track deadlines, and organize every step.",
  },
];

const steps = [
  { num: "01", title: "Build Profile",       desc: "Tell us your grades, interests, and budget." },
  { num: "02", title: "Explore Options",     desc: "Browse majors, universities, and career paths." },
  { num: "03", title: "Compare & Plan",      desc: "Use data to compare costs, ROI, and outcomes." },
  { num: "04", title: "Apply with Confidence", desc: "Track applications and hit every deadline." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0F2140]">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-9">
            <span className="font-serif text-xl text-white tracking-tight">PathFinder</span>
            <div className="hidden md:flex items-center gap-7">
              {[["Majors", "/majors"], ["Universities", "/universities"], ["Careers", "/careers"], ["Calculator", "/calculator"]].map(([label, href]) => (
                <Link key={href} href={href} className="text-[13.5px] font-medium text-white/55 hover:text-white/90 transition-colors duration-150">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="text-[13.5px] font-medium text-white/60 hover:text-white/90 transition-colors duration-150">Sign In</Link>
            <Link href="/onboarding" className="bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[13px] font-semibold px-[18px] py-[7px] rounded-md transition-colors duration-150">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-[100px] pb-12 text-center">
        <div className="max-w-[720px] mx-auto px-6">
          <h1 className="font-serif text-[44px] leading-[1.15] text-[#0A1628] mb-4">
            Make smarter decisions about your future.
          </h1>
          <p className="text-[17px] text-[#8A8178] leading-relaxed mb-8 max-w-[520px] mx-auto">
            Data-driven guidance for choosing the right major, university, and career path — tailored specifically to you.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/onboarding" className="bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[14px] font-semibold px-6 py-2.5 rounded-md transition-colors duration-150">
              Start Free
            </Link>
            <Link href="/majors" className="bg-transparent text-[#0A1628] text-[14px] font-medium px-6 py-2.5 rounded-md border border-[#E2DDD5] hover:bg-[#F8F6F3] transition-colors duration-150">
              Explore Majors
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-t border-b border-[#F0EDE8] mx-8 py-10">
        <div className="max-w-[720px] mx-auto flex justify-center gap-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[30px] font-bold text-[#0A1628] font-sans tabular-nums">{s.value}</div>
              <div className="text-[12px] text-[#B8B0A4] uppercase tracking-[0.06em] font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-[880px] mx-auto px-8 py-16">
        <h2 className="font-serif text-[30px] text-[#0A1628] mb-10">Everything you need to decide with confidence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {features.map((f, i) => (
            <div key={f.title} className={`flex gap-3.5 items-start ${i < features.length - 2 ? "pb-8 border-b border-[#F0EDE8]" : ""}`}>
              <div className="w-9 h-9 min-w-[36px] bg-[#0F2140] rounded-lg flex items-center justify-center text-base mt-0.5">
                {f.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0A1628] mb-1">{f.title}</h3>
                <p className="text-[13.5px] text-[#8A8178] leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-[880px] mx-auto px-8 pb-16">
        <h2 className="font-serif text-[30px] text-[#0A1628] mb-10">Four steps to your future</h2>
        <div className="flex gap-0 relative">
          {steps.map((s, i) => (
            <div key={s.num} className="flex-1 text-center relative">
              <div className="w-11 h-11 rounded-full bg-[#FDF6E9] flex items-center justify-center mx-auto mb-3 relative z-10">
                <span className="text-[18px] font-bold text-[#B8862E]">{s.num}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-[22px] left-[calc(50%+22px)] right-[calc(-50%+22px)] h-[2px] bg-[#E2DDD5] z-0" />
              )}
              <h4 className="text-[14px] font-semibold text-[#0A1628] mb-1">{s.title}</h4>
              <p className="text-[12.5px] text-[#8A8178] leading-snug px-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mx-8 mb-12">
        <div className="bg-[#0F2140] rounded-lg p-14 text-center">
          <h2 className="font-serif text-[30px] text-white mb-2">Your future starts with better data.</h2>
          <p className="text-[14px] text-white/50 mb-6">No account required. No credit card. Free forever.</p>
          <Link href="/onboarding" className="bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[15px] font-semibold px-8 py-3 rounded-md inline-block transition-colors duration-150">
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
