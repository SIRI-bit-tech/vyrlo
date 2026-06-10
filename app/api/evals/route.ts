import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { enqueueEvalJob } from "@/lib/queue/jobs/eval.job";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const evals = await prisma.evalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { contentIdea: true }
    });

    return NextResponse.json({ data: evals });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const EnqueueEvalSchema = z.object({
  contentIdeaId: z.string().uuid()
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = EnqueueEvalSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { contentIdeaId } = parsed.data;

    // Verify ownership
    const idea = await prisma.contentIdea.findUnique({ where: { id: contentIdeaId } });
    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json({ error: "Idea not found or forbidden" }, { status: 403 });
    }

    const job = await enqueueEvalJob(contentIdeaId);

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: unknown) {
    console.error("Evals POST API Error:", error);
    return NextResponse.json({ error: "Failed to enqueue evaluation" }, { status: 500 });
  }
}
