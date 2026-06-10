import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enqueueScrapeJob } from "@/lib/queue/jobs/scrape.job";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        accounts: {
          some: { isActive: true },
        },
      },
      select: { id: true },
    });

    for (const user of users) {
      await enqueueScrapeJob(user.id);
    }

    return NextResponse.json({ success: true, enqueued: users.length });
  } catch (error) {
    console.error("Cron daily-scrape error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
