import { expect, it } from "vitest";

import { subtotal, tax } from "@/lib/pricing";

it("adds up unit price × quantity for every line", () => {
  const lines = [
    { unitPriceCents: 10995, quantity: 2 },
    { unitPriceCents: 2230, quantity: 1 },
  ];

  expect(subtotal(lines)).toBe(24220);
  expect(subtotal([])).toBe(0);
});

it.each([
  [24220, 4844],
  [1999, 400],
  [1997, 399],
])("taxes %d cents at 20%%, rounded to %d", (subtotalCents, taxCents) => {
  expect(tax(subtotalCents)).toBe(taxCents);
});
