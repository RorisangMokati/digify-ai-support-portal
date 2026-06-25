import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, CheckCircle2, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { RecentRequestsTable } from "@/components/recent-requests-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { SupportRequest } from "@/lib/support-requests";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Support Operations" },
      {
        name: "description",
        content: "Monitor support requests, SLA performance, and team activity.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const handleLoaded = useCallback((data: SupportRequest[]) => setRequests(data), []);

  const openRequests = requests.filter(
    (request) => !["resolved", "closed"].includes(request.status),
  ).length;
  const resolvedRequests = requests.filter(
    (request) => request.status === "resolved" || request.status === "closed",
  ).length;
  const blockedRequests = requests.filter(
    (request) => request.status === "blocked" || request.blockers.length > 0,
  ).length;
  const highPriorityRequests = requests.filter(
    (request) => request.priority === "high" || request.priority === "urgent",
  ).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of incoming support activity and AI agent performance.
          </p>
        </div>
        <Button asChild>
          <Link to="/submit">
            New request <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Alert className="border-success/30 bg-success/5">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <AlertTitle>{blockedRequests > 0 ? "Blockers need review" : "Tracker ready"}</AlertTitle>
        <AlertDescription>
          {requests.length > 0
            ? `${requests.length} requests loaded from the operations tracker.`
            : "Connect the Cloudflare Worker URL to load live request activity."}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open Requests"
          value={openRequests}
          delta={`${requests.length} total tracked`}
          trend="neutral"
          icon={Inbox}
        />
        <StatCard
          label="Resolved"
          value={resolvedRequests}
          delta="Closed or resolved"
          trend="up"
          icon={CheckCircle2}
        />
        <StatCard
          label="High Priority"
          value={highPriorityRequests}
          delta="High or urgent"
          trend="down"
          icon={Clock}
        />
        <StatCard
          label="Blockers"
          value={blockedRequests}
          delta="Needs ownership"
          trend={blockedRequests > 0 ? "down" : "up"}
          icon={AlertTriangle}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Requests</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reports">View all</Link>
          </Button>
        </div>
        <RecentRequestsTable onLoaded={handleLoaded} />
      </div>
    </div>
  );
}
