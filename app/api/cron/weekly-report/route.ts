import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enqueueReportJob } from "@/lib/queue/jobs/report.job";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Ideally we'd have a user setting for "email reports enabled", 
    // but PRD specifies we fetch all users with report email enabled.
    // For now we assume all verified users have it enabled unless explicitly disabled.
    // We'll queue for all verified users.
    const users = await prisma.user.findMany({
      where: { emailVerified: true },
      select: { id: true },
    });

    for (const user of users) {
      await enqueueReportJob(user.id, "WEEKLY");
    }

    return NextResponse.json({ success: true, enqueued: users.length });
  } catch (error) {
    console.error("Cron weekly-report error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
