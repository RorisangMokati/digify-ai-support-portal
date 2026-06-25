import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import { PriorityBadge, StatusBadge } from "@/components/status-badges";
import { getSupportRequests, hasWorkerApiUrl, type SupportRequest } from "@/lib/support-requests";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type RecentRequestsTableProps = {
  limit?: number;
  onLoaded?: (requests: SupportRequest[]) => void;
};

export function RecentRequestsTable({ limit = 8, onLoaded }: RecentRequestsTableProps) {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(hasWorkerApiUrl());
  const [error, setError] = useState<string | null>(
    hasWorkerApiUrl() ? null : "Connect VITE_WORKER_API_URL to load live requests.",
  );

  useEffect(() => {
    if (!hasWorkerApiUrl()) {
      onLoaded?.([]);
      return;
    }

    let active = true;

    getSupportRequests()
      .then((data) => {
        if (!active) return;
        setRequests(data);
        onLoaded?.(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load support requests.");
        onLoaded?.([]);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [onLoaded]);

  const visibleRequests = requests.slice(0, limit);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead className="hidden md:table-cell">Requester</TableHead>
            <TableHead className="hidden lg:table-cell">Department</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden xl:table-cell">Owner</TableHead>
            <TableHead className="hidden sm:table-cell">Evidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                Loading requests...
              </TableCell>
            </TableRow>
          )}

          {!loading && error && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                {error}
              </TableCell>
            </TableRow>
          )}

          {!loading && !error && visibleRequests.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                No requests have been submitted yet.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            !error &&
            visibleRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="grid gap-1">
                    <span className="font-medium">{request.title}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {request.ai_summary}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="grid gap-1">
                    <span>{request.requester_name}</span>
                    <span className="text-xs text-muted-foreground">{request.requester_email}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {request.department}
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={request.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="hidden xl:table-cell text-muted-foreground">
                  {request.assigned_owner}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {request.evidence_links.length > 0 ? (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={request.evidence_links[0]} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        Open
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
