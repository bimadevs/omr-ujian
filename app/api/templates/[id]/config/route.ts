import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const config = await prisma.templateConfig.findUnique({
    where: { templateId: id },
  });

  if (!config) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  return NextResponse.json(config);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await req.json();

  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const existing = await prisma.templateConfig.findUnique({
    where: { templateId: id },
  });

  const data = {
    templateId: id,
    pgStartX: body.pgStartX,
    pgStartY: body.pgStartY,
    pgBoxWidth: body.pgBoxWidth,
    pgBoxHeight: body.pgBoxHeight,
    pgGapX: body.pgGapX,
    pgGapY: body.pgGapY,
    pgColGap: body.pgColGap,
    pgkStartX1: body.pgkStartX1,
    pgkStartY1: body.pgkStartY1,
    pgkStartX2: body.pgkStartX2,
    pgkStartY2: body.pgkStartY2,
    pgkBoxWidth: body.pgkBoxWidth,
    pgkBoxHeight: body.pgkBoxHeight,
    pgkGapX: body.pgkGapX,
    pgkGapY: body.pgkGapY,
  };

  if (existing) {
    const updated = await prisma.templateConfig.update({
      where: { templateId: id },
      data,
    });
    return NextResponse.json(updated);
  } else {
    const created = await prisma.templateConfig.create({ data });
    return NextResponse.json(created, { status: 201 });
  }
}
