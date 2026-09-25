import { describe, expect, it } from "vitest";

import { formatMoney, toCents } from "@/lib/money";

describe("toCents", () => {
  it("converts API prices to whole cents", () => {
    expect(toCents(109.95)).toBe(10995);
    expect(toCents(22.3)).toBe(2230);
    expect(toCents(29)).toBe(2900);
  });

  it("removes floating-point noise", () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
  });
});

describe("formatMoney", () => {
  it("formats cents as US dollars", () => {
    expect(formatMoney(1999)).toBe("$19.99");
    expect(formatMoney(69500)).toBe("$695.00");
  });

  it("groups thousands", () => {
    expect(formatMoney(109950)).toBe("$1,099.50");
  });

  it("shows zero with cents", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });
});
