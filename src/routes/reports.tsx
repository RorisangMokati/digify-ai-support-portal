import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, Timer } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { RecentRequestsTable } from "@/components/recent-requests-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AI Support Operations" },
      { name: "description", content: "Analytics and performance reports for the support operations team." },
    ],
  }),
  component: Reports,
});

const weekly = [
  { day: "Mon", value: 64 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 91 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 33 },
  { day: "Sun", value: 28 },
];

function Reports() {
  const max = Math.max(...weekly.map((d) => d.value));
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Performance, throughput, and team analytics.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Volume (30d)" value="1,284" delta="+6.4%" trend="up" icon={BarChart3} />
        <StatCard label="Resolution Rate" value="94.1%" delta="+1.8 pts" trend="up" icon={TrendingUp} />
        <StatCard label="Active Agents" value={18} delta="3 on-call" trend="neutral" icon={Users} />
        <StatCard label="SLA Breach" value="0.7%" delta="-0.3 pts" trend="up" icon={Timer} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Request Volume</CardTitle>
          <CardDescription>Requests created per day this week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-end gap-3">
            {weekly.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                    style={{ height: `${(d.value / max) * 100}%` }}
                    title={`${d.value} requests`}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Latest Activity</h2>
        <RecentRequestsTable />
      </div>
    </div>
  );
}
