import {
  SHIPPING_MAX_DOLLARS,
  SHIPPING_MIN_DOLLARS,
  SHIPPING_QUOTE_DELAY_MS,
} from "@/config";
import {
  lengthBetween,
  matches,
  required,
  validateFields,
  type Schema,
} from "@/lib/validation";
import type { ShippingDestination, ShippingQuote } from "@/types/cart";

export const shippingFormSchema: Schema<keyof ShippingDestination> = {
  city: [
    required("Enter a city"),
    lengthBetween(2, 60, "Enter a valid city"),
    matches(/^\p{L}[\p{L} .'-]*$/u, "Enter a valid city"),
  ],
  address: [
    required("Enter an address"),
    lengthBetween(3, 100, "Enter a valid address"),
  ],
  postalCode: [
    required("Enter a postal code"),
    lengthBetween(3, 10, "Enter a valid postal code"),
    matches(
      /^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/,
      "Enter a valid postal code",
    ),
  ],
};

export function validateShippingForm(values: ShippingDestination) {
  return validateFields(values, shippingFormSchema);
}

export function quoteShipping(
  destination: ShippingDestination,
  random: () => number = Math.random,
  delayMs = SHIPPING_QUOTE_DELAY_MS,
): Promise<ShippingQuote> {
  const range = SHIPPING_MAX_DOLLARS - SHIPPING_MIN_DOLLARS + 1;
  const dollars = SHIPPING_MIN_DOLLARS + Math.floor(random() * range);

  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ destination, costCents: dollars * 100 }),
      delayMs,
    );
  });
}
