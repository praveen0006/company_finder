# 🎯 Company Finder & Career Agent

An AI-powered application for autonomous company research, job discovery, and automated application tailoring. Built with a focus on **Agentic AI** and **Generative Workflows**.

![Project Preview](https://img.shields.io/badge/AI-Agentic-blueviolet?style=for-the-badge&logo=openai)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20TypeScript-blue?style=for-the-badge)

## 🚀 Key Features

### 🔍 Autonomous Scout
- **Researcher Agent**: Deep-dives into the web to find companies matching your tech stack and domain.
- **Analyst Agent**: Enriches company profiles with real-time data on products, hiring trends, and technical stacks.
- **Matchmaker Agent**: Scores companies against your specific skills to find high-probability fits.

### 💼 Career Dashboard (New!)
- **Job Scout & Evaluate**: Provide a job URL (LinkedIn/Naukri), and the agent extracts JD details and scores the opportunity.
- **Application Tracker**: Manage your pipeline with a premium React dashboard that tracks status from "Evaluated" to "Offer".
- **Tailor ATS Resume**: Generate premium, branded PDF resumes tailored to a specific JD with a single click.
- **Screenshot & Email Automation**: Automatically captures a submission confirmation screenshot once applied and dispatches a visually stunning HSL-themed HTML email to your inbox featuring the matching score, detailed evaluation report, resume name, and inline embedded screenshot.

### 📝 Resume Intelligence
- **Patent-Centric Strategy**: Automatically highlights high-impact assets like patents and IEEE publications.
- **Agentic Architectures**: Uses modern RAG and LangChain-style patterns to ensure high-fidelity resume tailoring.

## 🛠️ Tech Stack

- **Frontend**: React, Framer Motion, Lucide-React, CSS Modules (Premium Glassmorphic Design).
- **Backend**: Node.js, Express, TypeScript.
- **AI Core**: Groq SDK (Llama 3 / Mixtral), Playwright (Browser Automation), Tavily (AI Search).
- **Automation**: Custom scripts for batch processing and automated notifications.

## 🏁 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- API Keys: `GROQ_API_KEY`, `TAVILY_API_KEY`

### 2. Installation
```bash
# Install dependencies
cd server && npm install
cd ../client && npm install
```

### 3. Run Development
```bash
# Start Server
cd server && npm run dev

# Start Client
cd client && npm run dev
```

## 📂 Project Structure
```
├── client/          # React frontend & UI components
├── server/          # Node.js backend & AI Agents
│   ├── src/agents/  # AI Agent logic (Scout, Resume, Evaluation)
│   └── data/        # Application tracker storage
└── career-ops/      # Autonomous batch processing pipeline
```

---

*Built by Praveen Kumar — AI Research Engineer & Patent Holder.*
