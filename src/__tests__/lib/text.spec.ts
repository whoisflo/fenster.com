import { expect, it } from "vitest";

import { pluralize } from "@/lib/text";

it("uses the singular only for exactly one", () => {
  expect(pluralize(1, "item")).toBe("1 item");
  expect(pluralize(0, "item")).toBe("0 items");
  expect(pluralize(2, "box", "boxes")).toBe("2 boxes");
});
