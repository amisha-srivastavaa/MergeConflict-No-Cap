import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Search,
  Filter,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { historyApi } from "../../services/api";
import { Header } from "../../components/layout/Header";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { formatDateTime } from "../../lib/utils";
import type { VerificationStatus } from "../../types";

function StatusIcon({ status }: { status: VerificationStatus }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "failed") return <XCircle className="h-4 w-4 text-red-500" />;
  if (status === "running") return <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />;
  return <Clock className="h-4 w-4 text-zinc-400" />;
}

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: records, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: historyApi.getAll,
  });

  const filtered = records?.filter((r) => {
    const matchSearch =
      !search ||
      r.repository.name.toLowerCase().includes(search.toLowerCase()) ||
      r.repository.owner.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "all" || r.riskLevel === riskFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchRisk && matchStatus;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Verification History" description="All past and active verification runs" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search repositories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-36">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                <SelectValue placeholder="Risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All risks</SelectItem>
                <SelectItem value="trusted">Trusted</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Repository</th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Risk</th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide text-right">Score</th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Date</th>
                  <th className="py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                      <td colSpan={6} className="py-3 px-4">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))
                ) : filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-zinc-400">
                      No verifications match your filters
                    </td>
                  </tr>
                ) : (
                  filtered?.map((record) => (
                    <tr key={record.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium font-mono text-zinc-900">
                          {record.repository.owner}/{record.repository.name}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">{record.repository.language}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon status={record.status} />
                          <span className="text-sm text-zinc-600 capitalize">{record.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {record.status !== "running" && (
                          <Badge variant={record.riskLevel} className="capitalize">{record.riskLevel}</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {record.status === "completed" && (
                          <span className="text-sm font-bold tabular-nums text-zinc-800">
                            {record.trustScore}
                          </span>
                        )}
                        {record.status === "running" && (
                          <span className="text-xs text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-500">
                        {formatDateTime(record.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {record.reportId ? (
                          <Link to="/reports/$reportId" params={{ reportId: record.reportId }}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                              Report <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        ) : record.status === "running" ? (
                          <Button variant="ghost" size="sm" className="h-7 text-xs" disabled>
                            Running…
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>

          {filtered && (
            <p className="text-xs text-zinc-400 mt-3">
              Showing {filtered.length} of {records?.length ?? 0} verifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
