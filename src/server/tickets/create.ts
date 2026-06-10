// src/server/tickets/create.ts

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { sendToZendesk } from "./zendesk";

export const createTicket = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string(),
      message: z.string(),
      category: z.string(),
      priority: z.string(),
    })
  )
  .handler(async ({ data }) => {
    // 1. Save to database
    const ticket = await db.ticket.create({
      data: {
        title: data.title,
        message: data.message,
        category: data.category,
        priority: data.priority,
        status: "open",
      },
    });

    // 2. Send to Zendesk (we’ll fully enable next step)
    await sendToZendesk({
      subject: `[${data.category}] ${data.title}`,
      comment: { body: data.message },
      priority: data.priority.toLowerCase(),
    });

    return {
      success: true,
      ticket,
    };
  });