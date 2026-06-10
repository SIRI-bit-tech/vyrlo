import { Camera as Instagram, Video as TikTok, MessageCircle as Twitter, Globe as Facebook, LayoutDashboard, LineChart, Lightbulb, Users, FileText, TrendingUp, CheckSquare, Settings } from "lucide-react";

export const APP_NAME = "Vyrlo";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const RAPIDAPI_HOST_MAP = {
  INSTAGRAM: "instagram-scraper-stable-api.p.rapidapi.com",
  TIKTOK: "tiktok-api6.p.rapidapi.com",
  TWITTER: "twitter135.p.rapidapi.com",
  FACEBOOK: "facebook-scraper3.p.rapidapi.com"
};

export const COLORS = {
  bg: "#080808",
  surface: "#353536",
  surfaceMid: "#706f70",
  muted: "#acadb1",
  subtle: "#d4d8df",
  foreground: "#ebedf1",
  accent: "#ebedf1",
} as const;

export const STATUS_COLORS = {
  success: "#4ade80",
  successMuted: "#166534",
  warning: "#facc15",
  warningMuted: "#854d0e",
  error: "#f87171",
  errorMuted: "#991b1b",
  info: "#60a5fa",
  infoMuted: "#1e3a5f",
} as const;

export const EVAL_COLORS = {
  high: "#4ade80",
  medium: "#facc15",
  low: "#f87171",
  pending: "#acadb1",
} as const;

export const PLATFORM_COLORS = {
  instagram: "#e1306c",
  tiktok: "#69c9d0",
  twitter: "#1d9bf0",
  facebook: "#1877f2",
} as const;

export const CHART_COLORS = {
  primary: "#ebedf1",
  secondary: "#706f70",
  muted: "#acadb1",
  instagram: "#e1306c",
  tiktok: "#69c9d0",
  twitter: "#1d9bf0",
  facebook: "#1877f2",
  success: "#4ade80",
  warning: "#facc15",
  error: "#f87171",
} as const;

export const PLATFORMS = [
  { id: "INSTAGRAM", name: "Instagram", icon: Instagram, color: PLATFORM_COLORS.instagram },
  { id: "TIKTOK", name: "TikTok", icon: TikTok, color: PLATFORM_COLORS.tiktok },
  { id: "TWITTER", name: "Twitter", icon: Twitter, color: PLATFORM_COLORS.twitter },
  { id: "FACEBOOK", name: "Facebook", icon: Facebook, color: PLATFORM_COLORS.facebook }
];

export const SCRAPE_INTERVAL_HOURS = 24;
export const REPORT_SCHEDULE_DAY = 1; // Monday
export const MAX_TRACKED_COMPETITORS = 10;
export const MAX_CONNECTED_ACCOUNTS = 10;

export const GEMINI_MODEL = "gemini-2.0-flash";
export const GEMINI_MAX_TOKENS = 2000;
export const CONTENT_IDEAS_PER_REQUEST = 10;
export const TREND_FETCH_LIMIT = 5;
export const EVAL_SCORE_THRESHOLD = 0.7;

export const QUEUE_NAMES = {
  SCRAPE: "vyrlo-scrape-queue",
  REPORT: "vyrlo-report-queue",
  EVAL: "vyrlo-eval-queue"
};

export const JOB_ATTEMPTS = 3;
export const JOB_BACKOFF_DELAY = 1000 * 60; // 1 minute

export const RESEND_FROM = "Vyrlo <noreply@siridev.me>";
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_RESENDS = 3;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const ONBOARDING_STEPS = [
  { id: 1, name: "Profile" },
  { id: 2, name: "Accounts" },
  { id: 3, name: "Confirm" }
];

export const CREATOR_NICHES = [
  "Lifestyle",
  "Tech",
  "Gaming",
  "Fashion",
  "Beauty",
  "Education",
  "Business & Finance",
  "Health & Fitness",
  "Comedy",
  "Food",
  "Travel",
  "Other"
];

export const CREATOR_CHALLENGES = [
  "Inconsistent engagement",
  "Running out of content ideas",
  "Hard to track analytics across apps",
  "Not growing followers fast enough",
  "Low conversion/monetization",
  "Other"
];

export const CREATOR_EXPERIENCES = [
  "Just starting out",
  "Doing it for fun",
  "Part-time creator",
  "Full-time professional creator",
  "Agency/Manager"
];

export const CREATOR_GOALS = [
  "Grow audience size",
  "Increase engagement rate",
  "Monetize better",
  "Save time on analytics and ideation",
  "Build a community"
];

export const DATE_RANGES = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "90d" },
  { label: "This Year", value: "1y" },
  { label: "All Time", value: "all" }
];

export const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: LineChart },
  { label: "Content Ideas", href: "/content-ideas", icon: Lightbulb },
  { label: "Competitors", href: "/competitors", icon: Users },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Trends", href: "/trends", icon: TrendingUp },
  { label: "Evals", href: "/evals", icon: CheckSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];
