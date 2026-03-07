import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0F2140]">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-6 border-b border-white/8">
          {/* Brand */}
          <div>
            <div className="font-serif text-[18px] text-white mb-2">PathFinder</div>
            <p className="text-[13px] text-white/40 leading-relaxed">
              Data-driven academic guidance for every student. Built by Hoshmand AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-3">Product</h4>
            <div className="space-y-2">
              {[
                ["Majors", "/majors"],
                ["Universities", "/universities"],
                ["Careers", "/careers"],
                ["Calculator", "/calculator"],
                ["AI Advisor", "/chat"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="block text-[13px] text-white/55 hover:text-white/85 transition-colors duration-150">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-3">Company</h4>
            <div className="space-y-2">
              {[
                ["About Hoshmand AI", "#"],
                ["Privacy Policy", "#"],
                ["Terms of Service", "#"],
                ["Contact", "#"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="block text-[13px] text-white/55 hover:text-white/85 transition-colors duration-150">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4">
          <span className="text-[12px] text-white/25">© 2026 Hoshmand AI. All rights reserved.</span>
          <span className="text-[12px] text-white/25">Built with ♥ in Virginia</span>
        </div>
      </div>
    </footer>
  );
}
