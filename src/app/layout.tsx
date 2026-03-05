import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
