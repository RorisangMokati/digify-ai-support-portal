// src/server/tickets/create.ts

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Priority, TicketStatus } from "@prisma/client";
import { db } from "./db";
import sendToZendesk from "./zendesk";

export const createTicket = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string(),
      message: z.string(),
      category: z.string(),
      priority: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const priority = normalizePriority(data.priority);

    // 1. Save to database
    const ticket = await db.ticket.create({
      data: {
        title: data.title,
        message: data.message,
        category: data.category,
        priority,
        status: TicketStatus.OPEN,
      },
    });

    // 2. Send to Zendesk (we’ll fully enable next step)
    await sendToZendesk({
      subject: `[${data.category}] ${data.title}`,
      comment: { body: data.message },
      priority: priority.toLowerCase(),
    });

    return {
      success: true,
      ticket,
    };
  });

function normalizePriority(priority: string) {
  const normalized = priority.toUpperCase();

  if (normalized === "LOW") return Priority.LOW;
  if (normalized === "HIGH") return Priority.HIGH;
  if (normalized === "URGENT" || normalized === "CRITICAL") return Priority.URGENT;

  return Priority.MEDIUM;
}
