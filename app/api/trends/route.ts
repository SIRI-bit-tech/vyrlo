import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Platform } from "@prisma/client";
import { z } from "zod";

const TrendsQuerySchema = z.object({
  platform: z.nativeEnum(Platform).optional(),
  niche: z.string().optional()
});

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const parsed = TrendsQuerySchema.safeParse({
      platform: searchParams.get("platform") || undefined,
      niche: searchParams.get("niche") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { platform, niche } = parsed.data;

    let whereClause: any = {};
    if (platform) whereClause.platform = platform;
    if (niche) whereClause.niche = niche;

    // In a real app we'd trigger a background job to fetch fresh trends if stale.
    // For now we just return existing entries from DB.
    const trends = await prisma.trendEntry.findMany({
      where: whereClause,
      orderBy: { fetchedAt: "desc" },
      take: 20
    });

    return NextResponse.json({ data: trends });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
