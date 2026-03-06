import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "PathFinder — Your AI Academic Navigator",
  description: "Discover your perfect major, find the right university, and plan your academic future with AI-powered guidance tailored to you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
