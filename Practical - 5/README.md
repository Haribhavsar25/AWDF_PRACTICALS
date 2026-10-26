# Practical 5: MongoDB Integration and Schema Design with Mongoose

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS009  
**Student Name:** Hari Bhavsar **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%205.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%205.git)

---

## 📌 Practical Overview & Objectives
The primary objective of this practical is to connect an Express.js backend application to a **MongoDB** NoSQL database using the **Mongoose ODM (Object Data Modeling)** library, enforce schema-level constraints and validation, and transition from transient in-memory arrays to persistent document storage:
1. **Database Integration:** Establishing an asynchronous connection to MongoDB via `mongoose.connect()` using environment variables (`dotenv`).
2. **Mongoose Schema Design:** Creating a structured `Task` model with strict field types, required constraints, and default values.
3. **Mongoose CRUD Methods:** Replacing in-memory array manipulation with native Mongoose queries (`Task.find()`, `Task.create()`, `Task.findById()`, `Task.findByIdAndUpdate()`, `Task.findByIdAndDelete()`).
4. **Structured Validation Error Handling:** Catching Mongoose `ValidationError` and `CastError` objects and returning sanitized, structured JSON responses rather than raw internal error objects.
5. **Supplementary Enhancements:**
   - **Priority Enum:** Restricting the `priority` field strictly to `['low', 'medium', 'high']`.
   - **Pre-save Hook:** Implementing a Mongoose pre-save middleware hook that automatically sanitizes and trims whitespace from the `title` field.
   - **Single Task Retrieval & 404 Handling:** `GET /tasks/:id` validating 24-character hexadecimal `ObjectId` format and returning a clean `404 Not Found` JSON if missing.
   - **Environment Configuration:** Secure `.env` management with `.env` excluded in `.gitignore` and `.env.example` provided.

---

## 🏗️ Architecture & Data Flow

```text
Express App ───► Mongoose ODM ───► MongoDB Database (mongodb://127.0.0.1:27017)
                                          └── task_manager_db
                                                └── tasks collection
                                                      ├── _id (ObjectId)
                                                      ├── title (String, required, minlength: 3, trimmed)
                                                      ├── description (String, default: '')
                                                      ├── completed (Boolean, default: false)
                                                      ├── priority (String, enum: ['low', 'medium', 'high'])
                                                      ├── createdAt (Date, default: Date.now)
                                                      └── updatedAt (Date)

[Schema Validation & Hooks Pipeline]
Request JSON ──► Pre-save Hook (Trim title) ──► Schema Validators (Required, Enum) ──► MongoDB Document
```

---

## 📡 API Reference & Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | API status, Mongoose connection state, and route index | `200 OK` |
| `GET` | `/tasks` | Retrieve all persistent tasks from MongoDB | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single task document by MongoDB `_id` | `200 OK`, `400`, `404` |
| `POST` | `/tasks` | Create new task document with schema validation | `201 Created`, `400` |
| `PUT` | `/tasks/:id` | Update task document with validator enforcement | `200 OK`, `400`, `404` |
| `DELETE` | `/tasks/:id` | Delete task document from MongoDB by `_id` | `200 OK`, `400`, `404` |
| `POST` | `/tasks/seed` | Seed initial sample task documents into MongoDB | `201 Created` |

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB Server running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas
- Postman or Thunder Client for testing

### Installation & Configuration
```bash
# Clone the repository
git clone https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%205.git
cd AWDF-PR-5

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Ensure MONGO_URI=mongodb://127.0.0.1:27017/task_manager_db in .env
```

### Running the Server
```bash
# Start server
npm start

# Server Output:
# Server running on port 5000
# Ready to accept REST client requests at http://localhost:5000
# MongoDB connected successfully
# Database connected at: mongodb://127.0.0.1:27017/task_manager_db
```

---

## 🧪 Postman & cURL Verification Examples

```bash
# 1. Seed initial data
curl -X POST http://localhost:5000/tasks/seed

# 2. GET all tasks
curl -X GET http://localhost:5000/tasks

# 3. POST new task with whitespace (tests pre-save trim hook & priority enum)
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "   Deploy MongoDB Atlas Cluster   ", "priority": "high", "completed": false}'

# 4. POST test validation failure (missing required title) -> 400 Bad Request
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"description": "No title provided"}'

# 5. POST test enum validation failure (invalid priority) -> 400 Bad Request
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "priority": "urgent"}'

# 6. GET by ID -> 200 OK
curl -X GET http://localhost:5000/tasks/<mongo_object_id>
```
