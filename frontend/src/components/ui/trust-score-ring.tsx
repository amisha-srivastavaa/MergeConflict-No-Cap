import { cn, riskLevelColor } from "../../lib/utils";
import type { RiskLevel } from "../../types";

interface TrustScoreRingProps {
  score: number;
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { outer: 56, stroke: 5, fontSize: "text-lg", labelSize: "text-[9px]" },
  md: { outer: 80, stroke: 6, fontSize: "text-2xl", labelSize: "text-[10px]" },
  lg: { outer: 120, stroke: 8, fontSize: "text-4xl", labelSize: "text-xs" },
};

const colorMap: Record<RiskLevel, string> = {
  trusted: "#10b981",
  low: "#0ea5e9",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

export function TrustScoreRing({ score, level, size = "md", className }: TrustScoreRingProps) {
  const { outer, stroke, fontSize, labelSize } = sizeMap[size];
  const radius = (outer - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = colorMap[level];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={outer} height={outer} className="-rotate-90">
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          strokeWidth={stroke}
          stroke="currentColor"
          className="text-zinc-100"
          fill="none"
        />
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          strokeWidth={stroke}
          stroke={color}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-semibold tabular-nums", fontSize, riskLevelColor(level))}>
          {score}
        </span>
        <span className={cn("text-zinc-400 uppercase tracking-wide font-medium", labelSize)}>
          score
        </span>
      </div>
    </div>
  );
}
