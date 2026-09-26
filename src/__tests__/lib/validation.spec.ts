import { describe, expect, it } from "vitest";

import {
  lengthBetween,
  matches,
  required,
  trimValues,
  validateFields,
} from "@/lib/validation";

describe("required", () => {
  const rule = required("Enter a city");

  it("rejects an empty value", () => {
    expect(rule("")).toBe("Enter a city");
  });

  it("accepts any other value", () => {
    expect(rule("Stuttgart")).toBeNull();
  });
});

describe("lengthBetween", () => {
  const rule = lengthBetween(2, 4, "Wrong length");

  it("accepts lengths inside the range, including both ends", () => {
    expect(rule("ab")).toBeNull();
    expect(rule("abcd")).toBeNull();
  });

  it("rejects values that are too short or too long", () => {
    expect(rule("a")).toBe("Wrong length");
    expect(rule("abcde")).toBe("Wrong length");
  });
});

describe("matches", () => {
  const rule = matches(/^\d+$/, "Digits only");

  it("accepts values that match the pattern", () => {
    expect(rule("123")).toBeNull();
  });

  it("rejects values that do not", () => {
    expect(rule("12a")).toBe("Digits only");
  });
});

describe("validateFields", () => {
  const schema = {
    city: [
      required("Enter a city"),
      lengthBetween(2, 60, "Enter a valid city"),
    ],
    postalCode: [required("Enter a postal code")],
  };

  it("returns no errors for valid values", () => {
    expect(
      validateFields({ city: "Stuttgart", postalCode: "70173" }, schema),
    ).toEqual({});
  });

  it("returns the first failing message for each invalid field", () => {
    expect(validateFields({ city: "", postalCode: "" }, schema)).toEqual({
      city: "Enter a city",
      postalCode: "Enter a postal code",
    });
    expect(validateFields({ city: "S", postalCode: "70173" }, schema)).toEqual({
      city: "Enter a valid city",
    });
  });

  it("trims values before checking them", () => {
    expect(
      validateFields({ city: "   ", postalCode: " 70173 " }, schema),
    ).toEqual({ city: "Enter a city" });
  });
});

describe("trimValues", () => {
  it("returns a trimmed copy and leaves the original alone", () => {
    const values = { city: "  Stuttgart ", postalCode: "70173 " };

    expect(trimValues(values)).toEqual({
      city: "Stuttgart",
      postalCode: "70173",
    });
    expect(values.city).toBe("  Stuttgart ");
  });
});
