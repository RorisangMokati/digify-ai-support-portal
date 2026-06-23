📈 Digify AI Support Portal

An AI-powered support operations platform that modernizes ticket management by combining React, TanStack, Prisma, PostgreSQL, and Zendesk integration into a scalable full-stack system.

📊 Project History & Milestones
Phase 0 – Initial Cloudflare Worker Prototype ✅

The project began as a lightweight Cloudflare Worker-based support API to validate ticketing workflows and AI support concepts.

Implemented Endpoints

Health Check

GET /
Verifies deployment and service availability

Chat API Prototype

POST /api/chat
Accepts user support queries
Returns structured responses
Foundation for future AI integration

Ticket API Prototype

POST /api/tickets
Generates ticket IDs
Returns structured ticket payloads
Simulates support workflows
API Testing Example
Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/chat" `
-Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"message":"Hello"}'
Phase 1 – Frontend Foundation ✅

Built a modern frontend using React + Vite.

Completed:
Vite project setup
React + TypeScript configuration
Routing structure
UI component system
Ticket submission form
Validation & error handling
Status notifications
Phase 2 – Architecture Modernization ✅

Evolved from a simple Worker system into a full-stack production architecture.

Previous Architecture

Frontend → Cloudflare Worker → Mock Storage

Current Architecture

Frontend (React + TanStack Router)
→ Server Functions (TanStack Start)
→ Prisma ORM
→ PostgreSQL
→ Zendesk Integration

Improvements:
Eliminated CORS issues
Strong type safety
Secure backend logic
Production-ready structure
Cleaner separation of concerns
Phase 3 – Database Integration 🚧
Completed:
Prisma installed and initialized
Prisma Client generated
PostgreSQL configured
Ticket schema designed
Ticket Schema:
model Ticket {
  id        String   @id @default(uuid())
  title     String
  message   String
  status    String   @default("open")
  priority  String   @default("medium")
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
In Progress:
Database migrations
Ticket persistence layer
Prisma Studio setup
Service layer architecture
Phase 4 – Zendesk Integration 🚧

Designed for enterprise support workflows.

Workflow:

User Submission → Portal Ticket → Database → Zendesk → Agent Assignment → Sync

Upcoming:
Zendesk API integration
Ticket synchronization
Webhooks
Agent assignment logic
⚙️ Development Challenges Solved
CORS Issue

Problem: Browser blocked API calls

Solution:

Moved logic to server functions (TanStack Start)
Removed direct browser → Worker dependency

Result:

Improved security
Stable API communication
Cleaner architecture
📊 Current Progress
Area	Progress
Frontend UI	85%
Routing	90%
Ticket Submission	75%
Backend Architecture	70%
Database Integration	40%
Zendesk Integration	20%
Authentication	0%
AI Integration	0%

Overall Project: 55%

🚀 Next Milestones
Immediate
Complete Prisma integration
Persist tickets to PostgreSQL
Connect Zendesk API
Build ticket retrieval system
Short-Term
Authentication system
Role-based access control
Admin dashboard
Ticket management UI
Long-Term
OpenAI integration
AI ticket triage
Analytics dashboard
CI/CD pipeline
Cloud deployment
🧪 Local Development
1. Clone repository
git clone https://github.com/RorisangMokati/digify-ai-support-portal.git
cd digify-ai-support-ops-portal
2. Install dependencies
npm install
3. Run frontend
npm run dev
4. Run Worker
cd worker/ai-support-worker
npm install
npm run dev

Worker runs at:

http://127.0.0.1:8787
🧪 API Testing
Chat Endpoint
Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/chat" `
-Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"message":"Hello"}'
Ticket Endpoint
Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/tickets" `
-Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"title":"Login Issue"}'
🚧 Current Status
Frontend scaffold complete
API endpoints functional
Worker tested successfully
GitHub repository connected
🔮 Roadmap
OpenAI integration into /api/chat
Frontend chat UI connection
Database persistence (PostgreSQL)
Authentication system
Cloudflare deployment
👥 Contributors
Rorisang Mokati
Sanelisiwe Mbhele
Noluthando Shangase
Sbahle Ngidi
Tristan Govender
📄 License

MIT License

