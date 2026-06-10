import { auth } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evaluations | Vyrlo",
  description: "Evaluate your content ideas.",
};
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { EvalManager } from "./components/EvalManager";

export default async function EvalsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const evals = await prisma.evalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { contentIdea: true }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Idea Evaluations</h1>
      <EvalManager initialEvals={evals} />
    </div>
  );
}
