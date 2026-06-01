/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/// <reference lib="webworker" />

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    // HEALTH CHECK
    if (url.pathname === "/") {
      return new Response("AI Support Worker is running 🚀");
    }

// CHAT ENDPOINT
if (url.pathname === "/api/chat" && request.method === "POST") {
  const body = await request.json() as {
    message?: string;
  };

  const userMessage = body.message || "";

  return new Response(
    JSON.stringify({
      reply: `You said: ${userMessage}`,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

    // TICKETS ENDPOINT
    if (url.pathname === "/api/tickets" && request.method === "POST") {
      const body = await request.json();

      return new Response(
        JSON.stringify({
          ticketId: crypto.randomUUID(),
          status: "created",
          data: body,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response("Not Found", { status: 404 });
  },
};