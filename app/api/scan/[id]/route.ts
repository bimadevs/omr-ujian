import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, context: RouteContext) {
  const { id } = await context.params;

  const scan = await prisma.scan.findUnique({ where: { id } });
  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  try {
    const fullPath = join(process.cwd(), "public", scan.imagePath);
    await unlink(fullPath);
  } catch {
    // ignore file not found
  }

  await prisma.scan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
