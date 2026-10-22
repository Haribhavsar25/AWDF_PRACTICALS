# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI/CD Pipeline](https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%2012/actions/workflows/ci.yml/badge.svg)](https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%2012/actions/workflows/ci.yml)
[![Tests Passed](https://img.shields.io/badge/Tests-5%20Passed-brightgreen.svg)](https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%2012/actions)
[![Node Version](https://img.shields.io/badge/Node-v18.x-blue.svg)](https://nodejs.org/)

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS057  
**Student Name:** Shubham Pansuriya  
**GitHub Repository:** [https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%2012.git](https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%2012.git)

---

## 📌 Practical Overview & Objectives
The primary objective of Practical 12 is to implement an **automated Continuous Integration / Continuous Deployment (CI/CD) pipeline using GitHub Actions** to enforce automated code quality and testing on every code push and pull request:
1. **GitHub Actions Workflow Automation:** Defining `.github/workflows/ci.yml` triggered automatically on `push` and `pull_request` targeting the `main` branch.
2. **Automated Test Suite with Jest & Supertest:** Developing automated API integration tests covering health checks (`GET /health`), task retrieval (`GET /tasks`), task creation (`POST /tasks`), validation error rejection (`POST /tasks` without title returning 400), and 404 error boundaries.
3. **Deliberate Failure & Fix Demonstration:**
   - Demonstrating a **failing pipeline (Red ❌)** by simulating an assertion mismatch in the test suite to observe CI failure notifications and error diagnostic logs.
   - Demonstrating a **passing pipeline (Green ✔️)** once the test assertions are corrected.
4. **Supplementary Problems Completed:**
   - **Supplementary 1 (Linting Job):** Added a dedicated pre-test job (`lint`) verifying code quality and syntax before running the test suite (`needs: lint`).
   - **Supplementary 2 (Pull Request Trigger):** Configured pipeline triggers for both direct pushes and pull requests targeting `main`.
   - **Supplementary 3 (Status Badge):** Embedded a real-time GitHub Actions status badge in this `README.md` reflecting live build health.

---

## 🏗️ Architecture & Pipeline Flow

```text
git push origin main  OR  Pull Request -> main
         │
         ▼
 GitHub Actions Workflow Trigger
         │
 ┌──────────────────────────────────────────────┐
 │  Job 1: lint (Code Quality & Syntax Check)    │
 │  ├── actions/checkout@v4                     │
 │  ├── actions/setup-node@v4 (Node.js 18)      │
 │  ├── npm install                             │
 │  └── node --check server.js                  │
 └──────────────────────┬───────────────────────┘
                        │
                        ▼ (on lint success)
 ┌──────────────────────────────────────────────┐
 │  Job 2: build-and-test (Automated Testing)    │
 │  ├── actions/checkout@v4                     │
 │  ├── actions/setup-node@v4 (Node.js 18)      │
 │  ├── npm install                             │
 │  ├── npm test (Jest + Supertest API Suite)   │
 │  └── Report build pass/fail status           │
 └──────────────────────┬───────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
   Green ✔️ (All Passed)         Red ❌ (Test Failed)
   Status: Succeeded             Status: Blocked / Failed
```

---

## 🧪 Automated Test Suite Summary (`backend/tests/tasks.test.js`)

| # | Test Case Description | Method & Endpoint | Expected Status | Result |
|---|---|---|---|---|
| 1 | Pipeline liveness & health check | `GET /health` | `200 OK` | **PASS** |
| 2 | Fetch all active task documents | `GET /tasks` | `200 OK` | **PASS** |
| 3 | Create new task document | `POST /tasks` | `201 Created` | **PASS** |
| 4 | Rejection of malformed request without title | `POST /tasks` | `400 Bad Request` | **PASS** |
| 5 | Return 404 for nonexistent task ID | `GET /tasks/:id` | `404 Not Found` | **PASS** |

---

## 🚀 Setup & Execution Instructions

```bash
# Navigate to backend directory
cd "Practical - 12/backend"

# Install project dependencies including Jest and Supertest
npm install

# Run automated test suite locally
npm test

# Trigger CI/CD pipeline on GitHub
git add .
git commit -m "feat: Add CI/CD automated pipeline"
git push origin main
```

---

## 📸 Output Screenshots & Verification
1. `pr12_github_actions_failed_run.png`: GitHub Actions web console showing the **deliberately failed pipeline run (Red ❌)** with detailed Jest assertion failure logs.
2. `pr12_github_actions_passed_run.png`: GitHub Actions web console showing the **passing pipeline run (Green ✔️)** with all jobs (`lint` and `build-and-test`) succeeded.
3. `pr12_terminal_jest_tests_pass.png`: Local PowerShell terminal running `npm test` verifying all 5 automated test cases passing in under 1 second.
4. `pr12_workflow_yaml_editor.png`: Visual Studio Code editor displaying `.github/workflows/ci.yml` multi-job configuration.
5. `pr12_readme_status_badge.png`: GitHub repository homepage displaying the live passing CI status badge.
6. `pr12_github_repo.png`: GitHub repository deliverable evidence for `24cs057shubham/AWDF-PR-12`.

---

## 📜 Key Questions & Theoretical Analysis

### 1. What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical actually demonstrate?
- **Continuous Integration (CI):** The practice of automating the integration of code changes from multiple contributors into a shared codebase. As soon as code is pushed, CI runners automatically compile the code, run linters, and execute automated tests to detect bugs early.
- **Continuous Deployment (CD):** The next phase in the pipeline, where code that successfully passes all CI validation stages is automatically deployed to staging or production environments without manual intervention.
- **Scope Demonstrated:** This practical demonstrates **Continuous Integration (CI)** by validating code changes on push through automated dependency installation, linting, and regression test execution.

### 2. Why does running tests automatically on every push catch problems earlier than testing manually before a release?
Automating tests on every push adheres to the **shift-left testing** philosophy. When a developer pushes a small, incremental commit that introduces a regression or breaking change, the CI pipeline alerts them within seconds. Because the context of the recent change is fresh in the developer's mind, debugging is fast and straightforward. In contrast, manual testing done weeks later prior to release forces teams to comb through hundreds of merged commits to isolate root causes, resulting in delayed release cycles and significantly higher maintenance costs.

### 3. What would happen to the pipeline if the test file path were incorrect—would the workflow fail at the same step as a genuine test failure?
If the test file path is incorrect or omitted, Jest will fail during the test discovery phase reporting `No tests found` or an unresolvable path error. In GitHub Actions, this still fails inside the `Run automated tests` step (`npm test`), but with an exit code related to test runner invocation rather than test assertion failure. If Jest is configured with `--passWithNoTests`, Jest might exit with code 0, leading to a dangerous false positive where the pipeline passes without executing any assertions. Properly configuring test paths and requiring active tests ensures genuine verification.
