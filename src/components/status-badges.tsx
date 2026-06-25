import { Badge } from "@/components/ui/badge";
import {
  formatPriority,
  formatStatus,
  type Priority,
  type RequestStatus,
} from "@/lib/support-requests";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    new: "bg-accent text-accent-foreground",
    triaged: "bg-primary/10 text-primary",
    in_progress: "bg-primary/10 text-primary",
    blocked: "bg-destructive/15 text-destructive",
    resolved: "bg-success/15 text-success",
    closed: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", styles[status])}>
      {formatStatus(status)}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/15 text-warning-foreground",
    high: "bg-warning/25 text-warning-foreground",
    urgent: "bg-destructive/15 text-destructive",
  };
  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", styles[priority])}>
      {formatPriority(priority)}
    </Badge>
  );
}
