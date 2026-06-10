import { Worker } from "bullmq";
import Redis from "ioredis";
import { QUEUE_NAMES } from "@/constants";
import { prisma } from "@/lib/db";
import { scrapeAccount } from "@/lib/scraper";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const scrapeWorker = new Worker(
  QUEUE_NAMES.SCRAPE,
  async (job) => {
    const { userId } = job.data;
    if (!userId) throw new Error("Missing userId in scrape job");

    const accounts = await prisma.connectedAccount.findMany({
      where: { userId, isActive: true },
    });

    for (const account of accounts) {
      try {
        const { profile, posts } = await scrapeAccount(account.platform, account.handle);

        const updatedAccount = await prisma.connectedAccount.update({
          where: { id: account.id },
          data: {
            followersCount: profile.followersCount,
            followingCount: profile.followingCount,
            postsCount: profile.postsCount,
            bio: profile.bio,
            profileUrl: profile.profileUrl,
            avatarUrl: profile.avatarUrl,
            lastScrapedAt: new Date(),
          },
        });

        const engagementRate = profile.followersCount > 0 
          ? posts.slice(0, 30).reduce((acc, p) => acc + p.engagementRate, 0) / Math.min(posts.length, 30)
          : 0;

        await prisma.profileSnapshot.upsert({
          where: {
            accountId_date: {
              accountId: updatedAccount.id,
              date: new Date(new Date().setHours(0,0,0,0)),
            },
          },
          update: {
            followersCount: profile.followersCount,
            followingCount: profile.followingCount,
            postsCount: profile.postsCount,
            engagementRate,
          },
          create: {
            accountId: updatedAccount.id,
            date: new Date(new Date().setHours(0,0,0,0)),
            followersCount: profile.followersCount,
            followingCount: profile.followingCount,
            postsCount: profile.postsCount,
            engagementRate,
          },
        });

        for (const post of posts) {
          await prisma.post.upsert({
            where: {
              accountId_postId: {
                accountId: updatedAccount.id,
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
              accountId: updatedAccount.id,
              platform: account.platform,
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
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Failed to scrape account ${account.handle} on ${account.platform}:`, msg);
        
        // Mark as inactive if failing consistently - simplified logic
        if (job.attemptsMade === job.opts.attempts! - 1) {
          await prisma.connectedAccount.update({
            where: { id: account.id },
            data: { isActive: false },
          });
        }
        throw err;
      }
    }
  },
  { 
    connection: connection as any,
    limiter: {
      max: 2, // Maximum 2 jobs
      duration: 1000, // per 1 second (protects RapidAPI limits)
    }
  }
);
