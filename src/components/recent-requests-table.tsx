import { recentRequests } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge } from "@/components/status-badges";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export function RecentRequestsTable() {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="hidden md:table-cell">Requester</TableHead>
            <TableHead className="hidden lg:table-cell">Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentRequests.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
              <TableCell className="font-medium">{r.subject}</TableCell>
              <TableCell className="hidden md:table-cell">{r.requester}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">{r.category}</TableCell>
              <TableCell><PriorityBadge priority={r.priority} /></TableCell>
              <TableCell><StatusBadge status={r.status} /></TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">{r.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
