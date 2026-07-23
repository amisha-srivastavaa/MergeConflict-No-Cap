import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { CheckCircle2, Key, Bell, Shield, Code2, Copy } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    weeklyDigest: true,
    reportReady: true,
    behaviorDrift: false,
  });
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Settings" description="Account, API access, and notification preferences" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            {/* GENERAL */}
            <TabsContent value="general" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white font-semibold">
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">admin@gotcha.ai</p>
                      <Badge variant="outline" className="text-[10px] mt-1">Free Plan</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" defaultValue="Admin User" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="admin@gotcha.ai" type="email" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="org">Organization</Label>
                    <Input id="org" placeholder="Your organization" />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
                      {saved ? <><CheckCircle2 className="h-3.5 w-3.5" /> Saved</> : "Save changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-red-900">Delete account</p>
                      <p className="text-xs text-red-600">This action is permanent and cannot be undone.</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API ACCESS */}
            <TabsContent value="api" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-zinc-400" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Use these keys to connect GOTCHA to your CI/CD pipeline or FastAPI backend</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Production key</span>
                      <Badge variant="trusted">Active</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs font-mono text-zinc-700 bg-white border border-zinc-200 rounded px-3 py-2">
                        {apiKeyVisible ? "gtch_prod_sk_a8f3d2e1c0b9a7f6e5d4c3b2a1f0e9d8" : "gtch_prod_sk_••••••••••••••••••••••••••••••••"}
                      </code>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setApiKeyVisible(v => !v)}>
                        <Code2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2">Created Jul 1, 2024 — Last used 2h ago</p>
                  </div>

                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    Generate new key
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Endpoint</CardTitle>
                  <CardDescription>Base URL for the GOTCHA REST API</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Backend URL</Label>
                      <Input defaultValue="http://localhost:8000/api/v1" />
                      <p className="text-xs text-zinc-400">Set <code className="font-mono bg-zinc-100 px-1 rounded">VITE_API_URL</code> in your .env to override</p>
                    </div>
                    <Button variant="primary" size="sm" onClick={handleSave}>
                      {saved ? "Saved" : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NOTIFICATIONS */}
            <TabsContent value="notifications" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-zinc-400" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "criticalAlerts" as const, label: "Critical risk alerts", description: "Immediate notification when a critical finding is detected" },
                    { key: "reportReady" as const, label: "Verification complete", description: "Email when a Trust Report is ready to review" },
                    { key: "weeklyDigest" as const, label: "Weekly digest", description: "Summary of all verification activity from the past week" },
                    { key: "behaviorDrift" as const, label: "Behavior drift alerts", description: "Notify when a re-verified tool shows significant behavioral changes" },
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between py-1">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{label}</p>
                        <p className="text-xs text-zinc-500">{description}</p>
                      </div>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={(v) => setNotifications(n => ({ ...n, [key]: v }))}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANALYSIS */}
            <TabsContent value="analysis" className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-zinc-400" />
                    Default Analysis Settings
                  </CardTitle>
                  <CardDescription>Applied to all new verification requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Default analysis depth</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick — surface-level only</SelectItem>
                        <SelectItem value="standard">Standard — recommended</SelectItem>
                        <SelectItem value="deep">Deep — full AST + data flow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Auto-verify on push</p>
                      <p className="text-xs text-zinc-500">Trigger verification when linked repos receive new commits</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Include transitive dependencies</p>
                      <p className="text-xs text-zinc-500">Analyze npm/pip dependencies in addition to source code</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Minimum trust score threshold</Label>
                    <div className="flex items-center gap-3">
                      <Input type="number" defaultValue="70" min="0" max="100" className="w-24" />
                      <p className="text-xs text-zinc-500">Reports below this score trigger alerts</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
                      {saved ? <><CheckCircle2 className="h-3.5 w-3.5" /> Saved</> : "Save defaults"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
