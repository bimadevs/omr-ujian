import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const template = await prisma.template.findUnique({
    where: { id },
    include: { config: true, answerKeys: true, scans: true },
  });

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function DELETE(req: Request, context: RouteContext) {
  const { id } = await context.params;

  const template = await prisma.template.findUnique({
    where: { id },
  });

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  try {
    const fullPath = join(process.cwd(), "public", template.imagePath);
    await unlink(fullPath);
  } catch {
    // ignore file not found
  }

  await prisma.template.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
