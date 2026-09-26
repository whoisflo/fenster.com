export type Rule = (value: string) => string | null;
export type Schema<Field extends string> = Record<Field, readonly Rule[]>;
export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

export const required =
  (message: string): Rule =>
  (value) =>
    value === "" ? message : null;

export const lengthBetween =
  (min: number, max: number, message: string): Rule =>
  (value) =>
    value.length < min || value.length > max ? message : null;

export const matches =
  (pattern: RegExp, message: string): Rule =>
  (value) =>
    pattern.test(value) ? null : message;

export function validateFields<Field extends string>(
  values: Record<Field, string>,
  schema: Schema<Field>,
): FieldErrors<Field> {
  const errors: FieldErrors<Field> = {};

  for (const field of Object.keys(schema) as Field[]) {
    const value = values[field].trim();
    for (const rule of schema[field]) {
      const message = rule(value);
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }

  return errors;
}

export function trimValues<Values extends { [K in keyof Values]: string }>(
  values: Values,
): Values {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, String(value).trim()]),
  ) as Values;
}
