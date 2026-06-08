// src/server/tickets.server.ts

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/* ---------------- TYPES ---------------- */
export type Ticket = {
  id: string;
  title: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
};

/* ---------------- FAKE DB ---------------- */
const tickets: Ticket[] = [];

/* ---------------- CREATE ---------------- */
export const createTicket = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string().min(1),
      message: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      title: data.title,
      message: data.message,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    tickets.push(newTicket);

    return { success: true, ticket: newTicket };
  });

/* ---------------- READ ALL ---------------- */
export const getTickets = createServerFn({ method: "GET" }).handler(
  async () => {
    return { tickets };
  }
);