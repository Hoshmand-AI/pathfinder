"use client";
import Link from "next/link";
import {
  GraduationCap, ArrowRight, Sparkles, BookOpen, University,
  BarChart3, Calculator, MessageCircle, ClipboardList,
  TrendingUp, Star, ChevronRight, Shield, Zap,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const stats = [
  { value: "4,000+", label: "Universities Covered" },
  { value: "500+", label: "Majors & Degrees" },
  { value: "800+", label: "Career Paths" },
  { value: "Free", label: "To Get Started" },
];

const features = [
  {
    icon: BookOpen,
    title: "Major Explorer",
    description: "Browse 500+ majors with real salary data, job outlook, career paths, and course requirements.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    href: "/majors",
  },
  {
    icon: University,
    title: "University Finder",
    description: "Filter 4,000+ schools by major, location, cost, acceptance rate, and your academic profile.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    href: "/universities",
  },
  {
    icon: Calculator,
    title: "Cost Calculator",
    description: "See the real 4-year cost with financial aid, compare ROI, and plan for loan repayment.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    href: "/calculator",
  },
  {
    icon: MessageCircle,
    title: "AI Chat Advisor",
    description: "Ask anything — available 24/7. Get personalized advice tailored to your unique profile.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    href: "/chat",
  },
  {
    icon: BarChart3,
    title: "Career Paths",
    description: "Visualize where any major leads — real job titles, salaries, growth rates, and top employers.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    href: "/careers",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description: "Manage your college list, track deadlines, and organize every step of the application process.",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    href: "/applications",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Build Your Profile",
    description: "Tell us your GPA, test scores, interests, budget, and career goals in a 5-minute setup.",
  },
  {
    step: "02",
    title: "Discover Your Path",
    description: "Get AI-powered recommendations for majors and universities perfectly matched to you.",
  },
  {
    step: "03",
    title: "Compare & Decide",
    description: "Side-by-side comparisons with cost, outcomes, admission chances, and fit scores.",
  },
  {
    step: "04",
    title: "Apply with Confidence",
    description: "Track every deadline, manage your college list, and apply with our step-by-step guide.",
  },
];

const testimonials = [
  {
    name: "Maya Johnson",
    grade: "High School Senior, Texas",
    quote: "PathFinder showed me that Supply Chain Management exists — I had no idea it paid $98k starting. Now I'm at UT Austin doing exactly that.",
    rating: 5,
  },
  {
    name: "Carlos Reyes",
    grade: "Transfer Student, California",
    quote: "The cost calculator showed me I could transfer from community college to UCLA and save $45,000. Life-changing tool.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    grade: "High School Junior, New York",
    quote: "I was torn between pre-med and CS. The AI advisor helped me discover Biomedical Engineering — the perfect blend of both.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-bold text-gray-900 text-[15px]">PathFinder</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[["Majors", "/majors"], ["Universities", "/universities"], ["Careers", "/careers"], ["Calculator", "/calculator"]].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white" />
        <div className="absolute top-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-indigo-700 text-sm font-medium">AI-Powered Academic Guidance for US Students</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            Find Your{" "}
            <span className="text-indigo-600">Perfect Path</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Don&apos;t guess your future. Use data, AI, and expert knowledge to discover the right major,
            the right university, and the right career — tailored specifically to you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              href="/onboarding"
              className="flex items-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 group"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/majors"
              className="flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 rounded-xl font-semibold text-base border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              Explore Majors
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to{" "}
              <span className="text-indigo-600">decide with confidence</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Six powerful tools that answer every question you have about choosing a major and university.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer group h-full">
                    <div className={`w-10 h-10 rounded-lg ${feature.iconBg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                    <div className="flex items-center gap-1 mt-4 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Four steps to <span className="text-indigo-600">your future</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From profile to application in a structured, data-driven process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(100%-12px)] w-full h-px bg-gray-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center mb-5 shadow-md shadow-indigo-500/20">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Students love PathFinder
            </h2>
            <p className="text-indigo-200 text-lg max-w-xl mx-auto">
              Real stories from real students who found their path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-5 italic">&quot;{t.quote}&quot;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-indigo-200 text-xs mt-0.5">{t.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 text-xs font-semibold mb-8 uppercase tracking-widest">
            Powered by authoritative data sources
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              "U.S. Dept. of Education",
              "College Scorecard",
              "Bureau of Labor Statistics",
              "O*NET — Dept. of Labor",
              "IPEDS — NCES",
              "Common Data Set",
            ].map((source) => (
              <div
                key={source}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-600 text-xs font-medium">{source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to find your path?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students making smarter academic decisions. Free to start — no credit card required.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 group"
            >
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className="text-gray-400 text-sm mt-5">
              Free forever · No sign-up required · Data from official US sources
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
