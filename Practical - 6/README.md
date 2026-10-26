# Practical 6: Full Stack Integration React + Node + MongoDB

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS009  
**Student Name:** Hari Bhavsar **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%206.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%206.git)

---

## 📌 Practical Overview & Objectives
The primary objective of Practical 6 is to wire the **React 18 frontend** to the **Node/Express/MongoDB backend** into a fully functional, complete full-stack web application:
1. **Full-Stack Wiring:** Connecting the React Single Page Application (hosted on `http://localhost:5173`) to the Express REST API (running on `http://localhost:5000`) and MongoDB database (`task_manager_db`).
2. **CORS Configuration:** Configuring Cross-Origin Resource Sharing on Express using `cors` middleware (`app.use(cors())`) to permit cross-origin requests from the Vite frontend development server.
3. **Centralized API Service:** Establishing a dedicated API client module (`src/api/api.js`) encapsulating base URL constants, standardized fetch options, response parsing, and error unwrapping.
4. **End-to-End CRUD Operations:** Implementing create (`POST /tasks`), read (`GET /tasks`), update (`PUT /tasks/:id`), and delete (`DELETE /tasks/:id`) operations driven directly by user interactions in the React UI.
5. **Data Persistence Across Reloads:** Confirming that all mutations persist directly in the MongoDB database and remain intact upon refreshing the browser.
6. **Supplementary Problem Implementations:**
   - **Optimistic UI Updates:** New tasks are immediately displayed in the React UI with a temporary identifier and "⏳ Saving..." status indicator before the backend confirms creation.
   - **Delete Confirmation Dialog:** A modal dialog prompt prevents accidental task deletions from MongoDB.
   - **Toast Notifications:** Real-time animated toast alerts provide immediate visual confirmation of operation success or failure.

---

## 🏗️ Architecture & Data Flow Diagram

```text
React Frontend (localhost:5173)
  ├── Components: Navbar, TaskForm, TaskItem, ConfirmModal, Toast, Spinner, Footer
  ├── Centralized API Service: src/api/api.js (BASE_URL = http://localhost:5000)
  │
  │ fetch() / HTTP Request [Origin: http://localhost:5173]
  ▼
Express Backend (localhost:5000)
  ├── CORS Middleware: Access-Control-Allow-Origin: *
  ├── Request Logger & Body Parser
  ├── RESTful CRUD Routing: /tasks
  │
  │ Mongoose ODM 8.9.5
  ▼
MongoDB Database (mongodb://127.0.0.1:27017/task_manager_db)
  └── tasks collection (schema validation, priority enum, pre-save hook)
```

### Complete End-to-End Flow:
1. **Create Flow:** User submits Form → React adds task optimistically (`temp_id`) → `POST /tasks` → Express validates with Mongoose → MongoDB writes document → Express returns `201 Created` with persistent `_id` → React reconciles state and displays success toast.
2. **Read Flow:** Component Mounts (`useEffect`) → `GET /tasks` → Mongoose fetches sorted documents → React renders interactive task cards with live metrics.
3. **Update Flow:** User clicks completion checkbox → React fires `PUT /tasks/:id` with updated boolean → MongoDB updates document (`returnDocument: 'after'`) → UI re-renders completed task styling.
4. **Delete Flow:** User clicks Delete → Confirmation Modal dialog appears → User confirms → `DELETE /tasks/:id` removes document from MongoDB → UI updates state and shows deletion toast.

---

## 📡 API Reference & Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | API Health check & endpoint summary | `200 OK` |
| `GET` | `/tasks` | Retrieve all persistent tasks from MongoDB | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single task by 24-character hexadecimal `_id` | `200 OK`, `400`, `404` |
| `POST` | `/tasks` | Create new task document with schema validation | `201 Created`, `400` |
| `PUT` | `/tasks/:id` | Update task completed status or details | `200 OK`, `400`, `404` |
| `DELETE` | `/tasks/:id` | Delete task document from MongoDB by `_id` | `200 OK`, `400`, `404` |
| `POST` | `/tasks/seed` | Seed initial sample task documents into MongoDB | `201 Created` |

---

## 🚀 Setup & Execution Instructions

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **MongoDB Server:** Running locally at `mongodb://127.0.0.1:27017`

### 2. Backend Setup & Startup
```bash
# Navigate to backend directory
cd "Practical - 6/backend"

# Install dependencies (express, mongoose, dotenv, cors)
npm install

# Start Express backend server
node server.js
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup & Startup (In Separate Terminal)
```bash
# Navigate to frontend directory
cd "Practical - 6/frontend"

# Install dependencies (react, react-dom, react-router-dom, vite)
npm install

# Start Vite React development server
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Verification Flow
1. Open your browser and navigate to `http://localhost:5173/tasks`.
2. Inspect the Chrome DevTools Network Tab: Observe `GET /tasks` returning `200 OK` with `Access-Control-Allow-Origin: *`.
3. Add a new task using the creation form to observe the **Optimistic UI update** and the **Success Toast**.
4. Click Delete on any task to trigger the **Delete Confirmation Modal**. Confirm deletion and observe persistent database removal.
5. Refresh the browser page (`F5`) to verify that all data persists from MongoDB.

---

## 📸 Practical 6 Verification Screenshots

The `screenshots/` directory contains verified evidence of all lab deliverables:
1. `pr6_dual_terminal_execution.png`: Dual command execution showing Express on port 5000 and Vite on port 5173.
2. `pr6_react_task_dashboard.png`: React Task Dashboard rendering live tasks from MongoDB with metrics bar.
3. `pr6_optimistic_ui_and_toast.png`: Optimistic UI state with `⏳ Saving...` pill and real-time success toast.
4. `pr6_delete_confirmation_modal.png`: Interactive modal confirmation dialog before database deletion.
5. `pr6_cors_network_devtools.png`: Chrome DevTools Network Tab verifying CORS response headers.
6. `pr6_github_repo.png`: GitHub repository deliverable view for `AWDF-PR-6`.

---

## 📜 Key Questions & Theoretical Analysis

### 1. What changes are required on the backend (CORS) to allow the React dev server to call the Express API?
Browsers enforce the **Same-Origin Policy (SOP)** by default, restricting web applications running at one origin (e.g., `http://localhost:5173`) from making asynchronous XMLHttpRequest or Fetch requests to a different origin (e.g., `http://localhost:5000`). To resolve this:
- The Express server installs the `cors` middleware (`npm install cors`).
- The middleware is mounted before all route handlers: `app.use(cors())`.
- This causes Express to include the `Access-Control-Allow-Origin: *` response header on all incoming requests and automatically respond to HTTP `OPTIONS` preflight checks.

### 2. Why should the UI re-fetch or update local state after a successful POST/PUT/DELETE rather than assuming success silently?
Assuming success silently without server confirmation risks **state divergence**:
- The server may reject the write due to schema validation failures, database network partitions, or duplicate key constraints.
- Generated database fields (such as MongoDB's `_id` and Mongoose `createdAt`/`updatedAt` timestamps) only exist on the server. Updating local state from the server response ensures the client's internal state remains an exact replica of the database source of truth.

### 3. What is the risk of not handling errors on write operations (POST/PUT/DELETE) the same way as read operations (GET)?
If errors on write operations are unhandled or suppressed:
- The user is led to believe their data has been saved or modified when it was actually rejected.
- When the user refreshes or re-fetches the view, their changes abruptly disappear, leading to critical data loss and a degraded user experience.
- Error states must surface clear visual feedback (such as structured toast messages or inline alerts) and cleanly roll back any optimistic updates.
