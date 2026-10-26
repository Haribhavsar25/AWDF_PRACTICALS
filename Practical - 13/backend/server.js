/**
 * Practical 13: AI API Integration into a Web Application
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./models/Task');
const { cache, recordHit, recordMiss, recordInvalidation, getStats } = require('./cache');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_ai_db';

// AI API credentials stored strictly server-side in environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

// Request logger with timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log(`Database URI: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.warn('MongoDB connection notice (operating with memory fallback if offline):', err.message);
  });

// In-memory fallback tasks
let inMemoryTasks = [
  { _id: '671600000000000000000001', title: 'Integrate OpenAI / Gemini endpoint in Express', priority: 'high', description: 'Configure secure server-side route for AI prompt synthesis with rate limiting and fallback handling.', completed: true },
  { _id: '671600000000000000000002', title: 'Implement Graceful Degradation in React Client', priority: 'medium', description: 'Display animated loading states and fallback banners when external AI services timeout.', completed: false }
];

// Supplementary Problem 2: Rate Limiting Tracker (In-memory per IP / Client)
// Enforces max 5 AI requests per minute per IP to prevent quota exhaustion
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

const aiRateLimiter = (req, res, next) => {
  const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const now = Date.now();
  const clientData = rateLimitMap.get(clientIp) || { count: 0, firstRequest: now };

  if (now - clientData.firstRequest > RATE_LIMIT_WINDOW_MS) {
    clientData.count = 1;
    clientData.firstRequest = now;
  } else {
    clientData.count += 1;
  }

  rateLimitMap.set(clientIp, clientData);

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - clientData.firstRequest)) / 1000);
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `AI generation rate limit exceeded (maximum ${MAX_REQUESTS_PER_WINDOW} requests per minute).`,
      retryAfterSeconds,
      fallback: true
    });
  }

  next();
};

// -------------------------------------------------------------
// AI Generation Endpoint: POST /api/ai/generate-description
// -------------------------------------------------------------
app.post('/api/ai/generate-description', aiRateLimiter, async (req, res) => {
  const { title } = req.body;

  // Server-side input validation
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Task title is required to generate AI suggestion.'
    });
  }

  const cleanTitle = title.trim();
  const startTime = Date.now();

  try {
    // Check if live API key is configured and not default dummy
    const hasLiveKey = OPENAI_API_KEY && !OPENAI_API_KEY.includes('demo') && !OPENAI_API_KEY.includes('your_');

    if (hasLiveKey) {
      // In production with valid key, call OpenAI Chat Completions API
      const https = require('https');
      const postData = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an intelligent task management assistant. Given a task title, provide a concise 2-sentence description, a recommended priority (high, medium, or low), and a realistic deadline timeline.' },
          { role: 'user', content: `Task Title: "${cleanTitle}"` }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 8000
      };

      const apiRequest = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => { data += chunk; });
        apiRes.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (apiRes.statusCode === 200 && parsed.choices && parsed.choices.length > 0) {
              const aiText = parsed.choices[0].message.content.trim();
              return res.status(200).json({
                success: true,
                title: cleanTitle,
                description: aiText,
                priority: aiText.toLowerCase().includes('high') ? 'high' : aiText.toLowerCase().includes('low') ? 'low' : 'medium',
                suggestedDeadline: '3 days from today',
                aiGenerated: true,
                provider: 'OpenAI GPT-4o-mini',
                latencyMs: Date.now() - startTime,
                disclaimer: 'AI-generated suggestion. Please review and edit before saving.'
              });
            } else {
              // Graceful degradation when external API reports quota/auth error
              return serveGracefulFallback(res, cleanTitle, startTime, parsed.error?.message || 'External AI API service limit reached.');
            }
          } catch (e) {
            return serveGracefulFallback(res, cleanTitle, startTime, 'JSON parsing error from AI service.');
          }
        });
      });

      apiRequest.on('error', (err) => {
        // Graceful degradation on network timeout or DNS failure
        return serveGracefulFallback(res, cleanTitle, startTime, err.message);
      });

      apiRequest.write(postData);
      apiRequest.end();
    } else {
      // Graceful local heuristic synthesis when simulated in offline / lab mode
      return serveGracefulFallback(res, cleanTitle, startTime, 'Using server-side intelligent heuristic engine (Zero external leakage mode)');
    }
  } catch (error) {
    // Always degrade gracefully: core application never crashes
    return serveGracefulFallback(res, cleanTitle, startTime, error.message);
  }
});

// Helper for Graceful Degradation: Guarantees user workflow never breaks
function serveGracefulFallback(res, title, startTime, reason) {
  let inferredPriority = 'medium';
  let suggestedTimeline = '3 days from today';
  const lower = title.toLowerCase();

  if (lower.includes('urgent') || lower.includes('bug') || lower.includes('security') || lower.includes('deploy') || lower.includes('auth') || lower.includes('docker')) {
    inferredPriority = 'high';
    suggestedTimeline = 'Within 24 hours';
  } else if (lower.includes('docs') || lower.includes('readme') || lower.includes('comment') || lower.includes('optional') || lower.includes('cleanup')) {
    inferredPriority = 'low';
    suggestedTimeline = 'Within 1 week';
  }

  const generatedDescription = `Implement and verify "${title}". Ensure all requirements, unit test coverage, and documentation standards are fulfilled before submission.`;

  res.status(200).json({
    success: true,
    title,
    description: generatedDescription,
    priority: inferredPriority,
    suggestedDeadline: suggestedTimeline,
    aiGenerated: true,
    fallback: true,
    fallbackReason: reason,
    latencyMs: Date.now() - startTime,
    disclaimer: 'AI-generated suggestion. Please review and edit before saving.'
  });
}

// -------------------------------------------------------------
// Standard Task Management CRUD Routes
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'ITUE301 Practical 13: AI API Integration into a Web Application',
    student: 'Hari Bhavsar (24CS009)',
    aiService: 'OpenAI / Gemini Server-Side Integration',
    rateLimiting: 'Active (Max 5 req/min per client)',
    security: 'API Key stored in .env (never exposed to client)'
  });
});

app.get('/tasks', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    }
    res.status(200).json(inMemoryTasks);
  } catch (err) {
    next(err);
  }
});

app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, priority, completed } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Validation Error: Title is required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const newTask = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        priority: priority || 'medium',
        completed: Boolean(completed)
      });
      return res.status(201).json(newTask);
    }

    const mock = {
      _id: `task_${Date.now()}`,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      completed: Boolean(completed),
      createdAt: new Date().toISOString()
    };
    inMemoryTasks.unshift(mock);
    res.status(201).json(mock);
  } catch (err) {
    next(err);
  }
});

app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Task.findByIdAndDelete(id);
    } else {
      inMemoryTasks = inMemoryTasks.filter((t) => t._id !== id);
    }
    res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

// Global Error Boundary
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`AI Endpoint ready at: http://localhost:${PORT}/api/ai/generate-description`);
});

module.exports = app;
