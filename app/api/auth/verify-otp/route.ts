import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { otp } = await req.json();

  if (!otp || typeof otp !== "string" || otp.length !== 6) {
    return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 });
  }

  const tokenRecord = await prisma.verificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!tokenRecord) {
    return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 400 });
  }

  if (new Date() > tokenRecord.expiresAt) {
    return NextResponse.json({ error: "Your code has expired." }, { status: 400 });
  }

  const inputHash = crypto.createHash("sha256").update(otp).digest("hex");

  if (inputHash !== tokenRecord.tokenHash) {
    // Increment attempts
    await prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { attempts: tokenRecord.attempts + 1 },
    });
    return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 400 });
  }

  // Success
  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });

  await prisma.verificationToken.delete({
    where: { id: tokenRecord.id },
  });

  return NextResponse.json({ success: true });
}
