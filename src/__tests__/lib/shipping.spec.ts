import { afterEach, expect, it, vi } from "vitest";

import { quoteShipping, validateShippingForm } from "@/lib/shipping";

const valid = {
  city: "Stuttgart",
  address: "Königstraße 1",
  postalCode: "70173",
};

afterEach(() => {
  vi.useRealTimers();
});

it.each([
  ["city", "München"],
  ["city", "St. Gallen"],
  ["city", "Val-d'Or"],
  ["postalCode", "SW1A 1AA"],
  ["postalCode", "1234-567"],
])('accepts %s "%s"', (field, value) => {
  expect(validateShippingForm({ ...valid, [field]: value })).toEqual({});
});

it.each([
  ["city", "", "Enter a city"],
  ["city", "S", "Enter a valid city"],
  ["city", "Stuttgart 1", "Enter a valid city"],
  ["address", "", "Enter an address"],
  ["address", "ab", "Enter a valid address"],
  ["postalCode", "", "Enter a postal code"],
  ["postalCode", "12", "Enter a valid postal code"],
  ["postalCode", "12345678901", "Enter a valid postal code"],
  ["postalCode", "12#45", "Enter a valid postal code"],
  ["postalCode", "12345-", "Enter a valid postal code"],
])('rejects %s "%s" with "%s"', (field, value, message) => {
  expect(validateShippingForm({ ...valid, [field]: value })).toEqual({
    [field]: message,
  });
});

it("quotes a whole-dollar amount from $5 to $25, after 600 ms", async () => {
  vi.useFakeTimers();
  const low = quoteShipping(valid, () => 0);
  const high = quoteShipping(valid, () => 0.9999);
  let answered = false;
  void low.then(() => {
    answered = true;
  });

  await vi.advanceTimersByTimeAsync(599);
  expect(answered).toBe(false);
  await vi.advanceTimersByTimeAsync(1);

  await expect(low).resolves.toEqual({ destination: valid, costCents: 500 });
  await expect(high).resolves.toEqual({ destination: valid, costCents: 2500 });
});
