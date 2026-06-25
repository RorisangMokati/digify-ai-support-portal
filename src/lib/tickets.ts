type Ticket = {
  id: string;
  ticketNo: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: string;
  assignee: string;
  createdAt: string;
};

export const tickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "TK-1001",

    subject: "Unable to login",
    description: "User cannot access the portal after password reset.",

    status: "OPEN",
    priority: "HIGH",

    category: "Authentication",
    assignee: "AI Support",

    createdAt: "2026-06-12T08:30:00Z",
  },

  {
    id: "2",
    ticketNo: "TK-1002",

    subject: "Payment failed",
    description: "Payment gateway returns an error during checkout.",

    status: "IN_PROGRESS",
    priority: "MEDIUM",

    category: "Payments",
    assignee: "Finance Team",

    createdAt: "2026-06-12T09:15:00Z",
  },

  {
    id: "3",
    ticketNo: "TK-1003",

    subject: "Password reset request",
    description: "Customer requested a password reset email.",

    status: "WAITING",
    priority: "LOW",

    category: "Authentication",
    assignee: "Support Team",

    createdAt: "2026-06-12T10:00:00Z",
  },

  {
    id: "4",
    ticketNo: "TK-1004",

    subject: "Account verification issue",
    description: "Verification email was never received.",

    status: "RESOLVED",
    priority: "MEDIUM",

    category: "Account Management",
    assignee: "Support Team",

    createdAt: "2026-06-11T14:20:00Z",
  },

  {
    id: "5",
    ticketNo: "TK-1005",

    subject: "System outage",
    description: "Users report intermittent downtime.",

    status: "CLOSED",
    priority: "CRITICAL",

    category: "Infrastructure",
    assignee: "DevOps",

    createdAt: "2026-06-10T18:45:00Z",
  },
];
