import { Platform, PostType } from "@prisma/client";
import { ScrapedProfile, ScrapedPost } from "@/types";
import { RAPIDAPI_HOST_MAP } from "@/constants";

export async function scrapeInstagram(handle: string): Promise<{ profile: ScrapedProfile; posts: ScrapedPost[] }> {
  const host = RAPIDAPI_HOST_MAP[Platform.INSTAGRAM];
  const apiKey = process.env.RAPIDAPI_KEY || "";

  // This is a robust generic implementation targeting Instagram Scraper Stable
  try {
    const res = await fetch(`https://${host}/api/v1/users/web_profile_info?username=${handle}`, {
      headers: {
        "x-rapidapi-host": host,
        "x-rapidapi-key": apiKey,
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`RapidAPI Error: ${res.status}`);
    }

    const data = await res.json();
    const user = data?.data?.user;

    if (!user) {
      throw new Error("User data missing in Instagram response");
    }

    const profile: ScrapedProfile = {
      handle: user.username || handle,
      platform: Platform.INSTAGRAM,
      followersCount: user.edge_followed_by?.count || 0,
      followingCount: user.edge_follow?.count || 0,
      postsCount: user.edge_owner_to_timeline_media?.count || 0,
      bio: user.biography || null,
      profileUrl: `https://instagram.com/${user.username}`,
      avatarUrl: user.profile_pic_url_hd || user.profile_pic_url || null,
    };

    const edges = user.edge_owner_to_timeline_media?.edges || [];
    const posts: ScrapedPost[] = edges.map((edge: Record<string, any>) => {
      const node = edge.node;
      const likes = node.edge_liked_by?.count || 0;
      const comments = node.edge_media_to_comment?.count || 0;
      
      let type: PostType = PostType.IMAGE;
      if (node.is_video) type = PostType.VIDEO;
      else if (node.__typename === "GraphSidecar") type = PostType.CAROUSEL;

      const engagementRate = profile.followersCount > 0 
        ? (likes + comments) / profile.followersCount 
        : 0;

      return {
        postId: node.id,
        platform: Platform.INSTAGRAM,
        type,
        caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || null,
        url: `https://instagram.com/p/${node.shortcode}`,
        likesCount: likes,
        commentsCount: comments,
        sharesCount: 0, // usually not provided publicly
        viewsCount: node.video_view_count || 0,
        engagementRate,
        postedAt: new Date(node.taken_at_timestamp * 1000),
      };
    });

    return { profile, posts };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Instagram Scraper Error:", msg);
    throw new Error(`Failed to scrape Instagram account ${handle}`);
  }
}
