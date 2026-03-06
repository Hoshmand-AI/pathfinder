"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  GraduationCap, ArrowRight, BookOpen, Building2,
  BarChart3, Calculator, MessageCircle, ClipboardList,
  TrendingUp, Star, ChevronRight, Shield, Zap,
  CheckCircle, Users, Award, Target
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const stats = [
  { value: "4,000+", label: "Universities" },
  { value: "500+", label: "Majors" },
  { value: "800+", label: "Careers" },
  { value: "Free", label: "To Start" },
];

const features = [
  {
    icon: BookOpen,
    title: "Major Explorer",
    description: "Browse 500+ majors with real salary data, job outlook, and career paths.",
    href: "/majors",
    accent: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: Building2,
    title: "University Finder",
    description: "Filter 4,000+ schools by major, cost, acceptance rate, and fit.",
    href: "/universities",
    accent: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    icon: Calculator,
    title: "Cost Calculator",
    description: "See your real 4-year cost with financial aid and ROI projections.",
    href: "/calculator",
    accent: "#059669",
    bg: "#ECFDF5",
  },
  {
    icon: MessageCircle,
    title: "AI Advisor",
    description: "Ask anything, 24/7. Personalized advice tailored to your profile.",
    href: "/chat",
    accent: "#EA580C",
    bg: "#FFF7ED",
  },
  {
    icon: BarChart3,
    title: "Career Paths",
    description: "Visualize where any major leads — salaries, growth, top employers.",
    href: "/careers",
    accent: "#DB2777",
    bg: "#FDF2F8",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description: "Manage your college list, deadlines, and every application step.",
    href: "/applications",
    accent: "#0891B2",
    bg: "#ECFEFF",
  },
];

const steps = [
  { num: "01", title: "Build Your Profile", desc: "GPA, test scores, interests, budget — 5 minutes." },
  { num: "02", title: "Get Matched", desc: "AI recommendations for majors and universities." },
  { num: "03", title: "Compare & Decide", desc: "Side-by-side cost, outcomes, and admission chances." },
  { num: "04", title: "Apply with Confidence", desc: "Track every deadline and submit your best applications." },
];

const testimonials = [
  {
    quote: "PathFinder showed me Supply Chain Management exists — $98k starting. Now I'm at UT Austin doing exactly that.",
    name: "Maya Johnson",
    role: "UT Austin, Class of 2026",
  },
  {
    quote: "The cost calculator showed I could transfer from community college to UCLA and save $45,000.",
    name: "Carlos Reyes",
    role: "UCLA Transfer Student",
  },
  {
    quote: "I was torn between pre-med and CS. The AI advisor helped me discover Biomedical Engineering.",
    name: "Aisha Patel",
    role: "Johns Hopkins, Class of 2027",
  },
];

const sources = [
  "U.S. Dept. of Education",
  "College Scorecard",
  "Bureau of Labor Statistics",
  "O*NET — Dept. of Labor",
  "IPEDS — NCES",
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 60,
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
        transition: "all 0.2s ease",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", letterSpacing: "-0.3px" }}>PathFinder</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[["Majors", "/majors"], ["Universities", "/universities"], ["Careers", "/careers"], ["Calculator", "/calculator"]].map(([label, href]) => (
              <Link key={href} href={href} style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: "#4B5563", textDecoration: "none", transition: "all 0.15s",
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "#111827"; (e.target as HTMLElement).style.background = "#F3F4F6"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "#4B5563"; (e.target as HTMLElement).style.background = "transparent"; }}
              >{label}</Link>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: "#4B5563", textDecoration: "none" }}>Sign In</Link>
            <Link href="/onboarding" style={{
              background: "#0F172A", color: "white", padding: "8px 18px",
              borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: "none",
              letterSpacing: "-0.2px", transition: "background 0.15s",
            }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        paddingTop: 140, paddingBottom: 100,
        background: "#FAFAFA",
        borderBottom: "1px solid #E5E7EB",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }} />

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "white", border: "1px solid #E5E7EB",
            borderRadius: 999, padding: "6px 14px", marginBottom: 32,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>AI-Powered Academic Guidance for US Students</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(48px, 7vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2.5px",
            color: "#0F172A",
            marginBottom: 24,
          }}>
            Find Your{" "}
            <span style={{
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Perfect Path</span>
          </h1>

          <p style={{
            fontSize: 19, color: "#6B7280", lineHeight: 1.65,
            maxWidth: 560, margin: "0 auto 40px",
            fontWeight: 400,
          }}>
            Don't guess your future. Use data, AI, and expert knowledge to discover the right major, university, and career — tailored to you.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 64 }}>
            <Link href="/onboarding" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#0F172A", color: "white",
              padding: "14px 28px", borderRadius: 12,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              letterSpacing: "-0.3px",
              boxShadow: "0 4px 16px rgba(15,23,42,0.25)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}>
              Start for Free <ArrowRight size={16} />
            </Link>
            <Link href="/majors" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "white", color: "#374151",
              padding: "14px 28px", borderRadius: 12,
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              Explore Majors <ChevronRight size={16} color="#9CA3AF" />
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
            maxWidth: 620, margin: "0 auto",
          }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                padding: "18px 12px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                <div style={{
                  fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px",
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", marginBottom: 4,
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "96px 24px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", color: "#2563EB", textTransform: "uppercase", marginBottom: 12 }}>EVERYTHING YOU NEED</p>
            <h2 style={{
              fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800,
              letterSpacing: "-1.5px", color: "#0F172A", marginBottom: 16,
            }}>
              Six tools. One platform.
            </h2>
            <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 480, margin: "0 auto" }}>
              Every answer you need to choose a major and university — all in one place.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link key={f.title} href={f.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: 18,
                    padding: "28px 28px 24px",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    height: "100%",
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = f.accent;
                      el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.08)`;
                      el.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "#E5E7EB";
                      el.style.boxShadow = "none";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: 12,
                      background: f.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 18,
                    }}>
                      <Icon size={22} color={f.accent} />
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.3px" }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{f.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16, color: f.accent, fontSize: 13, fontWeight: 600 }}>
                      Explore <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "96px 24px", background: "#FAFAFA", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", color: "#7C3AED", textTransform: "uppercase", marginBottom: 12 }}>HOW IT WORKS</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0F172A" }}>
              Four steps to your future
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ position: "relative" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: i % 2 === 0 ? "#0F172A" : "white",
                  border: i % 2 === 0 ? "none" : "2px solid #E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                  boxShadow: i % 2 === 0 ? "0 4px 14px rgba(15,23,42,0.2)" : "none",
                }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: i % 2 === 0 ? "white" : "#9CA3AF", letterSpacing: "-0.5px" }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.3px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "96px 24px", background: "#0F172A" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", color: "#60A5FA", textTransform: "uppercase", marginBottom: 12 }}>STUDENT STORIES</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-1.5px", color: "white" }}>
              Real students. Real results.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 18, padding: 28,
              }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} color="#FBBF24" fill="#FBBF24" />)}
                </div>
                <p style={{ fontSize: 15, color: "#D1D5DB", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                  "{t.quote}"
                </p>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{t.name}</p>
                  <p style={{ fontSize: 13, color: "#6B7280" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ padding: "48px 24px", background: "white", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24 }}>
            DATA FROM AUTHORITATIVE SOURCES
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {sources.map((s) => (
              <div key={s} style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: 8, padding: "8px 14px",
              }}>
                <Shield size={13} color="#22C55E" />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "96px 24px", background: "#FAFAFA" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            background: "#0F172A",
            borderRadius: 24, padding: "56px 48px",
            boxShadow: "0 32px 80px rgba(15,23,42,0.25)",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <Zap size={26} color="white" />
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800,
              color: "white", letterSpacing: "-1px", marginBottom: 16,
            }}>
              Ready to find your path?
            </h2>
            <p style={{ fontSize: 16, color: "#9CA3AF", marginBottom: 32, lineHeight: 1.6 }}>
              Join thousands of students making smarter academic decisions. Free to start — no credit card required.
            </p>
            <Link href="/onboarding" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "white", color: "#0F172A",
              padding: "14px 32px", borderRadius: 12,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              letterSpacing: "-0.3px",
            }}>
              Start Your Journey <ArrowRight size={16} />
            </Link>
            <p style={{ fontSize: 13, color: "#4B5563", marginTop: 16 }}>
              Free forever · No sign-up required · Official US data
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
