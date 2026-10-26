# Practical 7: Authentication and Middleware Pipeline

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS009  
**Student Name:** Hari Bhavsar **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%207.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%207.git)

---

## 📌 Practical Overview & Objectives
The primary objective of Practical 7 is to implement **JWT-based authentication** and **server-side input validation** as part of the Express middleware pipeline:
1. **User Authentication:** Creating a dedicated `User` schema in MongoDB with unique email validation and bcrypt-hashed passwords.
2. **Password Security with Bcrypt:** Ensuring plain-text passwords are never persisted; salting and hashing with work factor 10.
3. **JSON Web Token (JWT) Issuance:** Signing JWT access tokens upon successful authentication with 1-hour expiration and user identifier payload.
4. **Authentication Middleware:** Creating an `auth.js` middleware intercepting requests, parsing `Authorization: Bearer <token>`, verifying token validity, and injecting decoded credentials into `req.user`.
5. **Input Validation Middleware:** Creating a `validate.js` middleware enforcing request body integrity (required fields, minlength, enum rules) before reaching the controller.
6. **Supplementary Problems:**
   - **`/me` Endpoint:** Authenticated profile inspection returning user details from decoded JWT without password leakage.
   - **Token Expiry & 401 Interception:** Client-side handling intercepting 401 Unauthorized and redirecting expired sessions to `/login?expired=true`.
   - **Logout Mechanism:** Secure client-side token invalidation and state reset.

---

## 🏗️ Architecture & Middleware Pipeline

```text
POST /register ──► validateAuth ──► bcrypt.hash(pwd, 10) ──► User.create() ──► 201 Created (Token)
POST /login    ──► validateAuth ──► bcrypt.compare()     ──► jwt.sign()     ──► 200 OK (Token)

Protected Route Flow (e.g. GET /tasks, POST /tasks):
Client Request [Authorization: Bearer <token>]
       │
       ▼
 [auth Middleware] ────────► If missing / expired: Return 401 Unauthorized
       │ (valid token)
       ▼ (req.user = decoded)
 [validateTask Middleware] ─► If invalid body: Return 400 Bad Request
       │ (valid data)
       ▼
 Controller (Task Routes) ──► MongoDB Query (Scoped to req.user.id) ──► 200 / 201 Response
```

---

## 📡 API Reference & Endpoints

| Method | Endpoint | Protection | Description | Status Codes |
|---|---|---|---|---|
| `GET` | `/` | Public | API status, Mongoose connection state, and route index | `200 OK` |
| `POST` | `/register` | Public (Validated) | Register user, hash password with bcrypt, return JWT | `201 Created`, `400` |
| `POST` | `/login` | Public (Validated) | Verify credentials with bcrypt, sign & return 1h JWT | `200 OK`, `401` |
| `GET` | `/me` | Protected (`auth`) | Retrieve currently authenticated user profile | `200 OK`, `401`, `404` |
| `GET` | `/tasks` | Protected (`auth`) | Retrieve tasks belonging strictly to authenticated user | `200 OK`, `401` |
| `POST` | `/tasks` | Protected (`auth`, `validate`) | Create new user-scoped task with input validation | `201 Created`, `400`, `401` |
| `PUT` | `/tasks/:id` | Protected (`auth`) | Update task belonging to authenticated user | `200 OK`, `400`, `401`, `404` |
| `DELETE` | `/tasks/:id` | Protected (`auth`) | Delete task belonging to authenticated user | `200 OK`, `400`, `401`, `404` |

---

## 🚀 Setup & Execution Instructions

### 1. Backend Setup
```bash
cd "Practical - 7/backend"
npm install
node server.js
# Backend runs on http://localhost:5000
```

### 2. Frontend Setup (In Separate Terminal)
```bash
cd "Practical - 7/frontend"
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📸 Output Screenshots & Verification
1. `pr7_terminal_auth_pipeline.png`: Express server execution connecting to MongoDB `task_auth_db` and logging authentication/protected routes.
2. `pr7_postman_login_jwt.png`: Postman testing `POST /login` with password verification and signed JWT token return.
3. `pr7_postman_protected_tasks.png`: Postman testing `GET /me` and `/tasks` with `Authorization: Bearer <token>` header.
4. `pr7_postman_401_unauthorized.png`: Postman verifying middleware security rejections (`401 Unauthorized` without token, `400 Bad Request` on validation failure).
5. `pr7_react_auth_dashboard.png`: React Single Page Application showing authenticated dashboard, user profile, and token expiry simulation.
6. `pr7_github_repo.png`: GitHub repository deliverable view for `Haribhavsar25/AWDF-PR-7`.

---

## 📜 Key Questions & Theoretical Analysis

### 1. Why must passwords be hashed before storage instead of saved as plain text, even in a lab/demo project?
Storing passwords in plain text creates severe vulnerabilities:
- If the database is compromised via SQL/NoSQL injection, accidental backups leakage, or insider threat, all user credentials are exposed immediately.
- Users frequently reuse passwords across multiple services; a compromise in one app compromises their identity elsewhere.
- Using **bcrypt** with salted hashing ensures that even identical passwords produce completely different hash digests, and the intentional computational cost (work factor) makes brute-force and rainbow table attacks computationally infeasible.

### 2. What does the authentication middleware actually verify, and what happens if the token is missing or expired?
The `auth.js` middleware performs three crucial steps:
1. **Header Parsing:** Ensures the `Authorization` header exists and adheres strictly to the `Bearer <token>` format. If missing, it immediately rejects with `401 Unauthorized`.
2. **Cryptographic Signature Verification:** Calls `jwt.verify(token, JWT_SECRET)`. It validates that the token was signed with the server's private secret and that its payload has not been tampered with.
3. **Expiration Check:** Validates the `exp` timestamp. If expired, `jwt.verify()` throws a `TokenExpiredError`, which the middleware catches and returns as `401 Unauthorized: Token has expired`.

### 3. Why should input validation happen on the server even if the frontend already validates the same fields?
Client-side validation is purely for user experience (immediate feedback). It provides **zero security guarantee** because HTTP requests can be forged or submitted directly via tools like Postman, cURL, or automated scripts without executing client JavaScript. Server-side validation middleware acts as the non-negotiable security boundary, ensuring malformed or malicious payloads are halted before touching the database.
