import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const scans = await prisma.scan.findMany({
    where: { templateId: id },
    include: { answers: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(scans);
}
