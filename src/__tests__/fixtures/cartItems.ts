import type { CartItem } from "@/types/cart";

const loadedItems: CartItem[] = [
  {
    key: "product-1",
    productId: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    unitPriceCents: 10995,
    category: "men's clothing",
    rating: { rate: 3.9, count: 120 },
    quantity: 1,
  },
  {
    key: "product-2",
    productId: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    unitPriceCents: 2230,
    category: "men's clothing",
    rating: { rate: 4.1, count: 259 },
    quantity: 1,
  },
  {
    key: "product-3",
    productId: 3,
    title: "Mens Cotton Jacket",
    unitPriceCents: 5599,
    category: "men's clothing",
    rating: { rate: 4.7, count: 500 },
    quantity: 1,
  },
  {
    key: "product-4",
    productId: 4,
    title: "Mens Casual Slim Fit",
    unitPriceCents: 1599,
    category: "men's clothing",
    rating: { rate: 2.1, count: 430 },
    quantity: 1,
  },
  {
    key: "product-5",
    productId: 5,
    title:
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    unitPriceCents: 69500,
    category: "jewelery",
    rating: { rate: 4.6, count: 400 },
    quantity: 1,
  },
];

const addedItem: CartItem = {
  key: "new-1",
  productId: 21,
  title: "Canvas Tote Bag",
  unitPriceCents: 2900,
  category: null,
  rating: null,
  quantity: 1,
};
export function sampleCartItems(): CartItem[] {
  return structuredClone(loadedItems);
}

export function sampleAddedItem(): CartItem {
  return structuredClone(addedItem);
}

export function cartItem(overrides: Partial<CartItem> = {}): CartItem {
  return { ...structuredClone(loadedItems[2]!), ...overrides };
}
