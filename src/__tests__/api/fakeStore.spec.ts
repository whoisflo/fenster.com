import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, createProduct, fetchProducts } from "@/api/fakeStore";
import { sampleApiProducts } from "@/__tests__/fixtures/apiProducts";
import { jsonResponse, mockFakeStoreApi } from "@/__tests__/mockFakeStoreApi";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(response: Response | Error) {
  const fetchMock =
    response instanceof Error
      ? vi.fn().mockRejectedValue(response)
      : vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
}

describe("fetchProducts", () => {
  it("gets the requested number of products", async () => {
    const fetchMock = mockFakeStoreApi();

    const products = await fetchProducts(5);

    expect(products).toEqual(sampleApiProducts());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products?limit=5",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("fails with the HTTP status when the API answers with an error", async () => {
    stubFetch(jsonResponse({ message: "Server error" }, 500));

    const error = await fetchProducts(5).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500 });
  });

  it("fails when the request does not go through", async () => {
    stubFetch(new TypeError("Failed to fetch"));

    await expect(fetchProducts(5)).rejects.toBeInstanceOf(ApiError);
  });

  it("fails when the response is not JSON", async () => {
    stubFetch(new Response("<html>Maintenance</html>", { status: 200 }));

    await expect(fetchProducts(5)).rejects.toBeInstanceOf(ApiError);
  });

  it("fails when the response does not look like a product list", async () => {
    stubFetch(jsonResponse([{ id: "1", title: "Backpack" }]));

    await expect(fetchProducts(5)).rejects.toBeInstanceOf(ApiError);
  });
});

describe("createProduct", () => {
  it("posts the product as JSON and returns what the API created", async () => {
    const fetchMock = mockFakeStoreApi();

    const created = await createProduct({
      title: "Canvas Tote Bag",
      price: 29,
    });

    expect(created).toEqual({ id: 21, title: "Canvas Tote Bag", price: 29 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://fakestoreapi.com/products",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Canvas Tote Bag", price: 29 }),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("fails with the HTTP status when the API answers with an error", async () => {
    mockFakeStoreApi({ failPost: true });

    const error = await createProduct({
      title: "Canvas Tote Bag",
      price: 29,
    }).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500 });
  });

  it("fails when the response does not look like a created product", async () => {
    stubFetch(jsonResponse({ ok: true }, 201));

    await expect(
      createProduct({ title: "Canvas Tote Bag", price: 29 }),
    ).rejects.toBeInstanceOf(ApiError);
  });
});
