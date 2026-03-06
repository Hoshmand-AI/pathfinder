"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap, BookOpen, Building2, Briefcase, Calculator,
  MessageCircle, ClipboardList, Menu, X, LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/majors", label: "Majors", icon: BookOpen },
  { href: "/universities", label: "Universities", icon: Building2 },
  { href: "/careers", label: "Careers", icon: Briefcase },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/chat", label: "AI Advisor", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = pathname === "/" || pathname === "/onboarding";
  if (isLanding) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <GraduationCap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-bold text-gray-900 text-[15px]">PathFinder</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/applications"
              className={cn(
                "hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
                pathname.startsWith("/applications")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <ClipboardList className="w-4 h-4" />
              Applications
            </Link>
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white border-b border-gray-100 shadow-lg px-4 py-3">
            {[...navLinks, { href: "/applications", label: "Applications", icon: ClipboardList }, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }].map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all",
                    active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
