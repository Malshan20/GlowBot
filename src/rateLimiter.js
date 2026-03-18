const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60 }); // 1 minute window
const LIMIT = parseInt(process.env.RATE_LIMIT_PER_USER || '10');

/**
 * Check if a user is within rate limits
 * Returns { allowed: boolean, retryAfter: number }
 */
function checkRateLimit(userId) {
  const key = `rl:${userId}`;
  const data = cache.get(key) || { count: 0, resetAt: Date.now() + 60000 };

  if (data.count >= LIMIT) {
    const retryAfter = Math.ceil((data.resetAt - Date.now()) / 1000);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  data.count += 1;
  const ttl = Math.ceil((data.resetAt - Date.now()) / 1000);
  cache.set(key, data, Math.max(1, ttl));

  return { allowed: true, retryAfter: 0 };
}

module.exports = { checkRateLimit };
