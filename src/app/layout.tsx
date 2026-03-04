import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "PathFinder — Your AI Academic Navigator",
  description:
    "Discover your perfect major, find the right university, and plan your academic future with AI-powered guidance tailored to you.",
  keywords: "college, university, major, career, academic advisor, AI, financial aid, scholarships",
  openGraph: {
    title: "PathFinder — Your AI Academic Navigator",
    description: "AI-powered academic guidance for high school and college students across America.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
