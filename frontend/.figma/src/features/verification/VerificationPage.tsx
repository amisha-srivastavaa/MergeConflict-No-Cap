import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Cpu,
  Puzzle,
  Layers,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Info,
  GitBranch,
} from "lucide-react";
import ReactFlow, { Background, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";
import { verificationApi } from "../../services/api";
import { Header } from "../../components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Progress } from "../../components/ui/progress";
import { cn } from "../../lib/utils";

const schema = z.object({
  url: z.string().url("Enter a valid URL"),
  targetType: z.enum(["github", "mcp", "plugin", "skill"]),
  deep: z.boolean(),
  includeDependencies: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const TARGET_TYPES = [
  { value: "github", label: "GitHub Repo", icon: GitBranch, description: "Any public GitHub repository" },
  { value: "mcp", label: "MCP Server", icon: Cpu, description: "Model Context Protocol server" },
  { value: "plugin", label: "AI Plugin", icon: Puzzle, description: "ChatGPT or similar plugin" },
  { value: "skill", label: "Agent Skill", icon: Layers, description: "Claude or agent skill package" },
] as const;

const PIPELINE_NODES: Node[] = [
  { id: "1", type: "default", position: { x: 0, y: 60 }, data: { label: "Repository Fetch" }, style: { background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: 12, padding: "6px 12px" } },
  { id: "2", type: "default", position: { x: 180, y: 0 }, data: { label: "Documentation Parse" }, style: { background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: 12, padding: "6px 12px" } },
  { id: "3", type: "default", position: { x: 180, y: 120 }, data: { label: "Static Analysis" }, style: { background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: 12, padding: "6px 12px" } },
  { id: "4", type: "default", position: { x: 360, y: 0 }, data: { label: "Network Behavior" }, style: { background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: 12, padding: "6px 12px" } },
  { id: "5", type: "default", position: { x: 360, y: 120 }, data: { label: "Permission Mapping" }, style: { background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: 12, padding: "6px 12px" } },
  { id: "6", type: "default", position: { x: 540, y: 60 }, data: { label: "Semantic Comparison" }, style: { background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8, fontSize: 12, padding: "6px 12px", color: "#4338ca" } },
  { id: "7", type: "default", position: { x: 720, y: 60 }, data: { label: "Trust Score + Report" }, style: { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12, padding: "6px 12px", color: "#15803d" } },
];

const PIPELINE_EDGES: Edge[] = [
  { id: "e1-2", source: "1", target: "2", style: { stroke: "#e4e4e7" } },
  { id: "e1-3", source: "1", target: "3", style: { stroke: "#e4e4e7" } },
  { id: "e2-4", source: "2", target: "4", style: { stroke: "#e4e4e7" } },
  { id: "e3-5", source: "3", target: "5", style: { stroke: "#e4e4e7" } },
  { id: "e4-6", source: "4", target: "6", style: { stroke: "#e4e4e7" } },
  { id: "e5-6", source: "5", target: "6", style: { stroke: "#e4e4e7" } },
  { id: "e6-7", source: "6", target: "7", style: { stroke: "#bbf7d0", strokeWidth: 2 }, animated: true },
];

const STAGES = [
  "Repository Fetch",
  "Documentation Parse",
  "Static Analysis",
  "Network Behavior",
  "Permission Mapping",
  "Semantic Comparison",
  "Trust Score Computation",
  "Report Generation",
];

export default function VerificationPage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [done, setDone] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetType: "github",
      deep: false,
      includeDependencies: false,
    },
  });

  watch("targetType");

  const mutation = useMutation({
    mutationFn: verificationApi.submit,
    onSuccess: ({ jobId }) => {
      setJobId(jobId);
      simulateProgress();
    },
  });

  function simulateProgress() {
    let p = 0;
    let stage = 0;
    const total = STAGES.length;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setDone(true);
      }
      stage = Math.min(Math.floor((p / 100) * total), total - 1);
      setProgress(Math.round(p));
      setCurrentStage(stage);
    }, 400);
  }

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="New Verification" description="Submit a repository or tool for trust analysis" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-5 gap-6">
          {/* Form */}
          <div className="col-span-3 space-y-5">
            {!jobId ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle>Target</CardTitle>
                    <CardDescription>Enter the URL of the tool to verify</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="url">Repository or package URL</Label>
                      <Input
                        id="url"
                        placeholder="https://github.com/owner/repo"
                        {...register("url")}
                        className={cn(errors.url && "border-red-400 focus-visible:ring-red-400")}
                      />
                      {errors.url && (
                        <p className="text-xs text-red-600">{errors.url.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Target type</Label>
                      <Controller
                        name="targetType"
                        control={control}
                        render={({ field }) => (
                          <div className="grid grid-cols-2 gap-2">
                            {TARGET_TYPES.map(({ value, label, icon: Icon, description }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => field.onChange(value)}
                                className={cn(
                                  "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                                  field.value === value
                                    ? "border-indigo-400 bg-indigo-50"
                                    : "border-zinc-200 bg-white hover:border-zinc-300"
                                )}
                              >
                                <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", field.value === value ? "text-indigo-600" : "text-zinc-400")} />
                                <div>
                                  <p className={cn("text-xs font-semibold", field.value === value ? "text-indigo-700" : "text-zinc-900")}>{label}</p>
                                  <p className="text-[11px] text-zinc-500 mt-0.5">{description}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Analysis options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Controller
                      name="deep"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-zinc-900">Deep analysis</p>
                            <p className="text-xs text-zinc-500">Extended AST traversal and data flow analysis</p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                    <Controller
                      name="includeDependencies"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-zinc-900">Include dependencies</p>
                            <p className="text-xs text-zinc-500">Analyze transitive npm/pip dependencies</p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full gap-2"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                  ) : (
                    <>Start Verification <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              </form>
            ) : (
              /* Progress view */
              <Card>
                <CardHeader>
                  <CardTitle>
                    {done ? "Verification Complete" : "Running Verification…"}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">{jobId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>{STAGES[currentStage]}</span>
                      <span className="tabular-nums">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  <div className="space-y-2">
                    {STAGES.map((stage, i) => {
                      const completed = i < currentStage || done;
                      const running = i === currentStage && !done;
                      return (
                        <div key={stage} className="flex items-center gap-2.5">
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : running ? (
                            <Loader2 className="h-4 w-4 shrink-0 text-indigo-500 animate-spin" />
                          ) : (
                            <div className="h-4 w-4 shrink-0 rounded-full border border-zinc-200" />
                          )}
                          <span className={cn(
                            "text-sm",
                            completed ? "text-zinc-700" : running ? "text-indigo-700 font-medium" : "text-zinc-400"
                          )}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {done && (
                    <Link to="/reports/$reportId" params={{ reportId: "report-001" }}>
                      <Button variant="primary" className="w-full gap-2">
                        View Trust Report <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pipeline visualization */}
          <div className="col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Verification Pipeline</CardTitle>
                <CardDescription>How GOTCHA analyzes your tool</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-52 w-full">
                  <ReactFlow
                    nodes={PIPELINE_NODES}
                    edges={PIPELINE_EDGES}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    zoomOnScroll={false}
                    panOnDrag={false}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background color="#f4f4f5" gap={20} size={1} />
                  </ReactFlow>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-zinc-400" />
                  What we analyze
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "File system access patterns",
                    "Network calls and external endpoints",
                    "Credential and secret access",
                    "Subprocess and shell execution",
                    "Persistence mechanisms",
                    "Data collection and telemetry",
                    "Permission scope vs documentation",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-zinc-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
