import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function GET() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const totalPg = parseInt(formData.get("totalPg") as string) || 35;
  const totalPgk = parseInt(formData.get("totalPgk") as string) || 10;
  const pgOptions = parseInt(formData.get("pgOptions") as string) || 5;
  const pgkOptions = parseInt(formData.get("pgkOptions") as string) || 10;
  const image = formData.get("image") as File;

  if (!name || !image) {
    return NextResponse.json(
      { error: "Missing name or image" },
      { status: 400 }
    );
  }

  const uploadDir = join(process.cwd(), "public", "uploads", "templates");
  await mkdir(uploadDir, { recursive: true });

  const ext = image.name.split(".").pop() || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = join(uploadDir, filename);
  const imagePath = `/uploads/templates/${filename}`;

  const bytes = await image.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  const template = await prisma.template.create({
    data: {
      name,
      imagePath,
      totalPg,
      totalPgk,
      pgOptions,
      pgkOptions,
    },
  });

  return NextResponse.json(template, { status: 201 });
}
