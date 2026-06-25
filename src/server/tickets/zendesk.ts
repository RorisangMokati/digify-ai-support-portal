type ZendeskTicketPayload = {
  subject: string;
  comment: {
    body: string;
  };
  priority: string;
};

export default async function sendToZendesk(payload: ZendeskTicketPayload) {
  const subdomain = process.env.ZENDESK_SUBDOMAIN;
  const email = process.env.ZENDESK_EMAIL;
  const token = process.env.ZENDESK_API_TOKEN;

  if (!subdomain || !email || !token) {
    console.info("Zendesk is not configured; skipping ticket sync.", {
      subject: payload.subject,
    });
    return { skipped: true };
  }

  const response = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${email}/token:${token}`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticket: payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Zendesk sync failed with status ${response.status}`);
  }

  return response.json();
}
