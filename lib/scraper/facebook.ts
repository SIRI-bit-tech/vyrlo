import { Platform, PostType } from "@prisma/client";
import { ScrapedProfile, ScrapedPost } from "@/types";
import { RAPIDAPI_HOST_MAP } from "@/constants";

export async function scrapeFacebook(handle: string): Promise<{ profile: ScrapedProfile; posts: ScrapedPost[] }> {
  const host = RAPIDAPI_HOST_MAP[Platform.FACEBOOK];
  const apiKey = process.env.RAPIDAPI_KEY || "";

  try {
    const res = await fetch(`https://${host}/page/info?page_id=${handle}`, {
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
      },
    });

    if (!res.ok) throw new Error(`RapidAPI Error: ${res.status}`);
    const data = await res.json();
    const page = data?.page_info;

    if (!page) throw new Error("Page data missing in Facebook response");

    const profile: ScrapedProfile = {
      handle: page.username || handle,
      platform: Platform.FACEBOOK,
      followersCount: page.followers || 0,
      followingCount: 0,
      postsCount: 0,
      bio: page.about || null,
      profileUrl: `https://facebook.com/${page.username || handle}`,
      avatarUrl: page.profile_picture || null,
    };

    // Assuming a generic posts endpoint for Facebook Scraper
    const postsRes = await fetch(`https://${host}/page/posts?page_id=${handle}&limit=30`, {
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
      },
    });

    let posts: ScrapedPost[] = [];
    if (postsRes.ok) {
      const postsData = await postsRes.json();
      const edges = postsData?.posts || [];
      
      posts = edges.map((item: Record<string, any>) => {
        const stats = item.statistics || {};
        const engagementRate = profile.followersCount > 0 
          ? ((stats.likes || 0) + (stats.comments || 0) + (stats.shares || 0)) / profile.followersCount 
          : 0;

        let type: PostType = PostType.IMAGE;
        if (item.has_video) type = PostType.VIDEO;

        return {
          postId: item.post_id,
          platform: Platform.FACEBOOK,
          type,
          caption: item.text || null,
          url: item.post_url || `https://facebook.com/${item.post_id}`,
          likesCount: stats.likes || 0,
          commentsCount: stats.comments || 0,
          sharesCount: stats.shares || 0,
          viewsCount: stats.views || 0,
          engagementRate,
          postedAt: item.creation_time ? new Date(item.creation_time * 1000) : new Date(),
        };
      });
    }

    return { profile, posts };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Facebook Scraper Error:", msg);
    throw new Error(`Failed to scrape Facebook account ${handle}`);
  }
}
