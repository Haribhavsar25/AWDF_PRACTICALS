# Practical 11: Containerization with Docker and Docker Compose

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS009  
**Student Name:** Hari Bhavsar **GitHub Repository:** [https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%2011.git](https://github.com/Haribhavsar25/AWDF_PRACTICALS/tree/main/Practical%20-%2011.git)

---

## 📌 Practical Overview & Objectives
The primary objective of Practical 11 is to **containerize the complete full-stack Task Management application using Docker** and orchestrate all services seamlessly with **Docker Compose**:
1. **Node.js Express Backend Dockerfile:** Packaging the REST API inside an Alpine-based Node.js runtime environment, exposing port 5000.
2. **React Frontend Multi-Stage Dockerfile:** Implementing a 2-stage build where Stage 1 builds the production Vite distribution bundle and Stage 2 runs a lean preview server on port 5173, drastically cutting final image size.
3. **Official MongoDB Container:** Provisioning `mongo:6.0` on port 27017 with persistent volume mapping.
4. **Multi-Service Orchestration (`docker-compose.yml`):** Unifying the 3 distinct services into a single orchestrated ecosystem configured with dependency order (`depends_on`).
5. **Inter-Container Networking (`app-network`):** Utilizing Docker's internal bridge network where containers communicate using service DNS names (`mongodb`, `backend`, `frontend`) rather than fragile host loopbacks (`localhost`).
6. **Supplementary Problems Completed:**
   - **Supplementary 1 (.dockerignore exclusion):** Excluded `node_modules` and `.env` from the build context to ensure fast, lean, reproducible image builds.
   - **Supplementary 2 (Multi-stage build):** Used a multi-stage Docker build for the React frontend, decoupling heavy build tooling from the final production runtime image.
   - **Supplementary 3 (Persistent named volume):** Configured a named volume (`mongo-data:/data/db`) for MongoDB ensuring data persists across container teardowns (`docker-compose down`).

---

## 🏗️ Architecture & Orchestration Pipeline

```text
docker-compose.yml
 ├── frontend (React 18 + Vite Preview, port 5173:5173)
 ├── backend (Node.js Express REST API, port 5000:5000)
 └── mongodb (Official mongo:6.0 image, port 27017:27017)

Network: app-network (Custom Bridge Driver)
 ┌────────────────┐         ┌────────────────┐         ┌────────────────┐
 │ awdf-frontend  │ ──────► │  awdf-backend  │ ──────► │  awdf-mongodb  │
 │ (172.20.0.4)   │         │  (172.20.0.3)  │         │  (172.20.0.2)  │
 └────────────────┘         └────────────────┘         └────────────────┘
         ▲                          ▲                          ▲
         │ :5173                    │ :5000                    │ :27017
 ┌───────┴──────────────────────────┴──────────────────────────┴────────┐
 │                      Host Machine (Browser / Postman)                │
 └──────────────────────────────────────────────────────────────────────┘
                                                               │
                                                     Persistent Volume
                                                  [mongo-data:/data/db]
```

---

## 🛠️ Service Definitions & Configuration

| Service Name | Container Name | Base Image | Internal / Host Port | Role | Dependencies |
|---|---|---|---|---|---|
| `mongodb` | `awdf-mongodb` | `mongo:6.0` | `27017:27017` | Persistent NoSQL database storage | None |
| `backend` | `awdf-backend` | `node:18-alpine` | `5000:5000` | Express REST API & business logic | `mongodb` |
| `frontend` | `awdf-frontend` | `node:18-alpine` (multi-stage) | `5173:5173` | React SPA client interface | `backend` |

---

## 🚀 Setup & Execution Instructions

```bash
# Navigate to project root
cd "Practical - 11"

# Build images and start all 3 container services in one command
docker-compose up --build

# In a separate terminal, verify container status
docker ps

# Inspect inter-container bridge network
docker network inspect practical-11_app-network

# Stop and remove containers (data remains safe in volume mongo-data)
docker-compose down
```

---

## 📸 Output Screenshots & Verification
1. `pr11_docker_compose_up_terminal.png`: PowerShell terminal running `docker-compose up --build` showing layer building, bridge network creation, volume allocation, and unified log stream.
2. `pr11_docker_ps_containers_running.png`: Terminal output from `docker ps` confirming `awdf-frontend`, `awdf-backend`, and `awdf-mongodb` all active with mapped host ports.
3. `pr11_browser_fullstack_containerized.png`: Web browser loaded at `http://localhost:5173` verifying end-to-end fullstack communication between containerized React frontend, Express API, and MongoDB.
4. `pr11_docker_compose_yaml_inspection.png`: Source code inspection of `docker-compose.yml` detailing service configs, bridge network definition, and persistent volume declaration.
5. `pr11_docker_volume_persistence_proof.png`: Verification of Supplementary Problem 3 demonstrating database persistence after full `docker-compose down` and `docker-compose up`.
6. `pr11_github_repo.png`: GitHub repository deliverable evidence for `Haribhavsar25/AWDF-PR-11`.

---

## 📜 Key Questions & Theoretical Analysis

### 1. Why does the backend container need to reference the MongoDB container by its service name (e.g., mongodb) rather than localhost?
Each Docker container operates inside its own isolated network namespace with its own loopback interface (`localhost` or `127.0.0.1`). If the backend container attempts to connect to `mongodb://localhost:27017`, it is querying its own local container network, where no MongoDB daemon is running. Under Docker Compose, all services attached to a user-defined bridge network (`app-network`) share an embedded DNS resolver. Docker automatically maps the Compose service name (`mongodb`) to the private IP address of the MongoDB container (e.g., `172.20.0.2`), allowing inter-container TCP communication via `mongodb://mongodb:27017/taskdb`.

### 2. What is the difference between EXPOSE in a Dockerfile and the ports mapping in docker-compose.yml?
- `EXPOSE` in a `Dockerfile` is primarily documentation and metadata. It declares that the container's process listens on a specific internal port, but it does **not** publish or make that port accessible to the outside host machine.
- `ports` in `docker-compose.yml` (e.g., `"5000:5000"`) actively configures Docker's network bridge and iptables NAT routing, binding host port 5000 to container port 5000. This enables external clients (such as host web browsers, Postman, or mobile apps) to reach the containerized service.

### 3. Why is it considered bad practice to copy node_modules into a Docker image instead of running npm install inside the container?
Copying local `node_modules` into a Docker image introduces severe architectural and operational defects:
1. **OS / Architecture Incompatibility:** Native C++ binary bindings (e.g., `bcrypt`, `esbuild`, `canvas`) compiled on the host operating system (e.g., Windows x64) fail to execute inside the container's Linux environment (e.g., Alpine Linux musl libc), causing immediate runtime crashes.
2. **Build Context Bloat:** `node_modules` contains tens of thousands of files totaling hundreds of megabytes, massively slowing down Docker build context transfer time.
3. **Cache Invalidation:** Any local file change invalidates the entire Docker layer cache. Running `npm install` inside the Dockerfile alongside `.dockerignore` guarantees OS-native compilation and maximizes layer caching.
