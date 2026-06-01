import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, CheckCircle2, AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { RecentRequestsTable } from "@/components/recent-requests-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Support Operations" },
      { name: "description", content: "Monitor support requests, SLA performance, and team activity." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
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
        <AlertTitle>All queues healthy</AlertTitle>
        <AlertDescription>
          AI triage is routing requests with a 98.2% accuracy score in the last 24 hours.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Requests" value={42} delta="+8 today" trend="up" icon={Inbox} />
        <StatCard label="Resolved (7d)" value={186} delta="+12% vs last week" trend="up" icon={CheckCircle2} />
        <StatCard label="Avg. Response" value="3m 24s" delta="-18s vs last week" trend="up" icon={Clock} />
        <StatCard label="Escalations" value={7} delta="2 pending review" trend="down" icon={AlertTriangle} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Requests</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reports">View all</Link>
          </Button>
        </div>
        <RecentRequestsTable />
      </div>
    </div>
  );
}
