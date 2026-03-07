import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "PathFinder — Data-Driven Academic Guidance",
  description: "Make smarter decisions about your future. Data-driven guidance for choosing the right major, university, and career path.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FDFCFA] text-[#6B6359] antialiased" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
