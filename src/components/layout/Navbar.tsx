"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/majors", label: "Majors" },
  { href: "/universities", label: "Universities" },
  { href: "/careers", label: "Careers" },
  { href: "/calculator", label: "Calculator" },
  { href: "/compare", label: "Compare" },
  { href: "/chat", label: "AI Advisor" },
];

const mobileExtra = [
  { href: "/applications", label: "Applications" },
  { href: "/parent", label: "Parent Dashboard" },
  { href: "/counselor", label: "Counselor Portal" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/" || pathname === "/onboarding") return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-bold text-gray-900 text-[15px]">PathFinder</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-2">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                    active
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/applications"
              className="hidden lg:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Applications
            </Link>
            <Link
              href="/onboarding"
              className="hidden sm:flex bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X className="w-5 h-5 text-gray-700" />
                : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1">
              {[...navLinks, ...mobileExtra].map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 pb-4">
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium text-center hover:bg-indigo-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
