export type RequestStatus = "Open" | "In Progress" | "Resolved" | "Escalated";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface SupportRequest {
  id: string;
  subject: string;
  requester: string;
  category: string;
  priority: Priority;
  status: RequestStatus;
  createdAt: string;
}

export const recentRequests: SupportRequest[] = [
  {
    id: "REQ-1042",
    subject: "Model latency spike on EU cluster",
    requester: "Anna Müller",
    category: "Infrastructure",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-05-29",
  },
  {
    id: "REQ-1041",
    subject: "Knowledge base sync failure",
    requester: "Marcus Chen",
    category: "Data",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-05-29",
  },
  {
    id: "REQ-1040",
    subject: "Agent escalation rule misfire",
    requester: "Priya Shah",
    category: "Automation",
    priority: "Critical",
    status: "Escalated",
    createdAt: "2026-05-28",
  },
  {
    id: "REQ-1039",
    subject: "Update embedding index v3",
    requester: "Diego Romero",
    category: "AI Ops",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-05-28",
  },
  {
    id: "REQ-1038",
    subject: "SSO token rotation request",
    requester: "Jules Laurent",
    category: "Security",
    priority: "High",
    status: "Open",
    createdAt: "2026-05-27",
  },
  {
    id: "REQ-1037",
    subject: "Add Slack channel routing",
    requester: "Sara Okafor",
    category: "Integrations",
    priority: "Medium",
    status: "Resolved",
    createdAt: "2026-05-27",
  },
];
