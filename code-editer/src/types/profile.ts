import { Snippet } from "./snippet";

export interface UserStats {
  totalExecutions: number;
  languagesCount: number;
  languages: string[];
  last24Hours: number;
  favoriteLanguage: string;
  languageStats: Record<string, number>;
  mostStarredLanguage: string;
}

export interface UserProfileData {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  isPro: boolean;
  proSince?: number | null;
  createdAt: string;
}

export interface CodeExecutionItem {
  id: string;
  userId: string;
  language: string;
  code: string;
  output: string | null;
  error: string | null;
  createdAt: string;
}

export interface UserProfileResponse {
  userData: UserProfileData;
  userStats: UserStats;
  mySnippets: (Snippet & { comments?: any[]; stars?: any[] })[];
  starredSnippets: (Snippet & { comments?: any[]; stars?: any[] })[];
  executions: CodeExecutionItem[];
}
