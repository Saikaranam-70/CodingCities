export interface DistrictData {
  id: string;
  topic: string;
  buildingCount: number;
  avgHeight: number;
  position: [number, number];
  color: string;
}

export interface BuildingData {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  height: number;
  width: number;
  depth: number;
  position: [number, number, number];
  colorTier: 'easy' | 'medium' | 'hard';
  colorHex: string;
}

export interface DailyTowerData {
  id: string;
  date: string;
  count: number;
  weekIndex: number;
  dayOfWeek: number;
  height: number;
  position: [number, number, number];
  colorHex: string;
}

export interface CityScene {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  districts: DistrictData[];
  buildings: BuildingData[];
  dailyTowers: DailyTowerData[];
  activityDensity: Array<{ date: string; count: number }>;
  streak: { current: number; longest: number };
  contestRating?: {
    rating: number;
    globalRanking: number;
    topPercentage: number;
    badge?: string;
  };
  languages: Array<{ name: string; solvedCount: number }>;
  badgesCount: number;
  statsFetchedAt: string;
  _cached?: boolean;
}
