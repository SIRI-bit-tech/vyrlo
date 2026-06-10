import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resend } from "@/lib/resend";
import { OTP_EXPIRY_MINUTES, RESEND_FROM } from "@/constants";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Check if user is already verified
  if (session.user.emailVerified) {
    return NextResponse.json({ error: "Already verified" }, { status: 400 });
  }

  // Rate limiting check
  const existingToken = await prisma.verificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (existingToken) {
    const timeSinceLastOtp = Date.now() - existingToken.createdAt.getTime();
    if (timeSinceLastOtp < 60 * 1000) {
      return NextResponse.json(
        { error: "Please wait 60 seconds before requesting a new OTP" },
        { status: 429 }
      );
    }
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenHash = crypto.createHash("sha256").update(otp).digest("hex");

  // Invalidate old tokens for this user
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });

  // Save new token
  await prisma.verificationToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });

  // Send Email
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: session.user.email,
      subject: "Your Vyrlo verification code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="background-color: #09090b; padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Vyrlo</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; font-size: 20px; color: #18181b; font-weight: 600;">Verify your email address</h2>
              <p style="margin: 0 0 30px; font-size: 16px; color: #52525b; line-height: 1.5;">
                Please enter the following verification code to confirm your email address. This code is valid for ${OTP_EXPIRY_MINUTES} minutes.
              </p>
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 30px;">
                <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #09090b;">${otp}</span>
              </div>
              <p style="margin: 0; font-size: 14px; color: #71717a; line-height: 1.5;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>
            <div style="background-color: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                &copy; ${new Date().getFullYear()} Vyrlo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
