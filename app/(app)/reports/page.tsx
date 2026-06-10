import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports | Vyrlo",
  description: "View and generate performance reports.",
};
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ReportManager } from "./components/ReportManager";

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 12
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">AI Performance Reports</h1>
      <ReportManager initialReports={reports} />
    </div>
  );
}
