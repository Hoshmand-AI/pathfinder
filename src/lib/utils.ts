import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1000) {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    return `$${(amount / 1000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatGrowth(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}

export function getGrowthColor(value: number): string {
  if (value >= 10) return "text-emerald-600";
  if (value >= 5) return "text-green-600";
  if (value >= 0) return "text-yellow-600";
  return "text-red-500";
}

export function getAcceptanceLabel(rate: number): { label: string; color: string } {
  if (rate < 0.1) return { label: "Most Selective", color: "text-red-600 bg-red-50" };
  if (rate < 0.2) return { label: "Highly Selective", color: "text-orange-600 bg-orange-50" };
  if (rate < 0.4) return { label: "Selective", color: "text-yellow-600 bg-yellow-50" };
  if (rate < 0.6) return { label: "Moderately Selective", color: "text-blue-600 bg-blue-50" };
  return { label: "Open Admission", color: "text-green-600 bg-green-50" };
}

export function admissionChance(
  schoolRate: number,
  satRange: [number, number],
  studentSat: number
): { label: string; color: string; percent: number } {
  if (!studentSat) return { label: "Unknown", color: "text-gray-500", percent: 0 };

  const midSat = (satRange[0] + satRange[1]) / 2;
  const diff = studentSat - midSat;
  let chance = schoolRate * 100;

  if (diff > 100) chance = Math.min(chance * 2, 85);
  else if (diff > 0) chance = Math.min(chance * 1.4, 70);
  else if (diff < -100) chance = chance * 0.3;
  else if (diff < 0) chance = chance * 0.7;

  if (chance >= 60) return { label: "High Chance", color: "text-emerald-600", percent: chance };
  if (chance >= 30) return { label: "Good Chance", color: "text-blue-600", percent: chance };
  if (chance >= 15) return { label: "Low Chance", color: "text-yellow-600", percent: chance };
  return { label: "Reach School", color: "text-red-500", percent: chance };
}

export function calculateROI(
  totalCost: number,
  avgSalary: number,
  years = 10
): number {
  const totalEarnings = avgSalary * years;
  return ((totalEarnings - totalCost) / totalCost) * 100;
}

export function getSchoolPriority(
  acceptanceRate: number,
  studentGpa: number,
  studentSat: number,
  satRange: [number, number]
): "Reach" | "Match" | "Safety" {
  const satMid = (satRange[0] + satRange[1]) / 2;
  const satDiff = studentSat - satMid;
  if (acceptanceRate < 0.15 || satDiff < -100) return "Reach";
  if (acceptanceRate > 0.5 && satDiff > 50) return "Safety";
  return "Match";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen)}...`;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export const CATEGORY_COLORS: Record<string, string> = {
  STEM: "bg-blue-100 text-blue-700",
  Business: "bg-amber-100 text-amber-700",
  "Health & Medicine": "bg-red-100 text-red-700",
  "Arts & Humanities": "bg-purple-100 text-purple-700",
  "Social Sciences": "bg-teal-100 text-teal-700",
  Education: "bg-green-100 text-green-700",
  "Law & Policy": "bg-indigo-100 text-indigo-700",
  "Creative Arts": "bg-pink-100 text-pink-700",
  Environmental: "bg-emerald-100 text-emerald-700",
};

export const STATE_ABBREVIATIONS: Record<string, string> = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY", "Washington D.C.": "DC",
};
