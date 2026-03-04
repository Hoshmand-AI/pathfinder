import Link from "next/link";
import { GraduationCap, Twitter, Linkedin, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">PathFinder</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Helping students across America find their perfect path — from choosing a major to selecting the right university.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3">
              {[
                ["Majors & Degrees", "/majors"],
                ["Universities", "/universities"],
                ["Career Paths", "/careers"],
                ["Compare Schools", "/compare"],
                ["Cost Calculator", "/calculator"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Tools</h4>
            <ul className="space-y-3">
              {[
                ["AI Advisor Chat", "/chat"],
                ["Application Tracker", "/applications"],
                ["Student Dashboard", "/dashboard"],
                ["Parent Dashboard", "/parent"],
                ["Counselor Portal", "/counselor"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {[
                ["How It Works", "#"],
                ["Financial Aid Guide", "#"],
                ["Scholarship Finder", "#"],
                ["Application Timeline", "#"],
                ["Blog & Articles", "#"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PathFinder. All rights reserved. Data sourced from College Scorecard, BLS, and O*NET.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
