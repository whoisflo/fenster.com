import { afterEach, expect, it, vi } from "vitest";

import { ApiError, createProduct, fetchProducts } from "@/api/fakeStore";
import { sampleApiProducts } from "@/__tests__/fixtures/apiProducts";
import { jsonResponse, mockFakeStoreApi } from "@/__tests__/mockFakeStoreApi";

afterEach(() => {
  vi.unstubAllGlobals();
});

const getProducts = () => fetchProducts(5);
const postProduct = () =>
  createProduct({ title: "Canvas Tote Bag", price: 29 });

it("gets the requested number of products, with a timeout", async () => {
  const fetchMock = mockFakeStoreApi();

  await expect(getProducts()).resolves.toEqual(sampleApiProducts());
  expect(fetchMock).toHaveBeenCalledWith(
    "https://fakestoreapi.com/products?limit=5",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});

it("posts a new product as JSON", async () => {
  const fetchMock = mockFakeStoreApi();

  await expect(postProduct()).resolves.toEqual({
    id: 21,
    title: "Canvas Tote Bag",
    price: 29,
  });
  expect(fetchMock).toHaveBeenCalledWith(
    "https://fakestoreapi.com/products",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Canvas Tote Bag", price: 29 }),
    }),
  );
});

it.each([
  ["an error status", getProducts, () => jsonResponse({}, 500)],
  [
    "a network failure",
    getProducts,
    () => Promise.reject(new TypeError("Failed to fetch")),
  ],
  ["a body that is not JSON", getProducts, () => new Response("<html>")],
  ["an unexpected product list", getProducts, () => jsonResponse([{ id: 1 }])],
  ["an unexpected new product", postProduct, () => jsonResponse({}, 201)],
])("turns %s into an ApiError", async (_, send, respond) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => respond()),
  );

  await expect(send()).rejects.toBeInstanceOf(ApiError);
});
