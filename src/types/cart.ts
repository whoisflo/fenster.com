export type LoadStatus = "idle" | "loading" | "success" | "error";

export interface CartItem {
  key: string;
  productId: number;
  title: string;
  unitPriceCents: number;
  quantity: number;
}

export interface ShippingDestination {
  city: string;
  address: string;
  postalCode: string;
}

export interface ShippingQuote {
  destination: ShippingDestination;
  costCents: number;
}
