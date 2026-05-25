import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const keys = await prisma.answerKey.findMany({
    where: { templateId: id },
    orderBy: { questionNo: "asc" },
  });
  return NextResponse.json(keys);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = await req.json();

  const template = await prisma.template.findUnique({ where: { id } });
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  if (!Array.isArray(body.keys)) {
    return NextResponse.json(
      { error: "keys must be an array" },
      { status: 400 }
    );
  }

  await prisma.answerKey.deleteMany({ where: { templateId: id } });

  const created = await prisma.answerKey.createMany({
    data: body.keys.map((k: { questionNo: number; questionType: string; answers: string }) => ({
      templateId: id,
      questionNo: k.questionNo,
      questionType: k.questionType,
      answers: k.answers,
    })),
  });

  return NextResponse.json({ count: created.count }, { status: 201 });
}
