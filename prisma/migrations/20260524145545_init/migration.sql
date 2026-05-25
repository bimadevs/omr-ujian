-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "totalPg" INTEGER NOT NULL,
    "totalPgk" INTEGER NOT NULL,
    "pgOptions" INTEGER NOT NULL,
    "pgkOptions" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TemplateConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "pgStartX" REAL NOT NULL,
    "pgStartY" REAL NOT NULL,
    "pgBoxWidth" REAL NOT NULL,
    "pgBoxHeight" REAL NOT NULL,
    "pgGapX" REAL NOT NULL,
    "pgGapY" REAL NOT NULL,
    "pgColGap" REAL NOT NULL,
    "pgkStartX1" REAL NOT NULL,
    "pgkStartY1" REAL NOT NULL,
    "pgkStartX2" REAL NOT NULL,
    "pgkStartY2" REAL NOT NULL,
    "pgkBoxWidth" REAL NOT NULL,
    "pgkBoxHeight" REAL NOT NULL,
    "pgkGapX" REAL NOT NULL,
    "pgkGapY" REAL NOT NULL,
    CONSTRAINT "TemplateConfig_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnswerKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "questionNo" INTEGER NOT NULL,
    "questionType" TEXT NOT NULL,
    "answers" TEXT NOT NULL,
    CONSTRAINT "AnswerKey_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "studentName" TEXT,
    "scorePg" INTEGER NOT NULL,
    "scorePgk" INTEGER NOT NULL,
    "totalScore" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scan_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScanAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scanId" TEXT NOT NULL,
    "questionNo" INTEGER NOT NULL,
    "questionType" TEXT NOT NULL,
    "detected" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    CONSTRAINT "ScanAnswer_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TemplateConfig_templateId_key" ON "TemplateConfig"("templateId");
