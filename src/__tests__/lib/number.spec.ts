import { expect, it } from "vitest";

import { clampInteger, parseWholeNumber } from "@/lib/number";

it.each([
  [5, 5],
  [2.7, 2],
  [0, 1],
  [150, 99],
])("clampInteger(%d, 1, 99) is %d", (value, clamped) => {
  expect(clampInteger(value, 1, 99)).toBe(clamped);
});

it.each([
  [" 7 ", { status: "valid", value: 7 }],
  ["", { status: "invalid", error: "Enter a number" }],
  ["abc", { status: "invalid", error: "Whole numbers only" }],
  ["1.5", { status: "invalid", error: "Whole numbers only" }],
  ["0", { status: "outOfRange", value: 0, error: "Minimum is 1" }],
  ["150", { status: "outOfRange", value: 150, error: "Maximum is 99" }],
])('parseWholeNumber("%s")', (text, result) => {
  expect(parseWholeNumber(text, { min: 1, max: 99 })).toEqual(result);
});
