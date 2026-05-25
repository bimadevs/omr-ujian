import sharp from "sharp";

export interface TemplateConfig {
  pgStartX: number;
  pgStartY: number;
  pgBoxWidth: number;
  pgBoxHeight: number;
  pgGapX: number;
  pgGapY: number;
  pgColGap: number;
  pgkStartX1: number;
  pgkStartY1: number;
  pgkStartX2: number;
  pgkStartY2: number;
  pgkBoxWidth: number;
  pgkBoxHeight: number;
  pgkGapX: number;
  pgkGapY: number;
}

export interface AnswerKey {
  questionNo: number;
  questionType: string;
  answers: string;
}

export interface DetectedAnswer {
  questionNo: number;
  questionType: string;
  detected: string;
  isCorrect: boolean;
}

export interface ScanResult {
  answers: DetectedAnswer[];
  scorePg: number;
  scorePgk: number;
  totalScore: number;
}

function getPgOptionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function getPgkOptionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export async function processOMR(
  imageBuffer: Buffer,
  config: TemplateConfig,
  answerKeys: AnswerKey[]
): Promise<ScanResult> {
  const processed = await sharp(imageBuffer)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = processed;
  const width = info.width;
  const height = info.height;

  function getPixel(x: number, y: number): number {
    const clampedX = Math.max(0, Math.min(Math.round(x), width - 1));
    const clampedY = Math.max(0, Math.min(Math.round(y), height - 1));
    return data[clampedY * width + clampedX];
  }

  function isMarked(
    startX: number,
    startY: number,
    boxW: number,
    boxH: number
  ): boolean {
    let darkPixels = 0;
    let totalPixels = 0;
    const step = 2;
    for (let y = startY; y < startY + boxH; y += step) {
      for (let x = startX; x < startX + boxW; x += step) {
        const val = getPixel(x, y);
        if (val < 128) darkPixels++;
        totalPixels++;
      }
    }
    if (totalPixels === 0) return false;
    return darkPixels / totalPixels > 0.4;
  }

  const detectedAnswers: DetectedAnswer[] = [];

  for (let q = 0; q < 35; q++) {
    const col = Math.floor(q / 7);
    const row = q % 7;
    const qx =
      config.pgStartX + col * (5 * config.pgBoxWidth + config.pgColGap);
    const qy = config.pgStartY + row * config.pgGapY;

    let marked = "";
    for (let opt = 0; opt < 5; opt++) {
      const ox = qx + opt * config.pgGapX;
      const oy = qy;
      if (isMarked(ox, oy, config.pgBoxWidth, config.pgBoxHeight)) {
        if (marked) marked += ",";
        marked += getPgOptionLetter(opt);
      }
    }
    if (!marked) marked = "-";

    const answerKey = answerKeys.find(
      (k) => k.questionNo === q + 1 && k.questionType === "PG"
    );
    const isCorrect =
      answerKey !== undefined && answerKey.answers === marked;

    detectedAnswers.push({
      questionNo: q + 1,
      questionType: "PG",
      detected: marked,
      isCorrect,
    });
  }

  for (let q = 0; q < 10; q++) {
    const group = Math.floor(q / 5);
    const row = q % 5;
    const qx = group === 0 ? config.pgkStartX1 : config.pgkStartX2;
    const qy =
      (group === 0 ? config.pgkStartY1 : config.pgkStartY2) +
      row * config.pgkGapY;

    let marked = "";
    for (let opt = 0; opt < 10; opt++) {
      const ox = qx + opt * config.pgkGapX;
      const oy = qy;
      if (isMarked(ox, oy, config.pgkBoxWidth, config.pgkBoxHeight)) {
        if (marked) marked += ",";
        marked += getPgkOptionLetter(opt);
      }
    }
    if (!marked) marked = "-";

    const questionNo = 36 + q;
    const answerKey = answerKeys.find(
      (k) => k.questionNo === questionNo && k.questionType === "PGK"
    );

    let isCorrect = false;
    if (answerKey) {
      const expectedSet = new Set(
        answerKey.answers.split(",").map((s) => s.trim())
      );
      const detectedSet = new Set(
        marked.split(",").map((s) => s.trim())
      );
      if (expectedSet.has("-")) {
        isCorrect = detectedSet.has("-");
      } else {
        const allExpectedPresent = [...expectedSet].every((e) =>
          detectedSet.has(e)
        );
        const noExtra = [...detectedSet].every((d) =>
          expectedSet.has(d)
        );
        isCorrect = allExpectedPresent && noExtra;
      }
    }

    detectedAnswers.push({
      questionNo,
      questionType: "PGK",
      detected: marked,
      isCorrect,
    });
  }

  const scorePg = detectedAnswers.filter(
    (a) => a.questionType === "PG" && a.isCorrect
  ).length;
  const scorePgk = detectedAnswers.filter(
    (a) => a.questionType === "PGK" && a.isCorrect
  ).length;
  const totalScore = scorePg * 2 + scorePgk * 4;

  return {
    answers: detectedAnswers,
    scorePg,
    scorePgk,
    totalScore,
  };
}
