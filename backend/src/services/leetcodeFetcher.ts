import fetch from 'node-fetch';
import { RawLeetCodeData } from '../types/leetcode';

const DEFAULT_STATS_API = 'https://alfa-leetcode-api.onrender.com';

export function getStatsApiUrl(): string {
  const url = process.env.STATS_API_URL || DEFAULT_STATS_API;
  return url.replace(/\/+$/, ''); // Strip trailing slash
}

/**
 * Helper to safely fetch an endpoint with timeout and error handling
 */
async function fetchEndpoint<T>(baseUrl: string, endpoint: string): Promise<T> {
  const targetUrl = `${baseUrl}/${endpoint}`;
  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'LeetCode-City-Backend/1.0' },
      timeout: 12000 // 12 second timeout for free-tier spin-up
    } as any);

    if (response.status === 404) {
      return { errors: 'User not found' } as any;
    }

    if (!response.ok) {
      console.warn(`[StatsAPI] HTTP ${response.status} from ${endpoint}`);
      return {} as any;
    }

    const data = await response.json();
    return data as T;
  } catch (err: any) {
    console.warn(`[StatsAPI] Fetch failed for ${endpoint}: ${err.message}`);
    return {} as any;
  }
}

/**
 * Probes the stats API health on server boot
 */
export async function checkStatsApiHealth(testUsername: string = 'leetcode'): Promise<boolean> {
  const baseUrl = getStatsApiUrl();
  console.log(`🔍 [HealthCheck] Probing stats service at: ${baseUrl}/${testUsername}/solved`);
  try {
    const res = await fetch(`${baseUrl}/${testUsername}/solved`, {
      timeout: 8000
    } as any);

    if (res.ok) {
      console.log(`✅ [HealthCheck] Stats API responded successfully (HTTP ${res.status}).`);
      return true;
    } else {
      console.warn(`⚠️ [HealthCheck] Stats API returned HTTP status ${res.status}.`);
      return false;
    }
  } catch (err: any) {
    console.warn(`⚠️ [HealthCheck] Stats API probe failed (${err.message}). Is the service sleeping or booting?`);
    return false;
  }
}

/**
 * Fetches all user statistics in parallel from your deployed stats API
 */
export async function fetchRawLeetCodeData(username: string): Promise<RawLeetCodeData> {
  const baseUrl = getStatsApiUrl();

  const [solved, calendar, skill, language, badges, contest] = await Promise.all([
    fetchEndpoint<any>(baseUrl, `${username}/solved`),
    fetchEndpoint<any>(baseUrl, `${username}/calendar`),
    fetchEndpoint<any>(baseUrl, `${username}/skill`),
    fetchEndpoint<any>(baseUrl, `${username}/language`),
    fetchEndpoint<any>(baseUrl, `${username}/badges`),
    fetchEndpoint<any>(baseUrl, `${username}/contest`)
  ]);

  // Check if user genuinely does not exist or has no solved stats
  const isNotFound = solved?.errors || (solved?.solvedProblem === undefined && solved?.totalSolved === undefined && !solved?.easySolved);
  if (isNotFound && (!calendar || Object.keys(calendar).length === 0)) {
    throw new Error('USER_NOT_FOUND');
  }

  return {
    username,
    solved: solved || {},
    calendar: calendar || {},
    skill: skill || {},
    language: language || {},
    badges: badges || {},
    contest: contest || {}
  };
}
