import { CURRENCY, LOCALE } from "@/config";

const formatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
});

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function formatMoney(cents: number): string {
  return formatter.format(cents / 100);
}
