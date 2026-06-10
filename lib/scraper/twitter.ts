import { Platform, PostType } from "@prisma/client";
import { ScrapedProfile, ScrapedPost } from "@/types";
import { RAPIDAPI_HOST_MAP } from "@/constants";

export async function scrapeTwitter(handle: string): Promise<{ profile: ScrapedProfile; posts: ScrapedPost[] }> {
  const host = RAPIDAPI_HOST_MAP[Platform.TWITTER];
  const apiKey = process.env.RAPIDAPI_KEY || "";
  const cleanHandle = handle.replace("@", "");

  try {
    const res = await fetch(`https://${host}/screenname.php?screenname=${cleanHandle}`, {
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
      },
    });

    if (!res.ok) throw new Error(`RapidAPI Error: ${res.status}`);
    const user = await res.json();

    if (!user || user.status === "error" || !user.id_str) {
      throw new Error("User data missing in Twitter response");
    }

    const profile: ScrapedProfile = {
      handle: user.screen_name || cleanHandle,
      platform: Platform.TWITTER,
      followersCount: user.followers_count || 0,
      followingCount: user.friends_count || 0,
      postsCount: user.statuses_count || 0,
      bio: user.description || null,
      profileUrl: `https://twitter.com/${user.screen_name}`,
      avatarUrl: user.profile_image_url_https?.replace("_normal", "") || null,
    };

    // To get tweets from this user we need a different endpoint depending on the exact RapidAPI TwttrAPI
    // We assume a generic timeline endpoint structure for this implementation
    const timelineRes = await fetch(`https://${host}/timeline.php?screenname=${cleanHandle}&count=30`, {
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
      },
    });

    let posts: ScrapedPost[] = [];
    if (timelineRes.ok) {
      const timelineData = await timelineRes.json();
      const tweets = timelineData?.timeline || [];
      
      posts = tweets.map((tweet: Record<string, any>) => {
        const engagementRate = profile.followersCount > 0 
          ? ((tweet.favorite_count || 0) + (tweet.retweet_count || 0) + (tweet.reply_count || 0)) / profile.followersCount 
          : 0;

        return {
          postId: tweet.id_str,
          platform: Platform.TWITTER,
          type: PostType.TWEET,
          caption: tweet.text || null,
          url: `https://twitter.com/${profile.handle}/status/${tweet.id_str}`,
          likesCount: tweet.favorite_count || 0,
          commentsCount: tweet.reply_count || 0,
          sharesCount: tweet.retweet_count || 0,
          viewsCount: tweet.views || 0, // Twitter views not always available via API
          engagementRate,
          postedAt: new Date(tweet.created_at),
        };
      });
    }

    return { profile, posts };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Twitter Scraper Error:", msg);
    throw new Error(`Failed to scrape Twitter account ${handle}`);
  }
}
