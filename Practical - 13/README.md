# Practical 13: AI API Integration into a Web Application

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS009  
**Student Name:** Hari Bhavsar **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%2013.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%2013.git)

---

## 📌 Practical Overview & Objectives
The primary objective of Practical 13 is to **securely integrate an external AI service (OpenAI / Gemini) into a full-stack web application** while enforcing responsible AI governance, API key privacy, and system resilience:
1. **Secure Server-Side AI Gateway:** Calling the AI API exclusively from a Node.js Express backend route (`/api/ai/generate-description`). The API secret key is stored strictly within `.env` on the server and is never transmitted or exposed to the client browser.
2. **Context-Aware Assistance:** The AI endpoint synthesizes a meaningful 2-sentence task description, infers priority (high/medium/low), and suggests a realistic completion timeline based on the task title.
3. **Graceful Degradation Architecture:** If the external AI service times out, experiences rate limits, or suffers an outage, the application catches the error seamlessly, serves an intelligent local contextual fallback, and preserves 100% of the core user workflow without crashing.
4. **Editable UI Integration:** AI responses are presented in the React UI as interactive, editable suggestions that students can accept, refine, or reject before saving.
5. **Supplementary Problems Completed:**
   - **Supplementary 1 (Frontend Loading State):** Added visual loading states and animated spinners during the asynchronous AI synthesis cycle.
   - **Supplementary 2 (Rate Limiting Protection):** Implemented an in-memory sliding window rate limiter (max 5 requests/minute per client IP) returning HTTP 429 to prevent denial of service and quota exhaustion.
   - **Supplementary 3 (Responsible AI Disclaimer):** Prominently displayed an institutional disclaimer in the UI informing users that recommendations are AI-generated and subject to review.

---

## 🏗️ Architecture & Graceful Degradation Pipeline

```text
React Frontend (User clicks "Generate with AI")
       │
       ▼
 Express Backend Route: POST /api/ai/generate-description
       │
       ├──► [Rate Limiter Check] ──► Exceeded? ──► Return 429 Too Many Requests
       │
       ▼ (Under limit)
 Read OPENAI_API_KEY from server-side .env (Zero browser leakage)
       │
       ▼
 Call External AI API (OpenAI gpt-4o-mini / Gemini API)
       │
       ├───────────────────────────────────────────┬───────────────────────────────────────────┐
       ▼                                           ▼                                           ▼
 [Successful API Response (200)]             [API Error / Timeout / 401]                [Network Down / Offline]
 Parse choices[0].message                    Catch error in try/catch                   Catch network exception
       │                                           │                                           │
       ▼                                           ▼                                           ▼
 Return structured AI suggestion             [Graceful Degradation Fallback]             [Graceful Degradation Fallback]
 (Description + Priority + Deadline)        Synthesize smart contextual task            Synthesize smart contextual task
                                             Return 200 OK with fallback: true           Return 200 OK with fallback: true
       │                                           │                                           │
       └───────────────────────────────────────────┴───────────────────────────────────────────┘
                                                   │
                                                   ▼
                     React UI Form: Populates interactive editable fields
                     Displays clear AI Disclaimer: "AI-generated suggestion"
```

---

## 📡 API Reference & Endpoints

| Method | Endpoint | Protection | Response Code | Description |
|---|---|---|---|---|
| `POST` | `/api/ai/generate-description` | Rate Limited (5 req/min) | `200 OK` | Synthesizes task description, priority, and deadline |
| `POST` | `/api/ai/generate-description` | Rate Limited | `429 Too Many Requests` | Triggered when client exceeds request threshold |
| `GET` | `/tasks` | Standard API | `200 OK` | Fetches active task collection |
| `POST` | `/tasks` | Input Validated | `201 Created` | Persists new task to MongoDB database |
| `DELETE` | `/tasks/:id` | Mongoose ID | `200 OK` | Deletes task document |

---

## 🚀 Setup & Execution Instructions

```bash
cd "Practical - 13/backend"

# Install backend dependencies
npm install

# Configure environment variables (Store real API key server-side only)
cp .env.example .env
# Edit .env with your OPENAI_API_KEY or GEMINI_API_KEY

# Start Express server
node server.js
# Server runs on http://localhost:5000
```

---

## 📸 Output Screenshots & Verification
1. `pr13_react_ai_generation_ui.png`: React user interface showing "Generate with AI" button, animated loading state, synthesized description, priority tag, and visible AI disclaimer badge.
2. `pr13_terminal_server_ai_logs.png`: Terminal logs showing server-side handling of `POST /api/ai/generate-description` and secure `.env` key isolation.
3. `pr13_postman_ai_endpoint_success.png`: Postman testing `/api/ai/generate-description` returning HTTP 200 OK with full AI suggestion payload.
4. `pr13_postman_graceful_fallback.png`: Demonstration of Graceful Degradation: Simulating provider outage where backend returns smart contextual fallback without crashing.
5. `pr13_rate_limiting_429_inspection.png`: Supplementary Problem 2: Demonstration of rate limiting middleware returning HTTP 429 Too Many Requests.
6. `pr13_github_repo.png`: GitHub repository deliverable evidence for `Haribhavsar25/AWDF-PR-13`.

---

## 📜 Key Questions & Theoretical Analysis

### 1. Why must the AI API key be called from the backend rather than directly from the React frontend?
Frontend code runs entirely inside the end-user's web browser environment. If an API key is stored in frontend code (even in `.env.local` bundled by Vite/Webpack), it is compiled into client-side JavaScript bundles and can be extracted in seconds via browser DevTools or Network tabs. Malicious actors can scrape exposed keys to rack up thousands of dollars in unauthorized API bills or abuse rate quotas. Calling third-party AI APIs through a backend proxy guarantees that secret credentials remain secure inside the server environment and enables strict authorization, server-side rate limiting, and prompt injection filtering.

### 2. What does 'graceful degradation' mean in this context, and why does it matter for a feature that depends on a third-party service outside your control?
Graceful degradation is a software resilience pattern where a system continues to operate in a reduced, acceptable capacity when one of its non-critical components fails, rather than suffering a catastrophic crash. External AI services are distributed third parties subject to network latency, downtime, DNS failures, or billing limit exhausts. If an application couples its primary task-creation flow tightly to an external AI API without fallback handling, any AI outage paralyzes the entire web application. By catching errors and serving fallback suggestions, the user can continue creating tasks uninterrupted.

### 3. What are the privacy and governance implications of sending task data to an external AI API, and what kind of data should never be sent this way?
Sending application data to third-party AI APIs introduces serious data sovereignty, privacy, and regulatory (GDPR / HIPAA / institutional policy) concerns:
- **Data Retention & Model Training:** Unless enterprise Zero Data Retention (ZDR) agreements are established, providers may log or train future foundation models on submitted prompt inputs.
- **Data Prohibited from Submission:** Personally Identifiable Information (PII) such as passwords, social security numbers, banking credentials, medical records, confidential business strategies, and proprietary internal codebases must **never** be sent to public AI endpoints without sanitization or anonymization layers.
