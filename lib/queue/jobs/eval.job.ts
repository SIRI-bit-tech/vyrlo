import { addJob, evalQueue } from "../index";

export async function enqueueEvalJob(contentIdeaId: string) {
  return addJob(evalQueue, "evaluate-idea", { contentIdeaId });
}
