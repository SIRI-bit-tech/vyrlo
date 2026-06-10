import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const AnalyticsQuerySchema = z.object({
  accountId: z.string().uuid().optional(),
  days: z.string().regex(/^\d+$/).transform(Number).default(30),
});

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsedParams = AnalyticsQuerySchema.safeParse({
      accountId: searchParams.get("accountId") || undefined,
      days: searchParams.get("days") || "30",
    });

    if (!parsedParams.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { accountId, days } = parsedParams.data;
    
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    // If accountId is provided, fetch just that account.
    // Otherwise, fetch all accounts for user.
    const whereClause = accountId 
      ? { id: accountId, userId: session.user.id }
      : { userId: session.user.id };

    const accounts = await prisma.connectedAccount.findMany({
      where: whereClause,
      include: {
        snapshots: {
          where: { date: { gte: dateLimit } },
          orderBy: { date: "asc" },
        },
        posts: {
          where: { postedAt: { gte: dateLimit } },
          orderBy: { postedAt: "desc" },
        },
      },
    });

    return NextResponse.json({ data: accounts });

  } catch (error: unknown) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
