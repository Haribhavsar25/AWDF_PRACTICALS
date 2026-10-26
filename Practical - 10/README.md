# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS009  
**Student Name:** Hari Bhavsar **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%2010.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%2010.git)

---

## 📌 Practical Overview & Objectives
The primary objective of Practical 10 is to implement **asynchronous background processing using Node.js native `EventEmitter`** without external message queue dependencies, demonstrating non-blocking architecture:
1. **Decoupled Architecture:** Creating a dedicated `events.js` module extending Node.js built-in `EventEmitter`.
2. **Dedicated Event Listeners:** Writing `listeners.js` to handle background processing (such as audit logging, user notification, and telemetry) independently from HTTP request-response cycles.
3. **Immediate API Response:** Emitting events (`taskEvents.emit('task-created', task)`) after database persistence while immediately returning HTTP 201 Created to the client before the background listeners complete execution.
4. **Empirical Timestamp Ordering:** Adding an artificial delay (2000 ms simulated slow worker) inside the notification listener to demonstrate empirical proof that the API response timestamp occurs before listener completion.
5. **Supplementary Problems:**
   - **Supplementary 1 (Task Deletion Event):** Implementing a dedicated `task-deleted` event with its own listener and audit message.
   - **Supplementary 2 (Error Boundary Listener):** Implementing an `error` event listener that safely catches and logs any errors thrown inside background handlers without terminating the Node.js process.
   - **Supplementary 3 (Simulated Heavy Background Processing):** Demonstrating that an intensive 2-second background task does not degrade client HTTP response latency.

---

## 📊 Empirical Verification & Timestamp Ordering

### Empirical Timing Log (Server Output)
```text
[2026-10-22T08:08:45.105Z] [POST /tasks] Database write completed in 13.3ms
[2026-10-22T08:08:45.106Z] [API RESPONSE] HTTP 201 Created sent to client in 14.1ms
[2026-10-22T08:08:45.106Z] [EVENT DISPATCH] Emitted 'task-created' event to background listeners
[2026-10-22T08:08:45.107Z] [NOTIFICATION LISTENER] Processing started for task: "Implement Docker Orchestration"
[2026-10-22T08:08:47.109Z] [NOTIFICATION LISTENER] Background work finished after 2002ms delay. Notification dispatched!
```

### Response Time & Execution Timeline Analysis
| Phase | Timestamp | Elapsed Time from Request | Client Status | Server State |
|---|---|---|---|---|
| Request Received | `08:08:45.092Z` | 0 ms | Waiting | Express routing |
| DB Write Done | `08:08:45.105Z` | 13.3 ms | Waiting | MongoDB write ACK |
| **API Response Sent** | **`08:08:45.106Z`** | **14.1 ms** | **Response Received (201 Created)** | **Client Unblocked** |
| Event Emitted | `08:08:45.106Z` | 14.1 ms | Browsing app | Synchronous dispatch |
| Async Worker Starts | `08:08:45.107Z` | 15.0 ms | Independent | Event loop Timer scheduled |
| **Async Worker Finished** | **`08:08:47.109Z`** | **2017.0 ms** | **Already Done (2002ms prior)** | **Background complete** |

---

## 🏗️ Architecture & Event-Driven Processing Flow

```text
POST /tasks Request
       │
       ▼
 Save task to MongoDB (13.3ms)
       │
       ▼
 ┌──────────────────────────────────────────────────────────┐
 │  res.status(201).json(task)                              │
 │  API responds IMMEDIATELY to client (14.1ms total)       │
 └──────────────────────────────────────────────────────────┘
       │
       ▼
 taskEvents.emit('task-created', task)
       │
       ├─────────────────────────────────┬─────────────────────────────────┐
       ▼                                 ▼                                 ▼
 [Notification Listener]       [Audit Log Listener]             [Error Handling Boundary]
 - Simulates slow 2000ms worker - Logs task title, user, date    - Catches any listener error
 - Dispatches email/SMS alert   - Writes to audit ledger         - Prevents uncaughtException crash
 - Finishes at +2002ms later    - Finishes asynchronously        - Logs structured error details
```

---

## 📡 API Reference & Endpoints

| Method | Endpoint | Event Emitted | Asynchronous Behavior |
|---|---|---|---|
| `GET` | `/` | None | Health check and event system telemetry status |
| `GET` | `/tasks` | None | Returns task list with total count |
| `POST` | `/tasks` | `task-created` | Responds in ~14ms; notification listener runs asynchronously (2s delay) |
| `DELETE` | `/tasks/:id` | `task-deleted` | Responds in ~10ms; audit deletion listener runs asynchronously |
| `POST` | `/test-error` | `error` | Simulates background handler error; caught by error listener without crash |

---

## 🚀 Setup & Execution Instructions

```bash
cd "Practical - 10/backend"

# Install dependencies (express, mongoose, dotenv, cors)
npm install

# Start the Event-Driven Server
node server.js
# Server runs on http://localhost:5000
```

---

## 📸 Output Screenshots & Verification
1. `pr10_terminal_timestamp_ordering.png`: Terminal logs verifying API response timestamp occurs before listener completion (14ms vs 2002ms).
2. `pr10_postman_immediate_api_response.png`: Postman testing `POST /tasks` returning `201 Created` in 18ms without being blocked by the 2000ms worker.
3. `pr10_event_task_deleted_listener.png`: Terminal & Postman demonstration of `DELETE /tasks/:id` triggering the custom `task-deleted` event listener.
4. `pr10_event_error_handling_listener.png`: Demonstration of the error boundary listener catching unhandled errors safely without crashing the server.
5. `pr10_architecture_event_flow_ui.png`: Fullstack React dashboard visualizing real-time asynchronous background event logs and latency metrics.
6. `pr10_github_repo.png`: GitHub repository deliverable evidence for `Haribhavsar25/AWDF-PR-10`.

---

## 📜 Key Questions & Theoretical Analysis

### 1. Why does emitting an event not block the API response, even though both run on the same Node.js process?
In Node.js, `taskEvents.emit('event', data)` executes listener functions synchronously by default within the single-threaded event loop unless deferred. By scheduling side-effect operations via asynchronous APIs (such as `setTimeout`, `setImmediate`, or asynchronous network I/O) inside the listener, the callback is offloaded to the Node.js libuv event loop timer or I/O queue. Because `res.status(201).json(task)` executes before or independently of the asynchronous callback, the HTTP response socket flushes immediately to the client. Both share the single main thread, but non-blocking I/O and event scheduling allow the event loop to service the HTTP response without waiting for background completion.

### 2. What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?
If synchronous or awaited notification logic (e.g., waiting 2000ms for third-party email/SMS gateways) was placed sequentially inside the route handler before `res.json()`, the HTTP client would experience an immediate latency increase of at least 2000ms (increasing total response time from 14ms to ~2015ms). Furthermore, under high concurrent traffic, holding open HTTP connections for 2+ seconds depletes connection pools, increases server memory consumption, and degrades perceived user experience. Event decoupling isolates the critical request-response path from side effects.

### 3. Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?
`EventEmitter` is an in-memory, process-local mechanism. It is lightweight, zero-dependency, and exceptionally fast for single-instance applications. However, in enterprise microservices or high-scale production systems:
- **No Persistence:** If the Node.js process crashes or restarts, any queued or in-flight events are permanently lost.
- **Single Process Limitation:** It cannot distribute events across multiple server instances or cluster workers.
- **No Backpressure or Retries:** There is no built-in mechanism for dead-letter queues, exponential backoff, rate limiting, or consumer acknowledgments.
Production systems handling millions of events use distributed message brokers (such as RabbitMQ, Apache Kafka, Amazon SQS, or Redis BullMQ) to ensure fault tolerance, durable queuing, and horizontal scalability.
