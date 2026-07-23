import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  Activity,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { analyticsApi, historyApi } from "../../services/api";
import { Header } from "../../components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { formatRelativeTime } from "../../lib/utils";
import type { RiskLevel } from "../../types";

const PIE_COLORS: Record<RiskLevel, string> = {
  trusted: "#10b981",
  low: "#0ea5e9",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

export default function OverviewPage() {
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: analyticsApi.getSummary,
  });

  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: ["chart"],
    queryFn: analyticsApi.getChartData,
  });

  const { data: history, isLoading: loadingHistory } = useQuery({
    queryKey: ["history"],
    queryFn: historyApi.getAll,
  });

  const pieData = analytics
    ? [
        { name: "Trusted", value: analytics.trustedCount, level: "trusted" as RiskLevel },
        { name: "Low", value: analytics.lowCount, level: "low" as RiskLevel },
        { name: "Medium", value: analytics.mediumCount, level: "medium" as RiskLevel },
        { name: "High", value: analytics.highCount, level: "high" as RiskLevel },
        { name: "Critical", value: analytics.criticalCount, level: "critical" as RiskLevel },
      ]
    : [];

  const recentHistory = history?.slice(0, 5) ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Overview"
        description="Trust verification activity and analytics"
        action={
          <Link to="/verify">
            <Button variant="primary" size="sm" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              New Verification
            </Button>
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {loadingAnalytics ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : analytics ? (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-500">Total Verified</span>
                    <Activity className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 tabular-nums">
                    {analytics.totalVerifications.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    <TrendingUp className="inline h-3 w-3 text-emerald-500 mr-0.5" />
                    +{analytics.weekOverWeekChange}% this week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-500">Avg Trust Score</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 tabular-nums">
                    {analytics.averageTrustScore}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">Across all repositories</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-500">Critical Findings</span>
                    <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                  </div>
                  <p className="text-2xl font-bold text-red-600 tabular-nums">
                    {analytics.criticalCount}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">Require immediate action</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-zinc-500">This Week</span>
                    <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                  <p className="text-2xl font-bold text-zinc-900 tabular-nums">
                    {analytics.verificationsThisWeek}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">Verifications run</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Verification Activity</CardTitle>
              <CardDescription>Daily verifications over the past 3 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingChart ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradVerif" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradCrit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid #e4e4e7" }}
                      labelStyle={{ color: "#18181b", fontWeight: 500 }}
                    />
                    <Area type="monotone" dataKey="verifications" stroke="#6366f1" strokeWidth={2} fill="url(#gradVerif)" name="Verifications" />
                    <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={1.5} fill="url(#gradCrit)" name="Critical" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
              <CardDescription>By risk level across all verifications</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {loadingAnalytics ? (
                <Skeleton className="h-40 w-40 rounded-full" />
              ) : (
                <>
                  <PieChart width={140} height={140}>
                    <Pie
                      data={pieData}
                      cx={65}
                      cy={65}
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.level} fill={PIE_COLORS[entry.level]} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
                    {pieData.map((entry) => (
                      <div key={entry.level} className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-sm"
                          style={{ backgroundColor: PIE_COLORS[entry.level] }}
                        />
                        <span className="text-xs text-zinc-500 capitalize">{entry.name}</span>
                        <span className="ml-auto text-xs font-medium text-zinc-700 tabular-nums">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-0">
            <div>
              <CardTitle>Recent Verifications</CardTitle>
              <CardDescription>Latest verification runs</CardDescription>
            </div>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {loadingHistory ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {recentHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {record.riskLevel === "critical" ? (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">
                          {record.repository.owner}/{record.repository.name}
                        </p>
                        <p className="text-xs text-zinc-400">{formatRelativeTime(record.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={record.riskLevel} className="capitalize">
                        {record.riskLevel}
                      </Badge>
                      <span className="text-sm font-semibold tabular-nums text-zinc-700 w-6 text-right">
                        {record.status === "running" ? "—" : record.trustScore}
                      </span>
                      {record.reportId && (
                        <Link to="/reports/$reportId" params={{ reportId: record.reportId }}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                            Report <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
