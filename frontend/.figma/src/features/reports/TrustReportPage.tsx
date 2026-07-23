import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import {
  Star,
  GitFork,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Shield,
  FileCode2,
  Eye,
  EyeOff,
} from "lucide-react";
import { reportsApi } from "../../services/api";
import { Header } from "../../components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { TrustScoreRing } from "../../components/ui/trust-score-ring";
import { cn, formatDateTime, riskLevelBg, riskLevelDot, matchBadgeStyle } from "../../lib/utils";
import type { TimelineEvent, ComparisonEntry } from "../../types";

function MatchIcon({ match }: { match: string }) {
  if (match === "match") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (match === "partial") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  if (match === "mismatch") return <XCircle className="h-4 w-4 text-red-500" />;
  return <EyeOff className="h-4 w-4 text-zinc-400" />;
}

function TimelineRow({ event }: { event: TimelineEvent }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={cn(
          "h-2.5 w-2.5 rounded-full mt-1 shrink-0",
          event.status === "completed" ? "bg-emerald-500" : event.status === "failed" ? "bg-red-500" : "bg-amber-400"
        )} />
        <div className="flex-1 w-px bg-zinc-100 mt-1" />
      </div>
      <div className="pb-4 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-zinc-900">{event.stage}</span>
          {event.duration && (
            <span className="text-xs text-zinc-400 font-mono">{(event.duration / 1000).toFixed(1)}s</span>
          )}
        </div>
        <p className="text-xs text-zinc-500">{event.detail}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{formatDateTime(event.timestamp)}</p>
      </div>
    </div>
  );
}

function ComparisonRow({ entry }: { entry: ComparisonEntry }) {
  return (
    <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
      <td className="py-3 px-4 text-sm text-zinc-700 align-top">{entry.claimedCapability}</td>
      <td className="py-3 px-4 text-sm text-zinc-700 align-top">{entry.detectedBehavior}</td>
      <td className="py-3 px-4 align-top">
        <div className="flex items-center gap-1.5">
          <MatchIcon match={entry.match} />
          <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded ring-1 ring-inset capitalize", matchBadgeStyle(entry.match))}>
            {entry.match}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-xs text-zinc-500 align-top max-w-xs">{entry.notes}</td>
    </tr>
  );
}

export default function TrustReportPage() {
  const { reportId } = useParams({ from: "/app/reports/$reportId" });

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => reportsApi.getById(reportId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Header title="Trust Report" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Header title="Trust Report" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-zinc-600 mb-4">Report not found</p>
            <Link to="/reports">
              <Button variant="outline" size="sm">Back to reports</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const claimMatchCount = report.comparisonTable.filter((e) => e.match === "match").length;
  const claimTotal = report.comparisonTable.length;
  const analysisSeconds = Math.round(
    (new Date(report.completedAt).getTime() - new Date(report.createdAt).getTime()) / 1000
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Trust Report"
        description={`${report.repository.owner}/${report.repository.name}`}
        action={
          <Link to="/reports">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> All reports
            </Button>
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Report header */}
        <div className="border-b border-zinc-200 bg-white px-6 py-5">
          <div className="max-w-5xl mx-auto flex items-start justify-between gap-8">
            <div className="flex items-start gap-5">
              <TrustScoreRing score={report.trustScore} level={report.riskLevel} size="lg" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={report.repository.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-bold text-zinc-900 hover:text-indigo-700 transition-colors font-mono flex items-center gap-1.5"
                  >
                    {report.repository.owner}/{report.repository.name}
                    <ExternalLink className="h-4 w-4 opacity-50" />
                  </a>
                  <Badge variant={report.riskLevel} className="capitalize text-xs">
                    {report.riskLevel} risk
                  </Badge>
                </div>
                <p className="text-base font-semibold text-zinc-800 mb-1">{report.verdict}</p>
                <p className="text-sm text-zinc-500 max-w-xl leading-relaxed">{report.verdictSummary}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" />{report.repository.stars.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{report.repository.forks.toLocaleString()}</span>
                  <span>{report.repository.language}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Analyzed in {analysisSeconds}s</span>
                  <span>Engine v{report.analysisVersion}</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="shrink-0 grid grid-cols-2 gap-3">
              {[
                { label: "Claimed", value: report.claimedCapabilities.length, icon: FileCode2, color: "text-zinc-700" },
                { label: "Detected", value: report.detectedBehaviors.length, icon: Eye, color: "text-zinc-700" },
                { label: "Matched", value: claimMatchCount + "/" + claimTotal, icon: CheckCircle2, color: "text-emerald-600" },
                { label: "Undisclosed", value: report.undisclosedBehaviors.length, icon: EyeOff, color: report.undisclosedBehaviors.length > 0 ? "text-red-600" : "text-zinc-700" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-center">
                  <Icon className={cn("h-3.5 w-3.5 mx-auto mb-1", color)} />
                  <p className={cn("text-base font-bold tabular-nums", color)}>{value}</p>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-6">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="behaviors">Behaviors</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              {/* OVERVIEW TAB */}
              <TabsContent value="overview" className="space-y-5">
                {/* AI Explanation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-700 leading-relaxed">{report.aiExplanation}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-5">
                  {/* Claimed capabilities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileCode2 className="h-4 w-4 text-zinc-400" />
                        Claimed Capabilities
                      </CardTitle>
                      <CardDescription>From documentation and manifest</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2.5">
                        {report.claimedCapabilities.map((cap) => (
                          <li key={cap.id} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-zinc-300 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{cap.category}</span>
                              <p className="text-sm text-zinc-700">{cap.description}</p>
                              <Badge variant="outline" className="mt-1 text-[10px]">{cap.source}</Badge>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Detected behaviors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-zinc-400" />
                        Detected Behaviors
                      </CardTitle>
                      <CardDescription>From static code analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2.5">
                        {report.detectedBehaviors.map((beh) => (
                          <li key={beh.id} className="flex items-start gap-2">
                            <span className={cn("h-2 w-2 rounded-full shrink-0 mt-1.5", riskLevelDot(beh.severity))} />
                            <div>
                              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{beh.category}</span>
                              <p className="text-sm text-zinc-700">{beh.description}</p>
                              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{beh.codeReference}{beh.line ? `:${beh.line}` : ""}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Undisclosed behaviors */}
                {report.undisclosedBehaviors.length > 0 && (
                  <Card className={cn(report.undisclosedBehaviors.some(u => u.severity === "critical") && "border-red-200")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700">
                        <EyeOff className="h-4 w-4" />
                        Undisclosed Behaviors
                        <Badge variant="critical" className="ml-1">{report.undisclosedBehaviors.length} found</Badge>
                      </CardTitle>
                      <CardDescription>Behaviors present in code but absent from documentation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.undisclosedBehaviors.map((ub) => (
                          <div key={ub.id} className={cn("rounded-lg border p-4", riskLevelBg(ub.severity).replace("text-", "border-").split(" ")[0], "bg-white border-zinc-200")}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-medium text-zinc-900">{ub.description}</p>
                                <p className="text-xs text-zinc-500 mt-1">{ub.impact}</p>
                                <p className="text-[11px] text-zinc-400 font-mono mt-1.5">{ub.codeReference}</p>
                              </div>
                              <Badge variant={ub.severity} className="shrink-0 capitalize">{ub.severity}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* BEHAVIORS TAB */}
              <TabsContent value="behaviors" className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {report.detectedBehaviors.map((beh) => (
                    <Card key={beh.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{beh.category}</span>
                          <Badge variant={beh.severity} className="capitalize shrink-0">{beh.severity}</Badge>
                        </div>
                        <p className="text-sm text-zinc-800 mb-2">{beh.description}</p>
                        <p className="text-xs font-mono text-zinc-400">{beh.codeReference}{beh.line ? `:${beh.line}` : ""}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* COMPARISON TAB */}
              <TabsContent value="comparison">
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Claimed vs Detected Comparison</CardTitle>
                    <CardDescription>
                      {claimMatchCount} of {claimTotal} claims matched — {report.comparisonTable.filter(e => e.match === "mismatch").length} mismatches detected
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-left">
                      <thead className="border-b border-zinc-200 bg-zinc-50">
                        <tr>
                          <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Claimed</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Detected</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Match</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.comparisonTable.map((entry) => (
                          <ComparisonRow key={entry.id} entry={entry} />
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* RECOMMENDATIONS TAB */}
              <TabsContent value="recommendations" className="space-y-3">
                {report.recommendations.map((rec) => (
                  <Card key={rec.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {rec.severity === "critical" ? (
                          <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        ) : rec.severity === "high" ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        ) : (
                          <Shield className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-zinc-900">{rec.title}</p>
                            <Badge variant={rec.severity} className="capitalize">{rec.severity}</Badge>
                          </div>
                          <p className="text-sm text-zinc-600 mb-2">{rec.description}</p>
                          <div className="rounded-md bg-zinc-50 border border-zinc-200 px-3 py-2">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-0.5">Action</p>
                            <p className="text-xs font-mono text-zinc-700">{rec.action}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* TIMELINE TAB */}
              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-zinc-400" />
                      Verification Timeline
                    </CardTitle>
                    <CardDescription>
                      Analysis completed in {analysisSeconds}s — {formatDateTime(report.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      {report.timeline.map((event) => (
                        <TimelineRow key={event.id} event={event} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
