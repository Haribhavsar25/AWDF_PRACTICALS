/**
 * Practical 9: In-Memory Caching Module (node-cache)
 * Course: ITUE301 - Advanced Web Development Frameworks
 * Student ID: 24CS009 | Name: Hari Bhavsar */

const NodeCache = require('node-cache');

const stdTTL = parseInt(process.env.CACHE_TTL, 10) || 60;
const cache = new NodeCache({ stdTTL, checkperiod: 120 });

// Supplementary Problem 2: Cache Hit/Miss Telemetry Counter
const cacheStats = {
  hits: 0,
  misses: 0,
  invalidations: 0
};

const recordHit = () => {
  cacheStats.hits += 1;
};

const recordMiss = () => {
  cacheStats.misses += 1;
};

const recordInvalidation = () => {
  cacheStats.invalidations += 1;
};

const getStats = () => {
  const total = cacheStats.hits + cacheStats.misses;
  const hitRatio = total > 0 ? ((cacheStats.hits / total) * 100).toFixed(1) + '%' : '0%';
  return {
    ...cacheStats,
    totalRequests: total,
    hitRatio,
    activeKeys: cache.keys().length,
    stdTTL: `${stdTTL} seconds`
  };
};

module.exports = {
  cache,
  recordHit,
  recordMiss,
  recordInvalidation,
  getStats
};
