import { Queue } from "bullmq";
import Redis from "ioredis";
import { QUEUE_NAMES, JOB_ATTEMPTS, JOB_BACKOFF_DELAY } from "@/constants";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const scrapeQueue = new Queue(QUEUE_NAMES.SCRAPE, { connection: connection as any });
export const reportQueue = new Queue(QUEUE_NAMES.REPORT, { connection: connection as any });
export const evalQueue = new Queue(QUEUE_NAMES.EVAL, { connection: connection as any });

const defaultJobOptions = {
  attempts: JOB_ATTEMPTS,
  backoff: {
    type: "exponential",
    delay: JOB_BACKOFF_DELAY,
  },
  removeOnComplete: true,
  removeOnFail: false,
};

export async function addJob(queue: Queue, name: string, data: Record<string, unknown>) {
  return queue.add(name, data, defaultJobOptions);
}
