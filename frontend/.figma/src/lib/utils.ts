import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "trusted": return "text-emerald-700";
    case "low": return "text-sky-700";
    case "medium": return "text-amber-700";
    case "high": return "text-orange-700";
    case "critical": return "text-red-700";
  }
}

export function riskLevelBg(level: RiskLevel): string {
  switch (level) {
    case "trusted": return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "low": return "bg-sky-50 text-sky-700 ring-sky-200";
    case "medium": return "bg-amber-50 text-amber-700 ring-amber-200";
    case "high": return "bg-orange-50 text-orange-700 ring-orange-200";
    case "critical": return "bg-red-50 text-red-700 ring-red-200";
  }
}

export function riskLevelDot(level: RiskLevel): string {
  switch (level) {
    case "trusted": return "bg-emerald-500";
    case "low": return "bg-sky-500";
    case "medium": return "bg-amber-500";
    case "high": return "bg-orange-500";
    case "critical": return "bg-red-500";
  }
}

export function trustScoreLabel(score: number): RiskLevel {
  if (score >= 85) return "trusted";
  if (score >= 70) return "low";
  if (score >= 50) return "medium";
  if (score >= 30) return "high";
  return "critical";
}

export function matchBadgeStyle(match: string): string {
  switch (match) {
    case "match": return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "partial": return "bg-amber-50 text-amber-700 ring-amber-200";
    case "mismatch": return "bg-red-50 text-red-700 ring-red-200";
    case "undisclosed": return "bg-zinc-100 text-zinc-600 ring-zinc-200";
    default: return "bg-zinc-100 text-zinc-600";
  }
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + "…" : str;
}
