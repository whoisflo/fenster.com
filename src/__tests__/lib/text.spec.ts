import { describe, expect, it } from "vitest";

import { pluralize } from "@/lib/text";

describe("pluralize", () => {
  it("uses the singular for exactly one", () => {
    expect(pluralize(1, "item")).toBe("1 item");
  });

  it("uses the plural for any other count", () => {
    expect(pluralize(5, "item")).toBe("5 items");
    expect(pluralize(0, "item")).toBe("0 items");
  });

  it("accepts an irregular plural", () => {
    expect(pluralize(2, "box", "boxes")).toBe("2 boxes");
  });
});
