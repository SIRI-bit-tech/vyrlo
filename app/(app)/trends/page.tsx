import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trends | Vyrlo",
  description: "Trend analysis for your niche.",
};
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { TrendManager } from "./components/TrendManager";

export default async function TrendsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { creatorProfile: true }
  });

  const trends = await prisma.trendEntry.findMany({
    orderBy: { fetchedAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Trend Analysis</h1>
      <TrendManager initialTrends={trends} niche={user?.creatorProfile?.niches?.join(", ") || ""} />
    </div>
  );
}
