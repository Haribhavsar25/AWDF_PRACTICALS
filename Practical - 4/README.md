# Practical 4: Building a RESTful API with Node.js and Express

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS057  
**Student Name:** Shubham Pansuriya  
**GitHub Repository:** [https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%204.git](https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%204.git)

---

## 📌 Practical Overview & Objectives
The primary objective of this practical is to design, implement, and document a robust RESTful backend API using **Node.js** and **Express.js**, enforcing a production-grade request-response middleware processing pipeline:
1. **RESTful Architecture:** Complete CRUD endpoints for task management using HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
2. **Global Request Logging Middleware:** Intercepts and logs every incoming HTTP request with method, URL, and an ISO timestamp.
3. **Content-Type Validation Middleware:** Rejects `POST` and `PUT` requests that omit `Content-Type: application/json` with a structured `400 Bad Request`.
4. **Route-Specific Parameter Validation:** Validates that `:id` parameters are positive integers before reaching controller logic, returning `400 Bad Request` on invalid formats.
5. **Custom 404 Not Found Handler:** Catches all unmatched routes and returns a structured JSON error payload.
6. **Centralized Global Error Handler:** Implements a 4-argument error handler `(err, req, res, next)` as the final pipeline layer to capture unhandled server errors with `500 Internal Server Error`.

---

## 🏗️ Middleware Pipeline & Request Flow

```text
Incoming Client Request (Postman / Browser)
   │
   ▼
[ express.json() & cors() ]  ─── Parses incoming JSON request payloads
   │
   ▼
[ Global Logging Middleware ] ─── Logs [ISO Timestamp] METHOD URL
   │
   ▼
[ Content-Type Validator ]   ─── Rejects POST/PUT if Content-Type != application/json (400)
   │
   ▼
[ Express Router ]
   ├── GET    /tasks           ─── 200 OK: Retrieves all tasks
   ├── GET    /tasks/:id       ─── 200 OK / 404: Validates ID, retrieves single task
   ├── POST   /tasks           ─── 201 Created: Validates title, creates task
   ├── PUT    /tasks/:id       ─── 200 OK / 404: Updates task fields
   ├── DELETE /tasks/:id       ─── 200 OK / 404: Deletes task from memory
   └── GET    /simulate-error  ─── Throws deliberate error to test error handler
   │
   ▼
[ 404 Not Found Handler ]     ─── Returns 404 for undefined routes
   │
   ▼
[ Global Error Handler ]      ─── 4-param (err, req, res, next) catching 500 errors
```

---

## 📡 API Reference & Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | API status, metadata, and available route map | `200 OK` |
| `GET` | `/tasks` | Retrieve list of all tasks | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve a specific task by numeric ID | `200 OK`, `400`, `404` |
| `POST` | `/tasks` | Create a new task (requires JSON body) | `201 Created`, `400` |
| `PUT` | `/tasks/:id` | Update an existing task's title or completed status | `200 OK`, `400`, `404` |
| `DELETE` | `/tasks/:id` | Delete a task by ID | `200 OK`, `400`, `404` |
| `GET` | `/simulate-error` | Deliberately triggers global error middleware | `500 Internal Error` |
| `ANY` | `/undefined` | Unmatched fallback route | `404 Not Found` |

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Postman or Thunder Client for REST testing

### Installation
```bash
# Clone the repository
git clone https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%204.git
cd AWDF-PR-4

# Install dependencies
npm install
```

### Starting the Server
```bash
# Run server
npm start

# Server output:
# Server running on port 5000
# Ready to accept REST client requests at http://localhost:5000
```

---

## 🧪 Testing with cURL / Postman

```bash
# 1. GET all tasks
curl -X GET http://localhost:5000/tasks

# 2. POST create a new task
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Implement MongoDB integration", "completed": false}'

# 3. PUT update task
curl -X PUT http://localhost:5000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# 4. DELETE task
curl -X DELETE http://localhost:5000/tasks/1

# 5. Test 400 Bad Request (Missing Header)
curl -X POST http://localhost:5000/tasks -d "Plain text"

# 6. Test 404 Route Not Found
curl -X GET http://localhost:5000/unknown-path

# 7. Test 500 Global Error Handler
curl -X GET http://localhost:5000/simulate-error
```
