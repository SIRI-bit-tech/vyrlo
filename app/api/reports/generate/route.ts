import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { enqueueReportJob } from "@/lib/queue/jobs/report.job";
import { z } from "zod";
import { ReportPeriod } from "@prisma/client";

const GenerateReportSchema = z.object({
  period: z.nativeEnum(ReportPeriod)
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = GenerateReportSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { period } = parsed.data;

    const job = await enqueueReportJob(session.user.id, period);

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: unknown) {
    console.error("Reports Generate API Error:", error);
    return NextResponse.json({ error: "Failed to enqueue report generation" }, { status: 500 });
  }
}
