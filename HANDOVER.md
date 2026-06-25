# AI Support Operations Portal Handover

## Current Architecture

```text
React frontend on Netlify
        -> Cloudflare Worker API
        -> Groq AI classification
        -> Supabase support_requests table
        -> Dashboard and reporting views
```

## What The Project Had Before

The project started as a mostly frontend-focused support portal prototype. It already had a React interface with a dashboard, request submission page, reports page, settings page, sidebar navigation, and reusable UI components. It also had an early Cloudflare Worker prototype with simple test endpoints, plus some initial Prisma/Zendesk files that showed the planned backend direction.

However, most of the workflow was not connected end to end. The request form validated fields and showed a success message, but it did not send real data to the backend. The dashboard and reports used mock/static data instead of live tracker records. The Worker was still a prototype and was not yet aligned with the required Groq + Supabase architecture. Some backend files were empty or only partially prepared, so they were not enough for a working handover-ready system.

## What Was Wrong With The Previous Version

- The frontend looked usable, but submitted requests were not actually stored.
- Dashboard and reporting numbers were static, so they did not reflect real project activity.
- The Worker used an older prototype structure and was not handling the full request lifecycle.
- Groq AI classification was not wired into the request flow.
- Supabase did not yet have a clear tracker table or SQL setup file.
- Environment variable setup was unclear, especially which values belonged in the frontend versus the Worker.
- Several backend files were incomplete, which made the project harder to understand and maintain.
- Evidence handling was missing from the request workflow.

## Changes Made

- Rebuilt the Cloudflare Worker around the required API flow: receive requests, validate input, call Groq, save to Supabase, and return structured results.
- Added `POST /api/requests`, `GET /api/requests`, and `PATCH /api/requests/:id`.
- Connected the React request form to the Worker API.
- Added requester details, department selection, and evidence links to the submission flow.
- Added a typed frontend API client for Worker communication.
- Updated dashboard and reporting views so they can load live tracker data.
- Added reusable status and priority badges that match the new backend values.
- Added the Supabase `support_requests` SQL schema.
- Added environment templates for frontend and Worker configuration.
- Added Worker tests for health, CORS, and validation behavior.
- Added this handover document with setup, deployment, known issues, and next steps.

## Current Working Flow

```text
User submits request in React
        -> Frontend sends request to Cloudflare Worker
        -> Worker validates the request
        -> Worker sends request details to Groq
        -> Groq returns summary, category, priority, owner, blockers, and actions
        -> Worker saves the structured request in Supabase
        -> Dashboard and reports load tracker data from the Worker
```

## Local Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Install Worker dependencies:

```bash
cd worker/ai-support-worker
npm install
```

3. Copy frontend environment values:

```bash
cp .env.example .env
```

4. Copy Worker secret template:

```bash
cd worker/ai-support-worker
cp .dev.vars.example .dev.vars
```

5. Fill in `worker/ai-support-worker/.dev.vars`:

```text
GROQ_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_MODEL=llama-3.1-8b-instant
ALLOWED_ORIGIN=http://localhost:5173
```

6. Create the Supabase table by running `docs/supabase-schema.sql` in the Supabase SQL editor.

7. Start the Worker:

```bash
cd worker/ai-support-worker
npm run dev
```

8. Start the frontend:

```bash
npm run dev
```

## Deployment

### Netlify

Set this environment variable in Netlify:

```text
VITE_WORKER_API_URL=https://your-worker.your-subdomain.workers.dev
```

Build command:

```bash
npm run build
```

### Cloudflare Worker

Set secrets:

```bash
wrangler secret put GROQ_API_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Set non-secret vars in `wrangler.jsonc`:

```jsonc
"vars": {
  "GROQ_MODEL": "llama-3.1-8b-instant",
  "SUPABASE_URL": "https://your-project.supabase.co",
  "ALLOWED_ORIGIN": "https://your-netlify-site.netlify.app"
}
```

Deploy:

```bash
cd worker/ai-support-worker
npm run deploy
```

## API Endpoints

```text
GET /
POST /api/requests
GET /api/requests
PATCH /api/requests/:id
```

`POST /api/requests` expects:

```json
{
  "title": "Request title",
  "description": "Full request details",
  "requesterName": "Requester Name",
  "requesterEmail": "requester@example.com",
  "department": "Operations",
  "evidenceLinks": ["https://example.com/evidence"]
}
```

## Known Issues

- Evidence upload is currently evidence links only. File upload can be added later with Supabase Storage or Cloudflare R2.
- The older Prisma/Zendesk files remain in the repo but the main required workflow now uses Cloudflare Worker plus Supabase.
- The Worker falls back to a generic classification if `GROQ_API_KEY` is missing or Groq fails.

## Recommended Next Steps

- Add a request detail page with status/owner/blocker editing.
- Add real file uploads.
- Add authentication before exposing internal data broadly.
- Export report summaries for the Gamma final presentation and handover pack.
