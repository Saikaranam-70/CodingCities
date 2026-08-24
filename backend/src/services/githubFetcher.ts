import fetch from 'node-fetch';

export interface RawGitHubData {
  username: string;
  userProfile: any;
  repos: any[];
  events: any[];
}

/**
 * Fetches public GitHub user data, repositories, and events
 */
export async function fetchRawGitHubData(username: string): Promise<RawGitHubData> {
  const headers = {
    'User-Agent': 'Coding-Cities-Backend/1.0',
    Accept: 'application/vnd.github.v3+json'
  };

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=100`, { headers })
    ]);

    if (userRes.status === 404) {
      throw new Error('USER_NOT_FOUND');
    }

    if (!userRes.ok) {
      throw new Error(`GitHub API returned status ${userRes.status}`);
    }

    const userProfile = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    return {
      username,
      userProfile,
      repos: Array.isArray(repos) ? repos : [],
      events: Array.isArray(events) ? events : []
    };
  } catch (err: any) {
    if (err?.message === 'USER_NOT_FOUND') {
      throw err;
    }
    console.warn(`[GitHubFetcher] Fetch failed for '${username}': ${err.message}`);
    throw new Error(`Failed fetching GitHub stats for '${username}'`);
  }
}
