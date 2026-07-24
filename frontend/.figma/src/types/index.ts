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
