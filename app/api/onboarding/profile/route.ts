import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { niches, platforms, challenge, experience, goal } = await req.json();

  if (!niches || niches.length === 0 || !platforms || !challenge || !experience || !goal) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const geminiContext = `This creator's niches are ${niches.join(", ")}. They are most active on ${platforms.join(", ")}. Their biggest current challenge is ${challenge}. They have been creating content for ${experience}. Their primary goal is ${goal}. Use this context to make all suggestions, analysis, and recommendations specific to their situation. Do not give generic creator advice.`;

  await prisma.creatorProfile.upsert({
    where: { userId },
    update: { niches, platforms, challenge, experience, goal, geminiContext },
    create: { userId, niches, platforms, challenge, experience, goal, geminiContext },
  });

  return NextResponse.json({ success: true });
}
