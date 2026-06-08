// src/server/tickets/update.ts

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { tickets } from "./db";
import type { TicketStatus } from "./types";

export const updateTicket = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      status: z.enum(["open", "in_progress", "closed"]),
    })
  )
  .handler(async ({ data }) => {
    const ticket = tickets.find((t) => t.id === data.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.status = data.status as TicketStatus;

    return {
      success: true,
      ticket,
    };
  });