import { Platform, PostType, ReportPeriod, ProfileSnapshot, Post } from "@prisma/client";

export class GeminiParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiParseError";
  }
}

export interface ScrapedProfile {
  platform: Platform;
  handle: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  bio: string | null;
  profileUrl: string | null;
  avatarUrl: string | null;
}

export interface ScrapedPost {
  platform: Platform;
  postId: string;
  type: PostType;
  caption: string | null;
  url: string | null;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  engagementRate: number;
  postedAt: Date;
}

export interface ContentIdea {
  title: string;
  description: string;
  format: string;
  hook: string;
  estimatedEngagement: string;
  basedOnPostIds: string[];
}

export interface EvalResult {
  score: number;
  feedback: string;
  improvedSuggestion: string;
}

export interface ReportSummary {
  overview: string;
  platformBreakdowns: { platform: string; summary: string }[];
  topContent: { postId: string; whyItWorked: string }[];
  growthInsights: string[];
  recommendations: string[];
}

export interface TrendEntry {
  title: string;
  description: string;
  whyItWorks: string;
  contentAngle: string;
}

export interface CreatorProfile {
  niche: string;
  platforms: string[];
  challenge: string;
  experience: string;
  goal: string;
}

// API and Job Payloads
export interface ReportJobPayload {
  userId: string;
  period: ReportPeriod;
}

export interface ScrapeJobPayload {
  userId: string;
}

export interface EvalJobPayload {
  contentIdeaId: string;
}

export interface ReportDataPayload {
  period: string;
  accounts: {
    platform: string;
    handle: string;
    snapshots: ProfileSnapshot[];
    topPosts: Post[];
  }[];
}

export interface EvalDataPayload {
  contentIdea: {
    title: string;
    description: string;
    format: string;
    hook: string;
  };
  platform: Platform;
  historicalData: Post[];
}
