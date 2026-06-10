import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EVAL_COLORS, PLATFORM_COLORS, COLORS } from "@/constants";
import { Platform } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEvalColor(score: number | null): string {
  if (score === null || score === undefined) return EVAL_COLORS.pending;
  if (score >= 0.65) return EVAL_COLORS.high;
  if (score >= 0.40) return EVAL_COLORS.medium;
  return EVAL_COLORS.low;
}

export function getPlatformColor(platform: Platform | string): string {
  const p = platform.toLowerCase();
  if (p === "instagram") return PLATFORM_COLORS.instagram;
  if (p === "tiktok") return PLATFORM_COLORS.tiktok;
  if (p === "twitter") return PLATFORM_COLORS.twitter;
  if (p === "facebook") return PLATFORM_COLORS.facebook;
  return COLORS.muted; // muted fallback
}

