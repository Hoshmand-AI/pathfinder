"use client";
import Link from "next/link";
import {
  GraduationCap, ArrowRight, Sparkles, BookOpen, University,
  BarChart3, Calculator, MessageCircle, ClipboardList, CheckCircle2,
  TrendingUp, Users, Star, ChevronRight, Shield, Zap, Globe
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
    color: "from-blue-500 to-blue-600",
    href: "/majors",
  },
  {
    icon: University,
    title: "University Finder",
    description: "Filter 4,000+ schools by major, location, cost, acceptance rate, and your academic profile.",
    color: "from-violet-500 to-violet-600",
    href: "/universities",
  },
  {
    icon: Calculator,
    title: "Cost Calculator",
    description: "See the real 4-year cost with financial aid, compare ROI, and plan for loan repayment.",
    color: "from-emerald-500 to-emerald-600",
    href: "/calculator",
  },
  {
    icon: MessageCircle,
    title: "AI Chat Advisor",
    description: "Ask anything — available 24/7. Get personalized advice tailored to your unique profile.",
    color: "from-orange-500 to-orange-600",
    href: "/chat",
  },
  {
    icon: BarChart3,
    title: "Career Paths",
    description: "Visualize where any major leads — real job titles, salaries, growth rates, and top employers.",
    color: "from-pink-500 to-pink-600",
    href: "/careers",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description: "Manage your college list, track deadlines, and organize every step of the application process.",
    color: "from-teal-500 to-teal-600",
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">PathFinder</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[["Majors", "/majors"], ["Universities", "/universities"], ["Careers", "/careers"], ["Calculator", "/calculator"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden md:block text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-medium">AI-Powered Academic Guidance for US Students</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
            Find Your
            <span className="block gradient-text">Perfect Path</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Don&apos;t guess your future. Use data, AI, and expert knowledge to discover the right major, the right university, and the right career — tailored specifically to you.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/onboarding"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-violet-700 transition-all shadow-xl shadow-blue-500/30 group"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/majors"
              className="flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
            >
              Explore Majors
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-3xl font-black gradient-text mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Decide with Confidence</span>
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
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
                    <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ChevronRight className="w-4 h-4" />
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
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Four Steps to <span className="gradient-text">Your Future</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              From profile to application in a structured, data-driven process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25">
                    <span className="text-white font-black text-xl">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Students Love PathFinder
            </h2>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">
              Real stories from real students who found their path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white leading-relaxed mb-5 text-sm italic">&quot;{t.quote}&quot;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-blue-300 text-xs">{t.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 text-sm font-medium mb-8 uppercase tracking-wider">
            Powered by Authoritative Data Sources
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
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
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
              >
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 text-sm font-medium">{source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-12 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Find Your Path?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students making smarter academic decisions. It&apos;s free to start — no credit card required.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-violet-600 transition-all shadow-xl shadow-blue-500/30 group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Free forever • No sign-up required • Data from official US sources
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
