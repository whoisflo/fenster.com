export type ParsedWholeNumber =
  | { status: "valid"; value: number }
  | { status: "outOfRange"; value: number; error: string }
  | { status: "invalid"; error: string };

export function clampInteger(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

export function parseWholeNumber(
  text: string,
  { min, max }: { min: number; max: number },
): ParsedWholeNumber {
  const trimmed = text.trim();

  if (trimmed === "") return { status: "invalid", error: "Enter a number" };
  if (!/^\d+$/.test(trimmed))
    return { status: "invalid", error: "Whole numbers only" };

  const value = Number(trimmed);
  if (value < min)
    return { status: "outOfRange", value, error: `Minimum is ${min}` };
  if (value > max)
    return { status: "outOfRange", value, error: `Maximum is ${max}` };

  return { status: "valid", value };
}
