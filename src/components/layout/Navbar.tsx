"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/majors",       label: "Majors" },
  { href: "/universities", label: "Universities" },
  { href: "/careers",      label: "Careers" },
  { href: "/calculator",   label: "Calculator" },
  { href: "/chat",         label: "AI Advisor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHidden = pathname === "/" || pathname === "/onboarding";
  if (isHidden) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0F2140]">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo + nav links */}
          <div className="flex items-center gap-9">
            <Link href="/dashboard" className="font-serif text-xl text-white tracking-tight">
              PathFinder
            </Link>
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map(({ href, label }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "text-[13.5px] font-medium pb-[18px] pt-[18px] border-b-2 transition-colors duration-150",
                      active
                        ? "text-white border-[#C8963E]"
                        : "text-white/55 border-transparent hover:text-white/90"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
              <Link
                href="/applications"
                className={cn(
                  "text-[13.5px] font-medium pb-[18px] pt-[18px] border-b-2 transition-colors duration-150",
                  pathname.startsWith("/applications")
                    ? "text-white border-[#C8963E]"
                    : "text-white/55 border-transparent hover:text-white/90"
                )}
              >
                Applications
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/dashboard"
              className="text-[13.5px] font-medium text-white/60 hover:text-white/90 transition-colors duration-150"
            >
              Dashboard
            </Link>
            <Link
              href="/onboarding"
              className="bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-[13px] font-semibold px-[18px] py-[7px] rounded-md transition-colors duration-150"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-[#0F2140] px-6 py-4 space-y-1">
            {[...navLinks, { href: "/applications", label: "Applications" }, { href: "/dashboard", label: "Dashboard" }].map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block py-3 text-sm font-medium border-b border-white/10 transition-colors duration-150",
                    active ? "text-white" : "text-white/60 hover:text-white/90"
                  )}
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-3">
              <Link
                href="/onboarding"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-[#C8963E] hover:bg-[#D4A94F] text-[#0A1628] text-sm font-semibold px-4 py-2.5 rounded-md transition-colors duration-150"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
