# 🚀 Digify AI Support Operations Portal

Frontend and AI-powered support operations platform for Digify CX.

---

## 🔥 Live Development Progress

This project is actively being built and updated daily.

---

## 📌 Project Overview

This project is a full-stack AI support system designed to:

* Capture and manage IT/support requests
* Provide AI-assisted responses to user queries
* Generate and track support tickets
* Serve as a scalable internal support operations tool

---

## 🧠 Key Features

### ✅ AI Chat Support (In Progress)

* Endpoint: `/api/chat`
* Accepts user queries
* Returns structured responses (ready for AI integration)

### 🎫 Ticket Creation API

* Endpoint: `/api/tickets`
* Generates unique ticket IDs
* Returns structured ticket data
* Simulates support workflow

### 🩺 Health Check

* Endpoint: `/`
* Confirms Worker is running

---

## 🏗️ Architecture

```
Frontend (Vite + React)
        ↓
Cloudflare Worker API
        ↓
Future: AI Model (OpenAI / Groq)
```

---

## 🛠️ Tech Stack

### Frontend

* React (via Vite)
* TypeScript

### Backend

* Cloudflare Workers
* Wrangler CLI

### Dev Tools

* Node.js
* Git & GitHub

### AI (Next Phase)

* OpenAI API (planned)
* Groq (optional)

---

## ⚙️ Local Development

### 1. Clone repo

```bash
git clone https://github.com/RorisangMokati/digify-ai-support-portal.git
cd digify-ai-support-ops-portal
```

---

### 2. Install dependencies

Frontend:

```bash
npm install
```

Worker:

```bash
cd worker/ai-support-worker
npm install
```

---

### 3. Run frontend

```bash
npm run dev
```

---

### 4. Run Cloudflare Worker

```bash
cd worker/ai-support-worker
npm run dev
```

Worker runs on:

```
http://127.0.0.1:8787
```

---

## 🧪 API Testing

### Chat Endpoint

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/chat" `
-Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"message":"Hello"}'
```

---

### Ticket Endpoint

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/tickets" `
-Method POST `
-Headers @{ "Content-Type" = "application/json" } `
-Body '{"title":"Login Issue"}'
```

---

## 🚧 Current Status

✅ Frontend UI scaffolded
✅ Cloudflare Worker API built
✅ Endpoints tested successfully
✅ GitHub repository connected
⬜ AI integration (next step)
⬜ Frontend ↔ Backend connection
⬜ Deployment to Cloudflare

---

## 🔮 Roadmap

* [ ] Integrate OpenAI into `/api/chat`
* [ ] Connect frontend chat UI to backend
* [ ] Store tickets in database (D1 / Firebase)
* [ ] Add authentication (optional)
* [ ] Deploy to Cloudflare Workers

---

## 👥 Contributors

* **Rorisang Mokati**
* Sanelisiwe Mbhele
* Noluthando Shangase
* Sbahle Ngidi
* Tristan Govender

---

## 📄 License

MIT License

