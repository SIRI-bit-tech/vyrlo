import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const competitor = await prisma.competitor.findUnique({
      where: { id }
    });

    if (!competitor || competitor.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 });
    }

    await prisma.competitor.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
