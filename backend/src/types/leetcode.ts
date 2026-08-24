export interface SolvedResponse {
  solvedProblem?: number;
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  acSubmissionNum?: Array<{ difficulty: string; count: number; submissions: number }>;
  totalSubmissionNum?: Array<{ difficulty: string; count: number; submissions: number }>;
  ranking?: number;
  reputation?: number;
  errors?: any;
}

export interface CalendarResponse {
  submissionCalendar?: string | Record<string, number>;
  streak?: number;
  totalActiveDays?: number;
  activeYears?: number[];
  errors?: any;
}

export interface TagProblemCount {
  tagName: string;
  tagSlug?: string;
  problemsSolved: number;
}

export interface SkillResponse {
  data?: {
    matchedUser?: {
      tagProblemCounts?: {
        advanced?: TagProblemCount[];
        intermediate?: TagProblemCount[];
        fundamental?: TagProblemCount[];
      };
    };
  };
  matchedUser?: {
    tagProblemCounts?: {
      advanced?: TagProblemCount[];
      intermediate?: TagProblemCount[];
      fundamental?: TagProblemCount[];
    };
  };
  skills?: Array<{ tagName: string; problemsSolved: number }>;
  errors?: any;
}

export interface LanguageResponse {
  matchedUser?: {
    languageProblemCount?: Array<{
      languageName: string;
      problemsSolved: number;
    }>;
  };
  languageProblemCount?: Array<{
    languageName: string;
    problemsSolved: number;
  }>;
  errors?: any;
}

export interface BadgesResponse {
  badges?: Array<{
    id: string;
    name: string;
    icon: string;
    displayName: string;
  }>;
  badgesCount?: number;
  errors?: any;
}

export interface ContestResponse {
  contestRating?: number;
  rating?: number;
  contestGlobalRanking?: number;
  globalRanking?: number;
  totalParticipants?: number;
  topPercentage?: number;
  contestBadges?: {
    name: string;
    icon: string;
  };
  errors?: any;
}

export interface RawLeetCodeData {
  username: string;
  solved: SolvedResponse;
  calendar: CalendarResponse;
  skill: SkillResponse;
  language: LanguageResponse;
  badges: BadgesResponse;
  contest: ContestResponse;
}
