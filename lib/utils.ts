export function generateId(): string {
  return crypto.randomUUID();
}

export function getPgOptionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function getPgkOptionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}
