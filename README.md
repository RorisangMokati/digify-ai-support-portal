# AI Support Operations Portal

An internal support operations portal for capturing project/support requests, classifying them with Groq AI, storing structured tracker data in Supabase, and displaying operational reporting for handover and team visibility.

## Project Purpose

Internal project work can become spread across tickets, spreadsheets, chat messages, and verbal updates. This project creates one controlled intake and tracking flow so requests can be captured, classified, assigned, monitored, and reported on.

The goal is a working proof-of-delivery system with a clear frontend, API layer, AI processing, tracker storage, dashboard, and handover documentation.

## Current Architecture

```text
React frontend
        -> Cloudflare Worker API
        -> Groq AI processing
        -> Supabase support_requests table
        -> Dashboard and reporting views
```

## What The App Does

- Captures support/project requests through a React form.
- Validates request data before processing.
- Sends requests to a Cloudflare Worker backend.
- Uses Groq AI to classify and structure request details.
- Stores structured request records in Supabase.
- Displays request status, priority, owner, evidence links, and reporting data.
- Provides setup and handover documentation for future maintainers.

## Main Features

- Request submission form
- Requester name and email capture
- Department selection
- Evidence link capture
- AI-generated summary
- AI-generated category and priority
- Recommended owner
- Risk/blocker indicators
- Dashboard overview
- Reporting page
- Cloudflare Worker API
- Supabase tracker table

## Tech Stack

- React
- Vite
- TanStack Router / TanStack Start
- TypeScript
- Tailwind CSS
- Cloudflare Workers
- Groq AI
- Supabase
- Netlify for frontend hosting

## Important Files

```text
src/routes/submit.tsx
```

Request submission page.

```text
src/routes/index.tsx
```

Dashboard page.

```text
src/routes/reports.tsx
```

Reporting page.

```text
src/lib/support-requests.ts
```

Frontend API client for communicating with the Worker.

```text
worker/ai-support-worker/src/index.ts
```

Cloudflare Worker API. Handles validation, Groq processing, Supabase storage, and API responses.

```text
docs/supabase-schema.sql
```

SQL schema for the Supabase `support_requests` table.

```text
HANDOVER.md
```

Operational setup, deployment, known issues, and next steps.

## Environment Variables

### Frontend

Create `.env` in the project root:

```env
VITE_WORKER_API_URL=http://127.0.0.1:8787
```

For Netlify, replace this with the deployed Cloudflare Worker URL:

```env
VITE_WORKER_API_URL=https://your-worker.your-subdomain.workers.dev
```

### Cloudflare Worker

Create `worker/ai-support-worker/.dev.vars`:

```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_MODEL=llama-3.1-8b-instant
ALLOWED_ORIGIN=http://localhost:8080
```

Do not place `GROQ_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in the frontend environment. They must stay server-side in the Worker.

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run the SQL from:

```text
docs/supabase-schema.sql
```

This creates the `support_requests` tracker table used by the Worker and dashboard.

## Local Development

Install frontend dependencies:

```bash
npm install
```

Install Worker dependencies:

```bash
cd worker/ai-support-worker
npm install
```

Start the Cloudflare Worker:

```bash
cd worker/ai-support-worker
npm run dev
```

Start the frontend from the project root:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:8080
```

The Worker usually runs at:

```text
http://127.0.0.1:8787
```

## API Endpoints

### Health Check

```text
GET /
```

Returns API status and available endpoints.

### Create Request

```text
POST /api/requests
```

Example body:

```json
{
  "title": "Cannot access project tracker",
  "description": "The project team cannot access the tracker and needs help before the end-of-day update.",
  "requesterName": "Jane Doe",
  "requesterEmail": "jane@example.com",
  "department": "Operations",
  "evidenceLinks": ["https://example.com/screenshot"]
}
```

### List Requests

```text
GET /api/requests
```

Returns stored tracker requests from Supabase.

### Update Request

```text
PATCH /api/requests/:id
```

Supported update fields:

```json
{
  "status": "in_progress",
  "assigned_owner": "Support Operations",
  "blockers": ["Waiting for access approval"],
  "evidence_links": ["https://example.com/evidence"]
}
```

## What Changed From The Previous Version

The previous version was mostly a frontend prototype with mock/static dashboard data. The submit form showed a success message, but it did not save real requests. The Worker was still an early prototype and did not match the final required Groq + Supabase architecture.

The current version now has a real end-to-end structure:

```text
Submit form -> Worker validation -> Groq classification -> Supabase storage -> Dashboard/reporting
```

## Current Status

Completed:

- Frontend request submission form
- Dashboard and reporting views
- Worker API endpoints
- Groq integration structure
- Supabase tracker schema
- Frontend-to-Worker API client
- Environment templates
- Handover documentation
- Worker tests

Still to improve:

- Real file uploads for evidence
- Authentication and role-based access
- Request detail page
- In-app owner/status editing UI
- Production deployment
- Final Miro board and Gamma presentation

## Testing

Frontend build:

```bash
npm run build
```

Frontend lint:

```bash
npm run lint
```

Worker tests:

```bash
cd worker/ai-support-worker
npm test
```

## Deployment Notes

Frontend should be deployed to Netlify.

Cloudflare Worker should be deployed with Wrangler:

```bash
cd worker/ai-support-worker
npm run deploy
```

Set production Worker secrets with:

```bash
wrangler secret put GROQ_API_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Set the deployed frontend URL as `ALLOWED_ORIGIN` in the Worker configuration.

## Contributors

- Rorisang Mokati
- Sanelisiwe Mbhele
- Noluthando Shangase
- Sbahle Ngidi
- Tristan Govender

## License

MIT License
