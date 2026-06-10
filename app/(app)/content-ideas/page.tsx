import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Ideas | Vyrlo",
  description: "AI-generated content ideas for your audience.",
};
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { IdeaGenerator } from "./components/IdeaGenerator";

export default async function ContentIdeasPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const accounts = await prisma.connectedAccount.findMany({
    where: { userId: session.user.id },
    select: { platform: true, handle: true }
  });

  const recentIdeas = await prisma.contentIdea.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Content Ideas</h1>
      <IdeaGenerator accounts={accounts} initialIdeas={recentIdeas} />
    </div>
  );
}
