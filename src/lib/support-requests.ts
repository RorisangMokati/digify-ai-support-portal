export type RequestStatus = "new" | "triaged" | "in_progress" | "blocked" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";

export type SupportRequest = {
  id: string;
  title: string;
  description: string;
  requester_name: string;
  requester_email: string;
  department: string;
  category: string;
  priority: Priority;
  status: RequestStatus;
  assigned_owner: string;
  ai_summary: string;
  risk_level: "low" | "medium" | "high";
  blockers: string[];
  evidence_links: string[];
  suggested_actions: string[];
  created_at: string;
  updated_at: string;
};

export type CreateSupportRequestInput = {
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  department: string;
  evidenceLinks: string[];
};

const workerApiUrl = import.meta.env.VITE_WORKER_API_URL as string | undefined;

export function hasWorkerApiUrl() {
  return Boolean(workerApiUrl);
}

export async function createSupportRequest(input: CreateSupportRequestInput) {
  const response = await workerFetch("/api/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const body = (await response.json()) as { request: SupportRequest };
  return body.request;
}

export async function getSupportRequests() {
  const response = await workerFetch("/api/requests");
  const body = (await response.json()) as { requests: SupportRequest[] };
  return body.requests;
}

export async function updateSupportRequest(
  id: string,
  input: Partial<Pick<SupportRequest, "status" | "blockers" | "evidence_links">> & {
    assigned_owner?: string;
  },
) {
  const response = await workerFetch(`/api/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  const body = (await response.json()) as { request: SupportRequest };
  return body.request;
}

async function workerFetch(path: string, init: RequestInit = {}) {
  if (!workerApiUrl) {
    throw new Error(
      "Missing VITE_WORKER_API_URL. Add your deployed Cloudflare Worker URL to the frontend environment.",
    );
  }

  const response = await fetch(`${workerApiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Request failed with status ${response.status}`);
  }

  return response;
}

export function formatStatus(status: RequestStatus) {
  const labels: Record<RequestStatus, string> = {
    new: "New",
    triaged: "Triaged",
    in_progress: "In Progress",
    blocked: "Blocked",
    resolved: "Resolved",
    closed: "Closed",
  };
  return labels[status];
}

export function formatPriority(priority: Priority) {
  const labels: Record<Priority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };
  return labels[priority];
}
