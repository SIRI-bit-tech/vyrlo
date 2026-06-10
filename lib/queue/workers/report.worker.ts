import { Worker } from "bullmq";
import Redis from "ioredis";
import { QUEUE_NAMES, RESEND_FROM } from "@/constants";
import { prisma } from "@/lib/db";
import { generateReportSummary } from "@/lib/gemini";
import { resend } from "@/lib/resend";
// We'd import the template here, but we'll use raw HTML for now or we will create it later
import { render } from "@react-email/components";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const reportWorker = new Worker(
  QUEUE_NAMES.REPORT,
  async (job) => {
    const { userId, period } = job.data;
    if (!userId || !period) throw new Error("Missing data in report job");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { creatorProfile: true, accounts: true },
    });

    if (!user) throw new Error("User not found");

    const days = period === "WEEKLY" ? 7 : 30;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    // Fetch snapshots and posts for the period
    const accounts = await prisma.connectedAccount.findMany({
      where: { userId },
      include: {
        snapshots: {
          where: { date: { gte: dateLimit } },
          orderBy: { date: "asc" },
        },
        posts: {
          where: { postedAt: { gte: dateLimit } },
          orderBy: { engagementRate: "desc" },
          take: 5,
        },
      },
    });

    const dataPayload = {
      period,
      accounts: accounts.map(a => ({
        platform: a.platform,
        handle: a.handle,
        snapshots: a.snapshots,
        topPosts: a.posts,
      }))
    };

    const geminiContext = user.creatorProfile?.geminiContext;
    const reportJson = await generateReportSummary(dataPayload, geminiContext);

    const report = await prisma.report.create({
      data: {
        userId,
        period,
        content: JSON.stringify(reportJson),
      },
    });

    try {
      // Very simple fallback if we don't have the react-email template rendered yet
      await resend.emails.send({
        from: RESEND_FROM,
        to: user.email,
        subject: `Your ${period === "WEEKLY" ? "Weekly" : "Monthly"} Vyrlo Report`,
        html: `<p>Your report is ready! View it on your dashboard.</p><pre>${JSON.stringify(reportJson, null, 2)}</pre>`,
      });

      await prisma.report.update({
        where: { id: report.id },
        data: { emailSent: true, sentAt: new Date() },
      });
    } catch (e) {
      console.error("Failed to send report email:", e);
      // We don't throw here to avoid retrying the expensive Gemini generation
    }
  },
  { 
    connection: connection as any,
    limiter: {
      max: 1, // Maximum 1 job
      duration: 4500, // per 4.5 seconds (protects Gemini free tier 15 RPM)
    }
  }
);
