import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FileText, ArrowRight, Star, GitFork } from "lucide-react";
import { reportsApi } from "../../services/api";
import { Header } from "../../components/layout/Header";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { TrustScoreRing } from "../../components/ui/trust-score-ring";
import { formatDate } from "../../lib/utils";

export default function ReportsListPage() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: reportsApi.getAll,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Trust Reports" description="AI-generated verification results" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            : reports?.map((report) => (
                <Card key={report.id} className="hover:border-zinc-300 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <TrustScoreRing score={report.trustScore} level={report.riskLevel} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <a
                              href={report.repository.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-zinc-900 hover:text-indigo-700 transition-colors font-mono"
                            >
                              {report.repository.owner}/{report.repository.name}
                            </a>
                            <Badge variant={report.riskLevel} className="capitalize">
                              {report.riskLevel}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-zinc-700 mb-1">{report.verdict}</p>
                          <p className="text-xs text-zinc-500 max-w-2xl line-clamp-2">
                            {report.verdictSummary}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {report.repository.stars.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {report.repository.forks.toLocaleString()}
                            </span>
                            <span>{report.repository.language}</span>
                            <span>{report.undisclosedBehaviors.length} undisclosed behavior{report.undisclosedBehaviors.length !== 1 ? "s" : ""}</span>
                            <span>Analyzed {formatDate(report.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Link to="/reports/$reportId" params={{ reportId: report.id }}>
                        <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          Full Report
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}

          {!isLoading && reports?.length === 0 && (
            <div className="text-center py-20">
              <FileText className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No trust reports yet</p>
              <Link to="/verify" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Start a verification</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
