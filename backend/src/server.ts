import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { getCache, setCache } from './services/redis';
import { fetchRawLeetCodeData, checkStatsApiHealth, getStatsApiUrl } from './services/leetcodeFetcher';
import { fetchRawGitHubData } from './services/githubFetcher';
import { toCityScene } from './transform/toCityScene';
import { toGitHubCityScene } from './transform/toGitHubCityScene';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup - accept any localhost origin in dev mode plus FRONTEND_URL env var
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || 
        origin.startsWith('http://localhost:') || 
        origin.startsWith('http://127.0.0.1:') ||
        origin.endsWith('.vercel.app') ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback for production deployment
      }
    },
    credentials: true
  })
);

app.use(express.json());

// Rate Limiter: max 40 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a minute before searching again.' }
});

app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    statsApiUrl: getStatsApiUrl()
  });
});

// Endpoint: GET /api/city/github/:username
app.get('/api/city/github/:username', async (req: Request, res: Response) => {
  const rawUsername = req.params.username;

  if (!rawUsername || !/^[a-zA-Z0-9_-]{1,40}$/.test(rawUsername.trim())) {
    return res.status(400).json({
      error: 'Invalid GitHub username format.'
    });
  }

  const username = rawUsername.trim().toLowerCase();
  const cacheKey = `github:${username}:city`;

  try {
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`⚡ [Cache Hit] Returning cached GitHub city scene for: '${username}'`);
      return res.json({ ...JSON.parse(cachedData), _cached: true });
    }

    console.log(`🐙 [Fetch] Querying GitHub API for: '${username}'...`);
    const rawData = await fetchRawGitHubData(username);
    const cityScene = toGitHubCityScene(rawData);

    await setCache(cacheKey, JSON.stringify(cityScene), 3600);
    return res.json({ ...cityScene, _cached: false });
  } catch (err: any) {
    if (err?.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        error: `GitHub user '${username}' not found. Please check spelling.`
      });
    }

    console.error(`❌ [GitHub Error] Failed processing user '${username}':`, err?.message || err);
    return res.status(502).json({
      error: `Failed querying GitHub stats for '${username}'.`,
      details: err?.message || 'Upstream error'
    });
  }
});

// Endpoint: GET /api/city/leetcode/:username and alias /api/city/:username
const handleLeetCodeRequest = async (req: Request, res: Response) => {
  const rawUsername = req.params.username;

  if (!rawUsername || !/^[a-zA-Z0-9_-]{1,40}$/.test(rawUsername.trim())) {
    return res.status(400).json({
      error: 'Invalid LeetCode username format.'
    });
  }

  const username = rawUsername.trim().toLowerCase();
  const cacheKey = `leetcode:${username}:city`;

  try {
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`⚡ [Cache Hit] Returning cached LeetCode city scene for: '${username}'`);
      return res.json({ ...JSON.parse(cachedData), _cached: true });
    }

    console.log(`🌐 [Fetch] Querying LeetCode stats API for: '${username}'...`);
    const rawData = await fetchRawLeetCodeData(username);
    const cityScene = toCityScene(rawData);

    await setCache(cacheKey, JSON.stringify(cityScene), 3600);
    return res.json({ ...cityScene, _cached: false });
  } catch (err: any) {
    if (err?.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        error: `LeetCode user '${username}' not found. Please check spelling.`
      });
    }

    console.error(`❌ [Error] Failed processing LeetCode city for '${username}':`, err?.message || err);
    return res.status(502).json({
      error: 'Stats service is currently unavailable or spinning up. Please retry in a few seconds.',
      details: err?.message || 'Upstream service error'
    });
  }
};

app.get('/api/city/leetcode/:username', handleLeetCodeRequest);
app.get('/api/city/:username', handleLeetCodeRequest);

// Start Express Server
app.listen(PORT, async () => {
  console.log(`==================================================`);
  console.log(`🚀 Coding Cities Backend listening on port ${PORT}`);
  console.log(`🔗 Target Stats API URL: ${getStatsApiUrl()}`);
  console.log(`==================================================`);

  await checkStatsApiHealth('leetcode');

  // Automatic Keep-Alive Cron Ping: Pings Stats API every 10 minutes to prevent Render free-tier sleep
  const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000;
  setInterval(async () => {
    console.log(`⏰ [KeepAlive Cron] Ping stats API to prevent Render free-tier sleep...`);
    await checkStatsApiHealth('leetcode');
  }, KEEP_ALIVE_INTERVAL_MS);
});
