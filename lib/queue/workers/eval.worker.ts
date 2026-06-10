import { Worker } from "bullmq";
import Redis from "ioredis";
import { QUEUE_NAMES } from "@/constants";
import { prisma } from "@/lib/db";
import { evaluateContentIdea } from "@/lib/gemini";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const evalWorker = new Worker(
  QUEUE_NAMES.EVAL,
  async (job) => {
    const { contentIdeaId } = job.data;
    if (!contentIdeaId) throw new Error("Missing contentIdeaId in eval job");

    const idea = await prisma.contentIdea.findUnique({
      where: { id: contentIdeaId },
      include: { user: { include: { creatorProfile: true } } },
    });

    if (!idea) throw new Error("Idea not found");

    // Fetch the posts it was based on
    const posts = await prisma.post.findMany({
      where: { postId: { in: idea.basedOnPostIds } },
    });

    const dataPayload = {
      contentIdea: {
        title: idea.title,
        description: idea.description,
        format: idea.format,
        hook: idea.hook,
      },
      platform: idea.platform,
      historicalData: posts,
    };

    const geminiContext = idea.user.creatorProfile?.geminiContext;
    const result = await evaluateContentIdea(dataPayload, geminiContext);

    await prisma.evalEntry.create({
      data: {
        userId: idea.userId,
        contentIdeaId: idea.id,
        score: result.score,
        feedback: result.feedback,
        improvedSuggestion: result.improvedSuggestion,
      },
    });

    await prisma.contentIdea.update({
      where: { id: idea.id },
      data: {
        evalScore: result.score,
        evalFeedback: result.feedback,
      },
    });
  },
  { 
    connection: connection as any,
    limiter: {
      max: 1, // Maximum 1 job
      duration: 4500, // per 4.5 seconds (protects Gemini free tier 15 RPM)
    }
  }
);
