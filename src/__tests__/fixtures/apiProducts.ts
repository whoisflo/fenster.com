import type { ApiProduct } from "@/api/fakeStore";

const products: ApiProduct[] = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts ",
    price: 22.3,
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
  },
  {
    id: 4,
    title: "Mens Casual Slim Fit",
    price: 15.99,
  },
  {
    id: 5,
    title:
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
  },
];

export function sampleApiProducts(): ApiProduct[] {
  return structuredClone(products);
}
