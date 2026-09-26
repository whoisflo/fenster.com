import { afterEach, describe, expect, it, vi } from "vitest";

import { quoteShipping, validateShippingForm } from "@/lib/shipping";

const valid = {
  city: "Stuttgart",
  address: "Königstraße 1",
  postalCode: "70173",
};

describe("quoteShipping", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("quotes $5 at the low end of the range", async () => {
    vi.useFakeTimers();
    const quote = quoteShipping(valid, () => 0);

    await vi.advanceTimersByTimeAsync(600);

    await expect(quote).resolves.toEqual({
      destination: valid,
      costCents: 500,
    });
  });

  it("quotes $25 at the high end of the range", async () => {
    vi.useFakeTimers();
    const quote = quoteShipping(valid, () => 0.9999);

    await vi.advanceTimersByTimeAsync(600);

    await expect(quote).resolves.toEqual({
      destination: valid,
      costCents: 2500,
    });
  });

  it("answers only after the delay, like a real request", async () => {
    vi.useFakeTimers();
    let answered = false;
    void quoteShipping(valid, () => 0.5).then(() => {
      answered = true;
    });

    await vi.advanceTimersByTimeAsync(599);
    expect(answered).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(answered).toBe(true);
  });
});

describe("validateShippingForm", () => {
  it("accepts a complete destination", () => {
    expect(validateShippingForm(valid)).toEqual({});
  });

  it("asks for every missing field", () => {
    expect(
      validateShippingForm({ city: "", address: "", postalCode: "" }),
    ).toEqual({
      city: "Enter a city",
      address: "Enter an address",
      postalCode: "Enter a postal code",
    });
  });

  it.each(["München", "St. Gallen", "Val-d'Or", "São Paulo"])(
    "accepts the city %s",
    (city) => {
      expect(validateShippingForm({ ...valid, city })).toEqual({});
    },
  );

  it.each(["S", "Stuttgart 1", "-Berlin", "x".repeat(61)])(
    'rejects the city "%s"',
    (city) => {
      expect(validateShippingForm({ ...valid, city })).toEqual({
        city: "Enter a valid city",
      });
    },
  );

  it("rejects addresses that are too short or too long", () => {
    expect(validateShippingForm({ ...valid, address: "ab" })).toEqual({
      address: "Enter a valid address",
    });
    expect(
      validateShippingForm({ ...valid, address: "a".repeat(101) }),
    ).toEqual({ address: "Enter a valid address" });
  });

  it.each(["70173", "SW1A 1AA", "1234-567", "K1A 0B1"])(
    "accepts the postal code %s",
    (postalCode) => {
      expect(validateShippingForm({ ...valid, postalCode })).toEqual({});
    },
  );

  it.each(["12", "12345-", "-12345", "12#45", "12345678901"])(
    'rejects the postal code "%s"',
    (postalCode) => {
      expect(validateShippingForm({ ...valid, postalCode })).toEqual({
        postalCode: "Enter a valid postal code",
      });
    },
  );
});
