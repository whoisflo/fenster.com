import { TAX_RATE } from "@/config";
import type { CartItem } from "@/types/cart";

type PricedLine = Pick<CartItem, "unitPriceCents" | "quantity">;

export function lineTotal(line: PricedLine): number {
  return line.unitPriceCents * line.quantity;
}

export function subtotal(lines: readonly PricedLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function tax(subtotalCents: number): number {
  return Math.round(subtotalCents * TAX_RATE);
}

export function grandTotal({
  subtotalCents,
  shippingCents,
  taxCents,
}: {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
}): number {
  return subtotalCents + shippingCents + taxCents;
}
