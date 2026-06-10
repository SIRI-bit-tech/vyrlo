import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Vyrlo",
  description: "Deep dive into your performance metrics.",
};
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AnalyticsCharts } from "./components/AnalyticsCharts";

export default async function AnalyticsPage(props: { searchParams: Promise<{ accountId?: string; days?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const searchParams = await props.searchParams;
  const days = parseInt(searchParams.days || "30", 10);
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const whereClause = searchParams.accountId 
    ? { id: searchParams.accountId, userId: session.user.id }
    : { userId: session.user.id };

  const accounts = await prisma.connectedAccount.findMany({
    where: whereClause,
    include: {
      snapshots: {
        where: { date: { gte: dateLimit } },
        orderBy: { date: "asc" },
      },
      posts: {
        where: { postedAt: { gte: dateLimit } },
        orderBy: { postedAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
      {/* We offload the interactive charting and table to a client component */}
      <AnalyticsCharts accounts={accounts} />
    </div>
  );
}
