import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processOMR } from "@/lib/omr";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const templateId = formData.get("templateId") as string;
  const studentName = (formData.get("studentName") as string) || null;
  const image = formData.get("image") as File;

  if (!templateId || !image) {
    return NextResponse.json(
      { error: "Missing templateId or image" },
      { status: 400 }
    );
  }

  const template = await prisma.template.findUnique({
    where: { id: templateId },
    include: { config: true },
  });

  if (!template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  if (!template.config) {
    return NextResponse.json(
      { error: "Template config not found" },
      { status: 400 }
    );
  }

  const answerKeys = await prisma.answerKey.findMany({
    where: { templateId },
  });

  const uploadDir = join(process.cwd(), "public", "uploads", "scans");
  await mkdir(uploadDir, { recursive: true });

  const ext = image.name.split(".").pop() || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = join(uploadDir, filename);
  const imagePath = `/uploads/scans/${filename}`;

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  const config = template.config;
  const result = await processOMR(buffer, config, answerKeys);

  const scan = await prisma.scan.create({
    data: {
      templateId,
      imagePath,
      studentName,
      scorePg: result.scorePg,
      scorePgk: result.scorePgk,
      totalScore: result.totalScore,
      answers: {
        create: result.answers.map((a) => ({
          questionNo: a.questionNo,
          questionType: a.questionType,
          detected: a.detected,
          isCorrect: a.isCorrect,
        })),
      },
    },
    include: { answers: true },
  });

  return NextResponse.json({ scan, result }, { status: 201 });
}
