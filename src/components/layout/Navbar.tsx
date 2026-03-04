"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap, LayoutDashboard, BookOpen, University, BarChart3,
  Calculator, MessageCircle, ClipboardList, Users, UserCheck,
  ChevronLeft, ChevronRight, Menu, X, Bookmark, Scale, Briefcase,
  Settings, Bell, LogOut, Search
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/majors", label: "Explore Majors", icon: BookOpen },
  { href: "/universities", label: "Universities", icon: University },
  { href: "/careers", label: "Career Paths", icon: Briefcase },
  { href: "/compare", label: "Compare Schools", icon: Scale },
  { href: "/calculator", label: "Cost Calculator", icon: Calculator },
  { href: "/chat", label: "AI Advisor", icon: MessageCircle },
  { href: "/applications", label: "My Applications", icon: ClipboardList },
];

const portalItems = [
  { href: "/parent", label: "Parent Dashboard", icon: Users },
  { href: "/counselor", label: "Counselor Portal", icon: UserCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, onboardingComplete } = useAppStore();

  const isLanding = pathname === "/" || pathname === "/onboarding";
  if (isLanding) return null;

  const initials = profile.firstName
    ? `${profile.firstName[0]}${profile.lastName?.[0] ?? ""}`.toUpperCase()
    : "S";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/10", collapsed && "justify-center px-3")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-lg leading-none">PathFinder</span>
            <p className="text-blue-300 text-xs mt-0.5">Academic Navigator</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {/* Main nav */}
        <div className="mb-6">
          {!collapsed && <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Navigate</p>}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 group",
                  collapsed ? "justify-center" : "",
                  active
                    ? "bg-white/15 text-white"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-white" : "text-blue-300 group-hover:text-white")} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {!collapsed && active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Portals */}
        <div>
          {!collapsed && <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Portals</p>}
          {portalItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150 group",
                  collapsed ? "justify-center" : "",
                  active
                    ? "bg-white/15 text-white"
                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-white" : "text-blue-300 group-hover:text-white")} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className={cn("border-t border-white/10 p-3", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition-all">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {profile.firstName ? `${profile.firstName} ${profile.lastName}` : "Student"}
              </p>
              <p className="text-blue-300 text-xs truncate">{profile.grade || "High School"}</p>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40 transition-all duration-300",
          "bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a]",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-50"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-gray-600" /> : <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />}
        </button>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">PathFinder</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 h-full bg-gradient-to-b from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a] shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
