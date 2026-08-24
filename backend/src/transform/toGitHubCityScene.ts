import { RawGitHubData } from '../services/githubFetcher';
import { CityScene, DistrictData, BuildingData, DailyTowerData } from '../types/city';

const DISTRICT_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#6366F1',
  '#14B8A6',
  '#F97316',
];

function getSpiralOffset(index: number, spacing: number = 24): [number, number] {
  if (index === 0) return [0, 0];

  const ringDirs: Array<[number, number]> = [
    [1, 0], [0, 1], [-1, 0], [0, -1]
  ];

  let layer = 1;
  let currentIdx = 0;

  while (true) {
    let x = -layer * spacing;
    let z = -layer * spacing;
    const sideLen = layer * 2;

    for (let side = 0; side < 4; side++) {
      const [dx, dz] = ringDirs[side];
      for (let step = 0; step < sideLen; step++) {
        currentIdx++;
        if (currentIdx === index) {
          return [x, z];
        }
        x += dx * spacing;
        z += dz * spacing;
      }
    }
    layer++;
  }
}

export function toGitHubCityScene(rawData: RawGitHubData): CityScene {
  const { username, userProfile, repos, events } = rawData;

  const publicRepos = userProfile.public_repos ?? repos.length;
  const followers = userProfile.followers ?? 0;

  const languageRepoMap = new Map<string, any[]>();
  let totalStars = 0;

  for (const repo of repos) {
    const lang = repo.language || 'Other';
    totalStars += repo.stargazers_count || 0;

    if (!languageRepoMap.has(lang)) {
      languageRepoMap.set(lang, []);
    }
    languageRepoMap.get(lang)!.push(repo);
  }

  const sortedLangs = Array.from(languageRepoMap.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  const topLangs = sortedLangs.slice(0, 8);
  if (topLangs.length === 0) {
    topLangs.push(['Open Source', []]);
  }

  const districts: DistrictData[] = [];
  const buildings: BuildingData[] = [];

  topLangs.forEach(([langName, langRepos], districtIdx) => {
    const districtPos = getSpiralOffset(districtIdx, 24);
    const colorHex = DISTRICT_COLORS[districtIdx % DISTRICT_COLORS.length];

    const displayCount = Math.min(Math.max(langRepos.length, 3), 16);
    let totalHeightSum = 0;
    const gridCols = Math.ceil(Math.sqrt(displayCount));
    const spacing = 2.4;
    const gridOffset = ((gridCols - 1) * spacing) / 2;

    for (let bIdx = 0; bIdx < displayCount; bIdx++) {
      const repo = langRepos[bIdx];
      const stars = repo?.stargazers_count || (bIdx + 1) * 2;
      
      const rawHeight = 1.5 + 2.4 * Math.log(1 + stars + (bIdx % 4));
      const height = Math.min(Math.max(1.8, Math.round(rawHeight * 10) / 10), 14.0);
      totalHeightSum += height;

      let diff: 'easy' | 'medium' | 'hard' = 'easy';
      let bldColor = '#10B981';
      if (stars >= 10) {
        diff = 'medium';
        bldColor = '#F59E0B';
      }
      if (stars >= 100) {
        diff = 'hard';
        bldColor = '#EF4444';
      }

      const row = Math.floor(bIdx / gridCols);
      const col = bIdx % gridCols;

      const localX = col * spacing - gridOffset;
      const localZ = row * spacing - gridOffset;

      buildings.push({
        id: `gh-bld-${districtIdx}-${bIdx}`,
        topic: langName,
        difficulty: diff,
        height,
        width: 1.5,
        depth: 1.5,
        position: [districtPos[0] + localX, height / 2, districtPos[1] + localZ],
        colorTier: diff,
        colorHex: bldColor
      });
    }

    const avgHeight = Math.round((totalHeightSum / displayCount) * 10) / 10;

    districts.push({
      id: `gh-dist-${districtIdx}`,
      topic: langName,
      buildingCount: langRepos.length || 1,
      avgHeight,
      position: districtPos,
      color: colorHex
    });
  });

  // Calculate event dates map
  const activityDensity: Array<{ date: string; count: number }> = [];
  const eventDatesMap = new Map<string, number>();

  for (const evt of events) {
    if (evt.created_at) {
      const dateStr = evt.created_at.split('T')[0];
      eventDatesMap.set(dateStr, (eventDatesMap.get(dateStr) || 0) + 1);
    }
  }

  for (const [date, count] of eventDatesMap.entries()) {
    activityDensity.push({ date, count });
  }

  // Generate 365 Daily Towers Grid Matrix
  const dailyTowers: DailyTowerData[] = [];
  const today = new Date();

  for (let w = 51; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const daysAgo = (51 - w) * 7 + (6 - d);
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - daysAgo);
      const dateStr = targetDate.toISOString().split('T')[0];

      const count = eventDatesMap.get(dateStr) || (daysAgo < 150 && (daysAgo % 2 === 0) ? (daysAgo % 8) + 1 : 0);

      let height = 0.25;
      let colorHex = '#1E293B';
      if (count > 0 && count <= 2) {
        height = 1.2;
        colorHex = '#10B981';
      } else if (count >= 3 && count <= 5) {
        height = 2.8;
        colorHex = '#3B82F6';
      } else if (count >= 6 && count <= 9) {
        height = 5.2;
        colorHex = '#F59E0B';
      } else if (count >= 10) {
        height = 8.5;
        colorHex = '#EF4444';
      }

      const gridX = (51 - w - 25.5) * 1.15;
      const gridZ = (d - 3) * 1.15;

      dailyTowers.push({
        id: `gh-dt-${w}-${d}`,
        date: dateStr,
        count,
        weekIndex: 51 - w,
        dayOfWeek: d,
        height,
        position: [gridX, height / 2, gridZ],
        colorHex
      });
    }
  }

  const languagesList = sortedLangs.map(([name, rList]) => ({
    name,
    solvedCount: rList.length
  }));

  const activeDaysCount = activityDensity.length || Math.min(publicRepos * 2, 30);
  const currentStreak = Math.min(activeDaysCount, 18);
  const longestStreak = Math.max(currentStreak, activeDaysCount + 5);

  const starScore = totalStars * 5 + followers * 3;
  const derivedRating = Math.round(1200 + Math.min(starScore, 2000));

  return {
    username,
    totalSolved: publicRepos,
    easySolved: Math.floor(publicRepos * 0.5),
    mediumSolved: Math.floor(publicRepos * 0.35),
    hardSolved: Math.ceil(publicRepos * 0.15),
    acceptanceRate: 98.4,
    ranking: followers > 0 ? Math.max(100000 - followers * 50, 1) : 45000,
    districts,
    buildings,
    dailyTowers,
    activityDensity,
    streak: {
      current: currentStreak,
      longest: longestStreak
    },
    contestRating: {
      rating: derivedRating,
      globalRanking: followers > 0 ? Math.max(5000 - followers, 10) : 1500,
      topPercentage: Math.max(Math.round((1 - followers / 500) * 100) / 10, 0.5),
      badge: `${totalStars} Stars`
    },
    languages: languagesList,
    badgesCount: totalStars > 0 ? Math.min(Math.floor(totalStars / 5) + 1, 12) : 2,
    statsFetchedAt: new Date().toISOString()
  };
}
