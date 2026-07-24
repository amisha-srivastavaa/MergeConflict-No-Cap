import { Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Zap, FileSearch, BarChart2, GitBranch, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const FEATURES = [
  {
    icon: FileSearch,
    title: "Semantic Code Analysis",
    description: "AST-level analysis traces every function call, network request, and file system operation — comparing actual behavior against documentation.",
  },
  {
    icon: ShieldCheck,
    title: "Trust Score Engine",
    description: "A weighted scoring model across 7 behavioral dimensions produces a calibrated Trust Score from 0–100 with per-category breakdowns.",
  },
  {
    icon: Zap,
    title: "AI-Powered Comparison",
    description: "LLM-based semantic matching surfaces capability drift, hidden behaviors, and documentation gaps that static analysis alone would miss.",
  },
  {
    icon: BarChart2,
    title: "Verification History",
    description: "Track trust drift over time as tools evolve. Re-verify on new releases and receive alerts when behavioral profiles change significantly.",
  },
  {
    icon: GitBranch,
    title: "MCP & Plugin Support",
    description: "Native support for MCP Servers, AI plugins, agent skills, and GitHub repositories — wherever AI tools are distributed.",
  },
  {
    icon: AlertTriangle,
    title: "Undisclosed Behavior Detection",
    description: "Identify behaviors present in code but absent from documentation: telemetry, credential access, persistence mechanisms, and more.",
  },
];

const STATS = [
  { value: "10,000+", label: "Tools verified" },
  { value: "2,400+", label: "Critical findings" },
  { value: "98.4%", label: "Detection accuracy" },
  { value: "<45s", label: "Avg. report time" },
];

const VERDICTS = [
  { repo: "anthropics/claude-code", score: 82, level: "low" as const, verdict: "Conditionally Trusted", tag: "Minor telemetry gap" },
  { repo: "cursor-ai/cursor-mcp", score: 31, level: "critical" as const, verdict: "Critical Risk", tag: "Credential harvesting detected" },
  { repo: "modelcontextprotocol/servers", score: 91, level: "trusted" as const, verdict: "Trusted", tag: "Fully documented" },
];

const scoreColor: Record<string, string> = {
  trusted: "text-emerald-600",
  low: "text-sky-600",
  medium: "text-amber-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GOTCHA" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">How it works</a>
            <Link to="/overview">
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
            <Link to="/verify">
              <Button variant="primary" size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 ring-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Now supporting MCP Server verification
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
            Trust the AI tools<br />
            <span className="text-indigo-600">before you run them.</span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            GOTCHA compares what AI tools, MCP Servers, and agent plugins{" "}
            <em>claim</em> to do with what their code{" "}
            <em>actually</em> does — generating auditable Trust Reports in under a minute.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/verify">
              <Button variant="primary" size="lg" className="gap-2">
                Verify a repository <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/overview">
              <Button variant="outline" size="lg">View dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Example verdicts */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2.5 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
              <span className="ml-3 text-xs text-zinc-400 font-mono">gotcha.ai/reports</span>
            </div>
            <div className="divide-y divide-zinc-100">
              {VERDICTS.map((v) => (
                <div key={v.repo} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-zinc-700">{v.repo}</span>
                    <Badge variant={v.level === "trusted" ? "trusted" : v.level === "low" ? "low" : "critical"} className="text-[10px]">
                      {v.tag}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-semibold tabular-nums ${scoreColor[v.level]}`}>
                      {v.score}
                    </span>
                    <span className="text-xs text-zinc-500">{v.verdict}</span>
                    {v.level === "trusted" || v.level === "low" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-12 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-zinc-900 tabular-nums">{value}</div>
              <div className="mt-1 text-sm text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-3">
              Everything you need to audit AI tools
            </h2>
            <p className="text-zinc-500 text-base max-w-xl mx-auto">
              A complete trust verification platform built for security-conscious teams deploying AI tools in production.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-lg border border-zinc-200 bg-white p-5 hover:border-zinc-300 transition-colors">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50">
                  <Icon className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-zinc-200 bg-zinc-50 py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-3">
              How verification works
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-0">
            {[
              { step: "01", title: "Submit URL", desc: "Paste a GitHub, npm, or MCP registry URL" },
              { step: "02", title: "Static Analysis", desc: "AST traversal traces all code behaviors" },
              { step: "03", title: "Semantic Match", desc: "AI compares claims against detected behavior" },
              { step: "04", title: "Trust Report", desc: "Receive a scored, auditable report in < 1 min" },
            ].map(({ step, title, desc }, i, arr) => (
              <div key={step} className="relative flex flex-col items-center text-center px-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-200 bg-white text-sm font-bold text-indigo-600 mb-4">
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <div className="absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px bg-indigo-100" />
                )}
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">{title}</h3>
                <p className="text-xs text-zinc-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
            Ready to verify your stack?
          </h2>
          <p className="text-zinc-500 mb-8">
            Start verifying AI tools in seconds. No installation required.
          </p>
          <Link to="/verify">
            <Button variant="primary" size="lg" className="gap-2">
              Start verifying <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-8 px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GOTCHA" className="h-9 w-auto object-contain" />
          </div>
          <p className="text-xs text-zinc-400">
            &copy; 2024 GOTCHA. AI-powered semantic trust verification.
          </p>
        </div>
      </footer>
    </div>
  );
}
