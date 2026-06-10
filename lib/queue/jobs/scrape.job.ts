import { addJob, scrapeQueue } from "../index";

export async function enqueueScrapeJob(userId: string) {
  return addJob(scrapeQueue, "scrape-user-accounts", { userId });
}
