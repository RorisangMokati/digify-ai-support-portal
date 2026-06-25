import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Support Operations" },
      {
        name: "description",
        content: "Configure your portal preferences, notifications, and AI routing.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("Operations Admin");
  const [email, setEmail] = useState("ops@company.internal");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoTriage, setAutoTriage] = useState(true);
  const [region, setRegion] = useState("eu-central-1");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, notifications, and routing rules.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Displayed on requests you submit or own.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose how you want to be alerted.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email alerts</p>
              <p className="text-xs text-muted-foreground">
                Get notified when a request is assigned or updated.
              </p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">AI auto-triage</p>
              <p className="text-xs text-muted-foreground">
                Allow AI to route new requests to the best team automatically.
              </p>
            </div>
            <Switch checked={autoTriage} onCheckedChange={setAutoTriage} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Region</CardTitle>
          <CardDescription>Primary region used for routing and SLAs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="sm:w-[260px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
              <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
              <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
              <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </div>
  );
}
