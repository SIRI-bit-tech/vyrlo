import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Platform } from "@prisma/client";
import { scrapeAccount } from "@/lib/scraper";

export async function POST(req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { platform } = await params;
  const platformEnum = platform.toUpperCase() as Platform;
  if (!Object.values(Platform).includes(platformEnum)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  const { handle, preview } = await req.json();
  if (!handle) {
    return NextResponse.json({ error: "Missing handle" }, { status: 400 });
  }

  try {
    const { profile, posts } = await scrapeAccount(platformEnum, handle);

    if (preview) {
      return NextResponse.json({ profile });
    }

    // Save to database
    const connectedAccount = await prisma.connectedAccount.upsert({
      where: {
        userId_platform_handle: {
          userId: session.user.id,
          platform: platformEnum,
          handle: profile.handle,
        },
      },
      update: {
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        postsCount: profile.postsCount,
        bio: profile.bio,
        profileUrl: profile.profileUrl,
        avatarUrl: profile.avatarUrl,
        isActive: true,
        lastScrapedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        platform: platformEnum,
        handle: profile.handle,
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        postsCount: profile.postsCount,
        bio: profile.bio,
        profileUrl: profile.profileUrl,
        avatarUrl: profile.avatarUrl,
        isActive: true,
        lastScrapedAt: new Date(),
      },
    });

    const engagementRate = profile.followersCount > 0 
      ? posts.slice(0, 30).reduce((acc, p) => acc + p.engagementRate, 0) / Math.min(posts.length, 30)
      : 0;

    await prisma.profileSnapshot.upsert({
      where: {
        accountId_date: {
          accountId: connectedAccount.id,
          date: new Date(new Date().setHours(0,0,0,0)), // Today at midnight
        },
      },
      update: {
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        postsCount: profile.postsCount,
        engagementRate,
      },
      create: {
        accountId: connectedAccount.id,
        date: new Date(new Date().setHours(0,0,0,0)),
        followersCount: profile.followersCount,
        followingCount: profile.followingCount,
        postsCount: profile.postsCount,
        engagementRate,
      },
    });

    // Save posts
    for (const post of posts) {
      await prisma.post.upsert({
        where: {
          accountId_postId: {
            accountId: connectedAccount.id,
            postId: post.postId,
          },
        },
        update: {
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          sharesCount: post.sharesCount,
          viewsCount: post.viewsCount,
          engagementRate: post.engagementRate,
        },
        create: {
          accountId: connectedAccount.id,
          platform: platformEnum,
          postId: post.postId,
          type: post.type,
          caption: post.caption,
          url: post.url,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          sharesCount: post.sharesCount,
          viewsCount: post.viewsCount,
          engagementRate: post.engagementRate,
          postedAt: post.postedAt,
        },
      });
    }

    return NextResponse.json({ success: true, profile });

  } catch (error: unknown) {
    console.error("Scrape Route Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to scrape account";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
