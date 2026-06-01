import { Badge } from "@/components/ui/badge";
import type { Priority, RequestStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    Open: "bg-accent text-accent-foreground",
    "In Progress": "bg-primary/10 text-primary",
    Resolved: "bg-success/15 text-success",
    Escalated: "bg-destructive/15 text-destructive",
  };
  return <Badge variant="outline" className={cn("border-transparent font-medium", styles[status])}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    Low: "bg-muted text-muted-foreground",
    Medium: "bg-warning/15 text-warning-foreground",
    High: "bg-warning/25 text-warning-foreground",
    Critical: "bg-destructive/15 text-destructive",
  };
  return <Badge variant="outline" className={cn("border-transparent font-medium", styles[priority])}>{priority}</Badge>;
}
