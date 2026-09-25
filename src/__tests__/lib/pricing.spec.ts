import { describe, expect, it } from "vitest";

import { grandTotal, lineTotal, subtotal, tax } from "@/lib/pricing";

describe("lineTotal", () => {
  it("multiplies the unit price by the quantity", () => {
    expect(lineTotal({ unitPriceCents: 10995, quantity: 3 })).toBe(32985);
  });
});

describe("subtotal", () => {
  it("adds up all line totals", () => {
    const lines = [
      { unitPriceCents: 10995, quantity: 2 },
      { unitPriceCents: 2230, quantity: 1 },
    ];

    expect(subtotal(lines)).toBe(24220);
  });

  it("is zero for an empty cart", () => {
    expect(subtotal([])).toBe(0);
  });
});

describe("tax", () => {
  it("is 20% of the subtotal", () => {
    expect(tax(24220)).toBe(4844);
  });

  it("rounds to whole cents", () => {
    expect(tax(1999)).toBe(400);
    expect(tax(1997)).toBe(399);
  });

  it("is zero for an empty cart", () => {
    expect(tax(0)).toBe(0);
  });
});

describe("grandTotal", () => {
  it("adds subtotal, shipping and tax", () => {
    expect(
      grandTotal({ subtotalCents: 24220, shippingCents: 1200, taxCents: 4844 }),
    ).toBe(30264);
  });

  it("works without shipping", () => {
    expect(
      grandTotal({ subtotalCents: 24220, shippingCents: 0, taxCents: 4844 }),
    ).toBe(29064);
  });
});
