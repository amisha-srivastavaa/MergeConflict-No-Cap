export type RiskLevel = "critical" | "high" | "medium" | "low" | "trusted";

export type VerificationStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface Repository {
  id: string;
  url: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  lastCommit: string;
  createdAt: string;
}

export interface ClaimedCapability {
  id: string;
  category: string;
  description: string;
  source: "readme" | "docs" | "manifest" | "package.json";
}

export interface DetectedBehavior {
  id: string;
  category: string;
  description: string;
  severity: RiskLevel;
  codeReference: string;
  line?: number;
}

export interface UndisclosedBehavior {
  id: string;
  description: string;
  severity: RiskLevel;
  codeReference: string;
  impact: string;
}

export interface ComparisonEntry {
  id: string;
  claimedCapability: string;
  detectedBehavior: string;
  match: "match" | "partial" | "mismatch" | "undisclosed";
  severity: RiskLevel;
  notes: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  stage: string;
  status: "completed" | "running" | "failed" | "pending";
  duration?: number;
  detail: string;
}

export interface Recommendation {
  id: string;
  severity: RiskLevel;
  title: string;
  description: string;
  action: string;
}

export interface TrustReport {
  id: string;
  repositoryId: string;
  repository: Repository;
  trustScore: number;
  riskLevel: RiskLevel;
  verdict: string;
  verdictSummary: string;
  aiExplanation: string;
  claimedCapabilities: ClaimedCapability[];
  detectedBehaviors: DetectedBehavior[];
  undisclosedBehaviors: UndisclosedBehavior[];
  comparisonTable: ComparisonEntry[];
  recommendations: Recommendation[];
  timeline: TimelineEvent[];
  createdAt: string;
  completedAt: string;
  analysisVersion: string;
}

export interface VerificationRequest {
  url: string;
  targetType: "github" | "mcp" | "plugin" | "skill";
  deep: boolean;
  includeDependencies: boolean;
}

export interface HistoryRecord {
  id: string;
  repository: Repository;
  trustScore: number;
  riskLevel: RiskLevel;
  status: VerificationStatus;
  createdAt: string;
  completedAt?: string;
  reportId?: string;
}

export interface AnalyticsSummary {
  totalVerifications: number;
  trustedCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  averageTrustScore: number;
  verificationsThisWeek: number;
  weekOverWeekChange: number;
}

export interface ChartDataPoint {
  date: string;
  verifications: number;
  trusted: number;
  critical: number;
}

// ─── Backend response types ────────────────────────────────────────

export interface BackendScanResponse {
  id: number;
  risk: number;
  status: string;
  claims: string[];
  behavior: string[];
  hidden_behaviors: string[];
  explanation: string;
}

export interface BackendHistoryItem {
  id: number;
  url: string | null;
  repo_name: string | null;
  target_type: string | null;
  risk_score: number;
  risk_level: string | null;
  status: string;
  explanation: string;
  claims: string[];
  behavior: string[];
  hidden_behaviors: string[];
  created_at: string | null;
}

export interface BackendAnalytics {
  totalScans: number;
  safeCount: number;
  mediumCount: number;
  highCount: number;
  averageRiskScore: number;
}

// ─── Adapter functions ─────────────────────────────────────────────

function mapRiskLevel(status: string | null): RiskLevel {
  switch (status?.toUpperCase()) {
    case "SAFE":
      return "trusted";
    case "MEDIUM":
      return "medium";
    case "HIGH":
      return "critical";
    default:
      return "medium";
  }
}

function parseRepoName(repoName: string | null): { owner: string; name: string } {
  if (!repoName || !repoName.includes("/")) {
    return { owner: "unknown", name: repoName ?? "unknown" };
  }
  const [owner, name] = repoName.split("/");
  return { owner, name };
}

export function backendItemToHistoryRecord(item: BackendHistoryItem): HistoryRecord {
  const { owner, name } = parseRepoName(item.repo_name);

  return {
    id: `scan-${item.id}`,
    repository: {
      id: `repo-${item.id}`,
      url: item.url ?? "",
      name,
      owner,
      description: "",
      stars: 0,
      forks: 0,
      language: "Unknown",
      lastCommit: item.created_at ?? new Date().toISOString(),
      createdAt: item.created_at ?? new Date().toISOString(),
    },
    trustScore: 100 - item.risk_score,
    riskLevel: mapRiskLevel(item.risk_level ?? item.status),
    status: "completed",
    createdAt: item.created_at ?? new Date().toISOString(),
    completedAt: item.created_at ?? new Date().toISOString(),
    reportId: `${item.id}`,
  };
}

export function backendItemToTrustReport(item: BackendHistoryItem): TrustReport {
  const { owner, name } = parseRepoName(item.repo_name);
  const riskLevel = mapRiskLevel(item.risk_level ?? item.status);
  const trustScore = 100 - item.risk_score;

  const claimedCapabilities: ClaimedCapability[] = item.claims
    .filter((c) => c.trim())
    .map((c, i) => ({
      id: `cc-${i}`,
      category: c.trim(),
      description: `Claimed capability: ${c.trim()}`,
      source: "readme" as const,
    }));

  const detectedBehaviors: DetectedBehavior[] = item.behavior
    .filter((b) => b.trim())
    .map((b, i) => ({
      id: `db-${i}`,
      category: b.trim(),
      description: `Detected behavior: ${b.trim()}`,
      severity: "trusted" as RiskLevel,
      codeReference: "source",
    }));

  const undisclosedBehaviors: UndisclosedBehavior[] = item.hidden_behaviors
    .filter((h) => h.trim())
    .map((h, i) => ({
      id: `ub-${i}`,
      description: `Undisclosed behavior: ${h.trim()}`,
      severity: riskLevel,
      codeReference: "detected via static analysis",
      impact: `${h.trim()} capability not mentioned in documentation`,
    }));

  const comparisonTable: ComparisonEntry[] = item.claims
    .filter((c) => c.trim())
    .map((c, i) => {
      const matchingBehavior = item.behavior.find(
        (b) => b.toLowerCase().trim() === c.toLowerCase().trim()
      );
      return {
        id: `ct-${i}`,
        claimedCapability: c.trim(),
        detectedBehavior: matchingBehavior?.trim() ?? "Not detected",
        match: matchingBehavior ? ("match" as const) : ("mismatch" as const),
        severity: matchingBehavior ? ("trusted" as RiskLevel) : ("medium" as RiskLevel),
        notes: matchingBehavior
          ? "Claimed capability matches detected behavior"
          : "Claimed capability not detected in code",
      };
    });

  // Add hidden behaviors as mismatches
  item.hidden_behaviors
    .filter((h) => h.trim())
    .forEach((h, i) => {
      comparisonTable.push({
        id: `ct-hidden-${i}`,
        claimedCapability: "Not claimed",
        detectedBehavior: h.trim(),
        match: "undisclosed",
        severity: riskLevel,
        notes: "Behavior detected in code but not mentioned in documentation",
      });
    });

  const recommendations: Recommendation[] = item.hidden_behaviors
    .filter((h) => h.trim())
    .map((h, i) => ({
      id: `rec-${i}`,
      severity: riskLevel,
      title: `Review undisclosed ${h.trim()} behavior`,
      description: `The tool uses ${h.trim()} capabilities that are not documented.`,
      action: `Audit the ${h.trim()} related code and document or remove it.`,
    }));

  let verdict = "Trusted";
  let verdictSummary = "No hidden capabilities detected. The tool operates within documented boundaries.";

  if (riskLevel === "critical" || riskLevel === "high") {
    verdict = "Critical Risk — Review Required";
    verdictSummary = `${item.hidden_behaviors.length} undisclosed behavior(s) detected. Immediate review recommended.`;
  } else if (riskLevel === "medium") {
    verdict = "Conditionally Trusted";
    verdictSummary = "Some behaviors are not mentioned in documentation. Review before deployment.";
  }

  return {
    id: `${item.id}`,
    repositoryId: `repo-${item.id}`,
    repository: {
      id: `repo-${item.id}`,
      url: item.url ?? "",
      name,
      owner,
      description: "",
      stars: 0,
      forks: 0,
      language: "Python",
      lastCommit: item.created_at ?? new Date().toISOString(),
      createdAt: item.created_at ?? new Date().toISOString(),
    },
    trustScore,
    riskLevel,
    verdict,
    verdictSummary,
    aiExplanation: item.explanation,
    claimedCapabilities,
    detectedBehaviors,
    undisclosedBehaviors,
    comparisonTable,
    recommendations,
    timeline: [
      {
        id: "tl-001",
        timestamp: item.created_at ?? new Date().toISOString(),
        stage: "Repository Fetch",
        status: "completed",
        duration: 2000,
        detail: "Fetched repository and source files",
      },
      {
        id: "tl-002",
        timestamp: item.created_at ?? new Date().toISOString(),
        stage: "Claim Extraction",
        status: "completed",
        duration: 3000,
        detail: `Extracted ${item.claims.length} claimed capabilities via LLM`,
      },
      {
        id: "tl-003",
        timestamp: item.created_at ?? new Date().toISOString(),
        stage: "Static Analysis",
        status: "completed",
        duration: 5000,
        detail: `Detected ${item.behavior.length} behaviors via AST analysis`,
      },
      {
        id: "tl-004",
        timestamp: item.created_at ?? new Date().toISOString(),
        stage: "Comparison",
        status: "completed",
        duration: 1000,
        detail: `Found ${item.hidden_behaviors.length} undisclosed behavior(s)`,
      },
      {
        id: "tl-005",
        timestamp: item.created_at ?? new Date().toISOString(),
        stage: "Risk Scoring",
        status: "completed",
        duration: 500,
        detail: `Risk score: ${item.risk_score}, Trust score: ${trustScore}`,
      },
    ],
    createdAt: item.created_at ?? new Date().toISOString(),
    completedAt: item.created_at ?? new Date().toISOString(),
    analysisVersion: "1.0.0",
  };
}

export function backendAnalyticsToSummary(data: BackendAnalytics): AnalyticsSummary {
  return {
    totalVerifications: data.totalScans,
    trustedCount: data.safeCount,
    criticalCount: data.highCount,
    highCount: 0,
    mediumCount: data.mediumCount,
    lowCount: 0,
    averageTrustScore: Math.round(100 - data.averageRiskScore),
    verificationsThisWeek: data.totalScans,
    weekOverWeekChange: 0,
  };
}
