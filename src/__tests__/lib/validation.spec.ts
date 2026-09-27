import { expect, it } from "vitest";

import {
  lengthBetween,
  matches,
  required,
  trimValues,
  validateFields,
} from "@/lib/validation";

const schema = {
  city: [
    required("Enter a city"),
    lengthBetween(2, 60, "Enter a valid city"),
    matches(/^\p{L}+$/u, "Letters only"),
  ],
  postalCode: [required("Enter a postal code")],
};

it.each([
  [{ city: "Stuttgart", postalCode: "70173" }, {}],
  [
    { city: "   ", postalCode: "" },
    { city: "Enter a city", postalCode: "Enter a postal code" },
  ],
  [{ city: "S", postalCode: "70173" }, { city: "Enter a valid city" }],
  [{ city: "Stuttgart1", postalCode: "70173" }, { city: "Letters only" }],
])(
  "validateFields(%j) reports the first problem per field, after trimming",
  (values, errors) => {
    expect(validateFields(values, schema)).toEqual(errors);
  },
);

it("trimValues trims a copy and leaves the original alone", () => {
  const values = { city: "  Stuttgart " };

  expect(trimValues(values)).toEqual({ city: "Stuttgart" });
  expect(values.city).toBe("  Stuttgart ");
});
