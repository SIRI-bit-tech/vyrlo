import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Platform } from "@prisma/client";
import { z } from "zod";
import { scrapeAccount } from "@/lib/scraper";
import { MAX_TRACKED_COMPETITORS } from "@/constants";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const competitors = await prisma.competitor.findMany({
      where: { userId: session.user.id },
      include: {
        snapshots: { orderBy: { date: "desc" }, take: 30 },
        posts: { orderBy: { engagementRate: "desc" }, take: 5 }
      }
    });

    return NextResponse.json({ data: competitors });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const PostCompetitorSchema = z.object({
  platform: z.nativeEnum(Platform),
  handle: z.string().min(1),
  niche: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = PostCompetitorSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { platform, handle, niche } = parsed.data;

    const count = await prisma.competitor.count({ where: { userId: session.user.id } });
    if (count >= MAX_TRACKED_COMPETITORS) {
      return NextResponse.json({ error: `Limit of ${MAX_TRACKED_COMPETITORS} competitors reached` }, { status: 400 });
    }

    // Attempt initial scrape to verify existence and get profile
    const { profile, posts } = await scrapeAccount(platform, handle);

    const competitor = await prisma.competitor.create({
      data: {
        userId: session.user.id,
        platform,
        handle: profile.handle,
        profileUrl: profile.profileUrl,
        avatarUrl: profile.avatarUrl,
        followersCount: profile.followersCount,
        niche,
        lastScrapedAt: new Date()
      }
    });

    const engagementRate = profile.followersCount > 0 
      ? posts.slice(0, 30).reduce((acc, p) => acc + p.engagementRate, 0) / Math.min(posts.length, 30)
      : 0;

    await prisma.competitorSnapshot.create({
      data: {
        competitorId: competitor.id,
        date: new Date(new Date().setHours(0,0,0,0)),
        followersCount: profile.followersCount,
        engagementRate
      }
    });

    for (const post of posts.slice(0, 5)) {
      await prisma.competitorPost.create({
        data: {
          competitorId: competitor.id,
          platform,
          postId: post.postId,
          type: post.type,
          caption: post.caption,
          url: post.url,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          sharesCount: post.sharesCount,
          viewsCount: post.viewsCount,
          engagementRate: post.engagementRate,
          postedAt: post.postedAt
        }
      });
    }

    return NextResponse.json({ success: true, data: competitor });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to add competitor";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
