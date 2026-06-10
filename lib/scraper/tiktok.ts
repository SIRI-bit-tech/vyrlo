import { Platform, PostType } from "@prisma/client";
import { ScrapedProfile, ScrapedPost } from "@/types";
import { RAPIDAPI_HOST_MAP } from "@/constants";

export async function scrapeTikTok(handle: string): Promise<{ profile: ScrapedProfile; posts: ScrapedPost[] }> {
  const host = RAPIDAPI_HOST_MAP[Platform.TIKTOK];
  const apiKey = process.env.RAPIDAPI_KEY || "";
  const cleanHandle = handle.replace("@", "");

  try {
    const res = await fetch(`https://${host}/api/user/info?username=${cleanHandle}`, {
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
      },
    });

    if (!res.ok) throw new Error(`RapidAPI Error: ${res.status}`);
    const data = await res.json();
    const user = data?.userInfo?.user;
    const stats = data?.userInfo?.stats;

    if (!user) throw new Error("User data missing in TikTok response");

    const profile: ScrapedProfile = {
      handle: user.uniqueId || cleanHandle,
      platform: Platform.TIKTOK,
      followersCount: stats?.followerCount || 0,
      followingCount: stats?.followingCount || 0,
      postsCount: stats?.videoCount || 0,
      bio: user.signature || null,
      profileUrl: `https://tiktok.com/@${user.uniqueId}`,
      avatarUrl: user.avatarLarger || user.avatarMedium || null,
    };

    // Fetch videos
    const vidRes = await fetch(`https://${host}/api/user/posts?username=${cleanHandle}&count=30`, {
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
      },
    });
    
    let posts: ScrapedPost[] = [];
    if (vidRes.ok) {
      const vidData = await vidRes.json();
      const itemList = vidData?.itemList || [];
      
      posts = itemList.map((item: Record<string, any>) => {
        const stats = item.stats || {};
        const engagementRate = profile.followersCount > 0 
          ? (stats.diggCount + stats.commentCount + stats.shareCount) / profile.followersCount 
          : 0;

        return {
          postId: item.id,
          platform: Platform.TIKTOK,
          type: PostType.VIDEO,
          caption: item.desc || null,
          url: `https://tiktok.com/@${profile.handle}/video/${item.id}`,
          likesCount: stats.diggCount || 0,
          commentsCount: stats.commentCount || 0,
          sharesCount: stats.shareCount || 0,
          viewsCount: stats.playCount || 0,
          engagementRate,
          postedAt: new Date(item.createTime * 1000),
        };
      });
    }

    return { profile, posts };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("TikTok Scraper Error:", msg);
    throw new Error(`Failed to scrape TikTok account ${handle}`);
  }
}
