import { scrapeWorker } from "./lib/queue/workers/scrape.worker";
import { reportWorker } from "./lib/queue/workers/report.worker";
import { evalWorker } from "./lib/queue/workers/eval.worker";

console.log("Starting Vyrlo Background Workers...");

scrapeWorker.on("completed", (job) => {
  console.log(`[Scrape] Job ${job.id} completed successfully`);
});

scrapeWorker.on("failed", (job, err) => {
  console.log(`[Scrape] Job ${job?.id} failed with error: ${err.message}`);
});

reportWorker.on("completed", (job) => {
  console.log(`[Report] Job ${job.id} completed successfully`);
});

reportWorker.on("failed", (job, err) => {
  console.log(`[Report] Job ${job?.id} failed with error: ${err.message}`);
});

evalWorker.on("completed", (job) => {
  console.log(`[Eval] Job ${job.id} completed successfully`);
});

evalWorker.on("failed", (job, err) => {
  console.log(`[Eval] Job ${job?.id} failed with error: ${err.message}`);
});

// Handle graceful shutdown
const shutdown = async () => {
  console.log("Shutting down workers...");
  await Promise.all([
    scrapeWorker.close(),
    reportWorker.close(),
    evalWorker.close()
  ]);
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
