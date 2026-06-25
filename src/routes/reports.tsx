import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { BarChart3, Timer, TrendingUp, Users } from "lucide-react";

import { RecentRequestsTable } from "@/components/recent-requests-table";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupportRequest } from "@/lib/support-requests";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports - AI Support Operations" },
      {
        name: "description",
        content: "Analytics and performance reports for the support operations team.",
      },
    ],
  }),
  component: Reports,
});

function Reports() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const handleLoaded = useCallback((data: SupportRequest[]) => setRequests(data), []);

  const completed = requests.filter(
    (request) => request.status === "resolved" || request.status === "closed",
  ).length;
  const blocked = requests.filter(
    (request) => request.status === "blocked" || request.blockers.length > 0,
  ).length;
  const owners = new Set(requests.map((request) => request.assigned_owner).filter(Boolean)).size;
  const resolutionRate = requests.length > 0 ? Math.round((completed / requests.length) * 100) : 0;
  const categories = buildCategoryReport(requests);
  const maxCategoryCount = Math.max(1, ...categories.map((category) => category.count));

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Performance, throughput, blockers, and ownership visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Requests"
          value={requests.length}
          delta="Loaded from tracker"
          trend="neutral"
          icon={BarChart3}
        />
        <StatCard
          label="Resolution Rate"
          value={`${resolutionRate}%`}
          delta={`${completed} completed`}
          trend="up"
          icon={TrendingUp}
        />
        <StatCard
          label="Active Owners"
          value={owners}
          delta="Recommended or assigned"
          trend="neutral"
          icon={Users}
        />
        <StatCard
          label="Blocked Items"
          value={blocked}
          delta="Needs follow-up"
          trend={blocked > 0 ? "down" : "up"}
          icon={Timer}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests by Category</CardTitle>
          <CardDescription>AI-classified operational request volume.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {categories.length === 0 && (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Submit requests to populate reporting.
              </div>
            )}

            {categories.map((category) => (
              <div key={category.name} className="grid gap-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">{category.count}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Tracker Activity</h2>
        <RecentRequestsTable limit={20} onLoaded={handleLoaded} />
      </div>
    </div>
  );
}

function buildCategoryReport(requests: SupportRequest[]) {
  const counts = requests.reduce<Record<string, number>>((acc, request) => {
    const key = request.category || "Unclassified";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
