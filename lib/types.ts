export interface TemplateConfig {
  id: number;
  name: string;
  imageUrl: string;
  totalQuestions: number;
  pgCount: number;
  pgkCount: number;
  coordinates: BoxCoordinates[];
  createdAt: string;
}

export interface BoxCoordinates {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface AnswerKey {
  id: number;
  templateId: number;
  questionNumber: number;
  type: 'PG' | 'PGK';
  correctAnswers: string[];
}

export interface ScanResult {
  id: number;
  templateId: number;
  templateName: string;
  studentName: string;
  pgCorrect: number;
  pgTotal: number;
  pgkCorrect: number;
  pgkTotal: number;
  score: number;
  details: ScanDetail[];
  imageUrl: string;
  createdAt: string;
}

export interface ScanDetail {
  questionNumber: number;
  type: 'PG' | 'PGK';
  detected: string[];
  correct: string[];
  isCorrect: boolean;
}
