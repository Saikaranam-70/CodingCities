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
 * Direct GraphQL fetch from official LeetCode API as a high-reliability fallback
 */
async function fetchDirectLeetCodeGraphQL(username: string): Promise<any> {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://leetcode.com/${encodeURIComponent(username)}/`
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                ranking
                reputation
              }
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
                totalSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
              userCalendar {
                activeYears
                streak
                totalActiveDays
                submissionCalendar
              }
            }
          }
        `,
        variables: { username }
      }),
      timeout: 10000
    } as any);

    if (!response.ok) return null;
    const json = await response.json();
    return json?.data?.matchedUser || null;
  } catch (err: any) {
    console.warn(`[LeetCodeGraphQL] Direct fetch failed for '${username}': ${err.message}`);
    return null;
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
 * Fetches all user statistics in parallel with official LeetCode GraphQL fallback
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

  // Check if primary API returned invalid user
  const isPrimaryNotFound = solved?.errors === 'User not found' || solved?.errors === 'user does not exist';
  const hasPrimaryData = solved && (solved.solvedProblem !== undefined || solved.totalSolved !== undefined || solved.easySolved !== undefined);

  if (!hasPrimaryData || isPrimaryNotFound) {
    console.log(`🌐 [LeetCodeFetcher] Primary stats API missing data for '${username}'. Trying direct LeetCode GraphQL...`);
    const directUser = await fetchDirectLeetCodeGraphQL(username);

    if (directUser) {
      const acNums = directUser.submitStats?.acSubmissionNum || [];
      const easyItem = acNums.find((i: any) => i.difficulty === 'Easy');
      const mediumItem = acNums.find((i: any) => i.difficulty === 'Medium');
      const hardItem = acNums.find((i: any) => i.difficulty === 'Hard');
      const allItem = acNums.find((i: any) => i.difficulty === 'All');

      return {
        username,
        solved: {
          solvedProblem: allItem?.count ?? 0,
          easySolved: easyItem?.count ?? 0,
          mediumSolved: mediumItem?.count ?? 0,
          hardSolved: hardItem?.count ?? 0,
          totalSolved: allItem?.count ?? 0,
          ranking: directUser.profile?.ranking ?? 500000,
          acSubmissionNum: directUser.submitStats?.acSubmissionNum || [],
          totalSubmissionNum: directUser.submitStats?.totalSubmissionNum || []
        },
        calendar: directUser.userCalendar || {},
        skill: {},
        language: {},
        badges: {},
        contest: {}
      };
    }

    if (isPrimaryNotFound) {
      throw new Error('USER_NOT_FOUND');
    }
  }

  return {
    username,
    solved: solved || { solvedProblem: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSolved: 0 },
    calendar: calendar || {},
    skill: skill || {},
    language: language || {},
    badges: badges || {},
    contest: contest || {}
  };
}
