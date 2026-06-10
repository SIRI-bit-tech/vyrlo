import { Platform } from "@prisma/client";
import { ScrapedProfile, ScrapedPost } from "@/types";
import { scrapeInstagram } from "./instagram";
import { scrapeTikTok } from "./tiktok";
import { scrapeTwitter } from "./twitter";
import { scrapeFacebook } from "./facebook";

export async function scrapeAccount(platform: Platform, handle: string): Promise<{ profile: ScrapedProfile; posts: ScrapedPost[] }> {
  switch (platform) {
    case Platform.INSTAGRAM:
      return scrapeInstagram(handle);
    case Platform.TIKTOK:
      return scrapeTikTok(handle);
    case Platform.TWITTER:
      return scrapeTwitter(handle);
    case Platform.FACEBOOK:
      return scrapeFacebook(handle);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
