# Practical 9: In-Memory Caching and Query Optimization

**Course:** ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Academic Year:** 2026-27 (5th Semester)  
**Student ID:** 24CS057  
**Student Name:** Shubham Pansuriya  
**GitHub Repository:** [https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%209.git](https://github.com/24cs057shubham/AWDF-Practicals/tree/main/Practical%20-%209.git)

---

## 📌 Practical Overview & Objectives
The primary objective of Practical 9 is to implement **server-side in-memory caching** using `node-cache` in an Express/MongoDB REST API, measure its impact on API latency, and ensure strict cache invalidation on data mutations:
1. **Server-Side In-Memory Cache:** Initializing a global `NodeCache` instance configured with a 60-second Time-To-Live (TTL).
2. **Read Optimization (GET /tasks):** Intercepting `GET /tasks` requests to check the in-memory cache first (`cache.get('all_tasks')`). On cache HIT, data is returned instantly from RAM. On cache MISS, MongoDB is queried, and the result is cached.
3. **Strict Cache Invalidation:** Purging the cached key (`cache.del('all_tasks')`) upon write operations (`POST`, `PUT`, `DELETE`) to prevent stale reads.
4. **Empirical Benchmarking:** Recording and comparing API latency across uncached cold reads versus cached hot reads.
5. **Supplementary Problems:**
   - **Supplementary 1 (Single-Task Caching):** Caching `GET /tasks/:id` separately (`task_${id}`) and invalidating upon target updates or deletes.
   - **Supplementary 2 (Cache Telemetry / Stats Debug Endpoint):** Exposing `GET /cache-stats` tracking hits, misses, hit ratio %, and active keys.
   - **Supplementary 3 (TTL Trade-Off Analysis):** Evaluating trade-offs between TTL duration, memory footprint, and data freshness.

---

## 📊 Empirical Response Time Comparison (Postman Benchmark)

| Reading # | Uncached (Cache MISS - MongoDB Read) | Cached (Cache HIT - In-Memory RAM) | Latency Improvement |
|---|---|---|---|
| **Reading 1** | 26 ms | 2 ms | **13.0x Faster** |
| **Reading 2** | 24 ms | 1 ms | **24.0x Faster** |
| **Reading 3** | 25 ms | 1 ms | **25.0x Faster** |
| **Average** | **25.0 ms** | **1.33 ms** | **~18.7x Speedup (94.7% Reduction)** |

---

## 🏗️ Architecture & Cache Invalidation Pipeline

```text
Client GET /tasks Request
       │
       ▼
 [Cache Check: cache.get('all_tasks')]
       ├──► HIT  ──► Return from Memory RAM immediately (1 - 2 ms, X-Cache: HIT)
       └──► MISS ──► Query MongoDB ──► Store in node-cache (TTL 60s) ──► Return to client (25 ms, X-Cache: MISS)

Client POST/PUT/DELETE /tasks Request (Write Mutation)
       │
       ▼
 Save / Update / Delete in MongoDB
       │
       ▼
 [Cache Invalidation: cache.del('all_tasks') & cache.del('task_:id')]
       │
       ▼
 Return 200/201 (Next client read triggers fresh MISS and queries latest database state)
```

---

## 📡 API Reference & Endpoints

| Method | Endpoint | Cache Behavior | Description |
|---|---|---|---|
| `GET` | `/` | None | API status and cache configuration summary |
| `GET` | `/cache-stats` | None (Debug) | Exposes telemetry counters: hits, misses, hit ratio % |
| `GET` | `/tasks` | Cached (`stdTTL: 60s`) | Returns cached task list on HIT, or queries MongoDB on MISS |
| `GET` | `/tasks/:id` | Cached (`stdTTL: 60s`) | Returns single task from memory or queries database |
| `POST` | `/tasks` | Invalidates `all_tasks` | Creates new task and purges stale collection cache |
| `PUT` | `/tasks/:id` | Invalidates `all_tasks`, `task_:id` | Updates task and purges both list and item cache |
| `DELETE` | `/tasks/:id` | Invalidates `all_tasks`, `task_:id` | Deletes task and purges both list and item cache |

---

## 🚀 Setup & Execution Instructions

```bash
cd "Practical - 9/backend"

# Install dependencies (node-cache, express, mongoose, dotenv, cors)
npm install

# Start Express caching server
node server.js
# Runs on http://localhost:5000
```

---

## 📸 Output Screenshots & Verification
1. `pr9_terminal_cache_logs.png`: Terminal logs showing server startup, cache MISS (26ms), subsequent cache HITs (1-2ms), and cache invalidation.
2. `pr9_postman_cache_miss_first_read.png`: Postman testing 1st `GET /tasks` returning `200 OK`, `X-Cache: MISS`, response time 26 ms.
3. `pr9_postman_cache_hit_subsequent.png`: Postman testing 2nd `GET /tasks` returning `200 OK`, `X-Cache: HIT`, response time 2 ms (13x speedup).
4. `pr9_postman_cache_invalidation.png`: Postman testing `POST /tasks` triggering `cache.del('all_tasks')` to guarantee zero stale data.
5. `pr9_postman_cache_stats_debug.png`: Postman testing `GET /cache-stats` inspecting real-time hit ratio and active key telemetry.
6. `pr9_github_repo.png`: GitHub repository deliverable evidence for `24cs057shubham/AWDF-PR-9`.

---

## 📜 Key Questions & Theoretical Analysis

### 1. Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?
If the cache is not invalidated upon write operations (`POST`, `PUT`, `DELETE`), subsequent read queries within the TTL window will continue serving the old snapshot stored in memory. This causes **stale reads and data inconsistency**: newly added tasks would not appear, updated status checkboxes would revert back, and deleted tasks would remain visible until the TTL expired. Purging cache keys on write operations enforces strong eventual consistency.

### 2. What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?
In a collaborative task management context, a TTL between **30 to 60 seconds** is standard. TTL length represents a fundamental trade-off:
- **Longer TTL (e.g. 10 minutes):** Higher cache hit ratio and maximum database offloading, but increased risk of serving stale data if cache invalidation events fail or are bypassed.
- **Shorter TTL (e.g. 5–15 seconds):** Guarantees rapid data convergence with the database, but results in frequent cache misses and higher database read load.

### 3. Why is in-memory caching (node-cache) not suitable for a multi-server/multi-instance deployment?
`node-cache` stores cached objects inside the process-local V8 heap memory of a single Node.js instance. In a horizontally scaled production deployment (multiple server instances behind a load balancer), each instance maintains its own isolated memory cache. If a write request hits Server A (invalidating Server A's cache), Server B will continue serving its old cached data to other users. To support distributed horizontal scaling, a centralized in-memory datastore such as **Redis** or **Memcached** is required.
