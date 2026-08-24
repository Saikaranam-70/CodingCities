import Redis from 'ioredis';

let redisClient: Redis | null = null;

// In-memory cache fallback for local development when REDIS_URL is not set
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

const REDIS_URL = process.env.REDIS_URL;

if (REDIS_URL) {
  try {
    redisClient = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('⚠️ [Redis] Connection retries exceeded. Falling back to in-memory cache.');
          return null;
        }
        return Math.min(times * 200, 1000);
      }
    });

    redisClient.on('connect', () => {
      console.log('✅ [Redis] Connected successfully to Redis store.');
    });

    redisClient.on('error', (err) => {
      console.warn(`⚠️ [Redis] Client error (${err.message}). Using in-memory fallback.`);
    });
  } catch (err: any) {
    console.warn(`⚠️ [Redis] Initialization failed (${err?.message}). Using in-memory fallback.`);
    redisClient = null;
  }
} else {
  console.log('ℹ️ [Cache] REDIS_URL not configured. Operating in high-speed In-Memory Cache mode.');
}

/**
 * Gets a cached item by key
 */
export async function getCache(key: string): Promise<string | null> {
  if (redisClient && redisClient.status === 'ready') {
    try {
      return await redisClient.get(key);
    } catch (e) {
      // Fall through to memory cache on Redis error
    }
  }

  // Memory cache lookup
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Sets a cached item with TTL in seconds
 */
export async function setCache(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
  if (redisClient && redisClient.status === 'ready') {
    try {
      await redisClient.set(key, value, 'EX', ttlSeconds);
      return;
    } catch (e) {
      // Fall through to memory cache on Redis error
    }
  }

  // Memory cache write
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}
