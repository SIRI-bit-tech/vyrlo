import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitors | Vyrlo",
  description: "Track your competitors in your niche.",
};
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { CompetitorManager } from "./components/CompetitorManager";

export default async function CompetitorsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const competitors = await prisma.competitor.findMany({
    where: { userId: session.user.id },
    include: {
      snapshots: { orderBy: { date: "desc" }, take: 30 },
      posts: { orderBy: { engagementRate: "desc" }, take: 5 }
    }
  });

  const ownAccounts = await prisma.connectedAccount.findMany({
    where: { userId: session.user.id },
    include: {
      snapshots: { orderBy: { date: "desc" }, take: 30 }
    }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Competitors</h1>
      <CompetitorManager initialCompetitors={competitors} ownAccounts={ownAccounts} />
    </div>
  );
}
