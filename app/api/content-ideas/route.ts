import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateContentIdeas } from "@/lib/gemini";
import { z } from "zod";
import { Platform } from "@prisma/client";

const GenerateIdeasSchema = z.object({
  platform: z.nativeEnum(Platform)
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = GenerateIdeasSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { platform } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { creatorProfile: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const account = await prisma.connectedAccount.findFirst({
      where: { userId: session.user.id, platform },
      include: {
        posts: { orderBy: { engagementRate: "desc" }, take: 10 }
      }
    });

    if (!account) {
      return NextResponse.json({ error: "No connected account for this platform" }, { status: 400 });
    }

    const dataPayload = {
      platform,
      handle: account.handle,
      topPosts: account.posts
    };

    const ideasJson = await generateContentIdeas(dataPayload, user.creatorProfile?.geminiContext);

    const savedIdeas = await Promise.all(
      ideasJson.map(async (idea: any) => {
        return prisma.contentIdea.create({
          data: {
            userId: session.user.id,
            platform,
            title: idea.title,
            description: idea.description,
            format: idea.format,
            hook: idea.hook,
            estimatedEngagement: idea.estimatedEngagement,
            basedOnPostIds: idea.basedOnPostIds,
            geminiRawResponse: JSON.stringify(idea)
          }
        });
      })
    );

    return NextResponse.json({ data: savedIdeas });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to generate ideas";
    console.error("Content Ideas API Error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
