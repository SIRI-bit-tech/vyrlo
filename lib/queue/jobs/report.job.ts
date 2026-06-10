import { addJob, reportQueue } from "../index";

export async function enqueueReportJob(userId: string, period: "WEEKLY" | "MONTHLY") {
  return addJob(reportQueue, "generate-report", { userId, period });
}
