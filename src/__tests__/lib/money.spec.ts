import { expect, it } from "vitest";

import { formatMoney, toCents } from "@/lib/money";

it.each([
  [109.95, 10995],
  [19.99, 1999],
  [0.1 + 0.2, 30],
])("toCents(%d) is %d, without floating-point noise", (amount, cents) => {
  expect(toCents(amount)).toBe(cents);
});

it.each([
  [0, "$0.00"],
  [1999, "$19.99"],
  [109950, "$1,099.50"],
])("formatMoney(%d) is %s", (cents, text) => {
  expect(formatMoney(cents)).toBe(text);
});
