import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { ApiError } from "@/api/fakeStore";
import { useCartStore } from "@/stores/cart";
import { sampleCartItems } from "@/__tests__/fixtures/cartItems";
import { mockFakeStoreApi } from "@/__tests__/mockFakeStoreApi";

const destination = {
  city: "Stuttgart",
  address: "Königstraße 1",
  postalCode: "70173",
};

beforeEach(() => {
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function cartWithItems(items = sampleCartItems()) {
  const cart = useCartStore();
  cart.items = items;
  return cart;
}

async function quote(cart: ReturnType<typeof useCartStore>) {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  const quoting = cart.calculateShipping(destination);
  await vi.advanceTimersByTimeAsync(600);
  return quoting;
}

describe("loadProducts", () => {
  it("loads five products as lines with quantity 1", async () => {
    mockFakeStoreApi();
    const cart = useCartStore();

    const loading = cart.loadProducts();
    expect(cart.loadStatus).toBe("loading");
    await loading;

    expect(cart.loadStatus).toBe("success");
    expect(cart.items).toEqual(sampleCartItems());
  });

  it("reports a failed load and leaves the cart as it was", async () => {
    mockFakeStoreApi({ failGet: true });
    const cart = useCartStore();

    await cart.loadProducts();

    expect(cart.loadStatus).toBe("error");
    expect(cart.items).toEqual([]);
  });

  it("ignores a second load while one is running", async () => {
    const fetchMock = mockFakeStoreApi();
    const cart = useCartStore();

    await Promise.all([cart.loadProducts(), cart.loadProducts()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps lines added after a failed load when the retry succeeds", async () => {
    mockFakeStoreApi({ failGet: true });
    const cart = useCartStore();
    await cart.loadProducts();
    await cart.addItem();

    mockFakeStoreApi();
    await cart.loadProducts();

    expect(cart.items.map((item) => item.key)).toEqual([
      "product-1",
      "product-2",
      "product-3",
      "product-4",
      "product-5",
      "new-1",
    ]);
  });
});

describe("addItem", () => {
  it("adds the next built-in product through the API, each line with its own key", async () => {
    mockFakeStoreApi();
    const cart = useCartStore();

    const adding = cart.addItem();
    expect(cart.isAdding).toBe(true);
    const first = await adding;
    for (let i = 0; i < 5; i++) await cart.addItem();

    expect(first).toEqual({
      key: "new-1",
      productId: 21,
      title: "Canvas Tote Bag",
      unitPriceCents: 2900,
      category: null,
      rating: null,
      quantity: 1,
    });
    expect(cart.isAdding).toBe(false);
    expect(cart.items.map((item) => `${item.key} ${item.title}`)).toEqual([
      "new-1 Canvas Tote Bag",
      "new-2 Leather Card Holder",
      "new-3 Wool Beanie",
      "new-4 Ceramic Coffee Mug",
      "new-5 Linen Throw Pillow",
      "new-6 Canvas Tote Bag",
    ]);
  });

  it("leaves the cart unchanged on failure and tries the same product next time", async () => {
    mockFakeStoreApi({ failPost: true });
    const cart = useCartStore();

    await expect(cart.addItem()).rejects.toBeInstanceOf(ApiError);
    expect(cart.items).toEqual([]);
    expect(cart.isAdding).toBe(false);

    mockFakeStoreApi();
    await expect(cart.addItem()).resolves.toMatchObject({
      key: "new-1",
      title: "Canvas Tote Bag",
    });
  });
});

describe("editing", () => {
  it("removes a line", () => {
    const cart = cartWithItems();

    cart.removeItem("product-3");

    expect(cart.items.map((item) => item.key)).toEqual([
      "product-1",
      "product-2",
      "product-4",
      "product-5",
    ]);
  });

  it("keeps quantities whole and between 1 and 99, ignoring non-numbers", () => {
    const cart = cartWithItems();

    cart.setQuantity("product-1", 4);
    cart.setQuantity("product-2", 150);
    cart.setQuantity("product-3", 2.7);
    cart.setQuantity("product-4", 0);
    cart.setQuantity("product-5", Number.NaN);

    expect(cart.items.map((item) => item.quantity)).toEqual([4, 99, 2, 1, 1]);
  });

  it("clears every line and the shipping quote", async () => {
    const cart = cartWithItems();
    await quote(cart);

    cart.clearCart();

    expect(cart.items).toEqual([]);
    expect(cart.shippingQuote).toBeNull();
  });
});

describe("totals", () => {
  it("adds up the cart and counts items by quantity", () => {
    const cart = cartWithItems();

    expect(cart.subtotalCents).toBe(89923);
    expect(cart.taxCents).toBe(17985);
    expect(cart.shippingCents).toBeNull();
    expect(cart.totalCents).toBe(107908);

    cart.setQuantity("product-1", 3);

    expect(cart.itemCount).toBe(7);
  });

  it("adds the shipping quote to the total, and is busy while quoting", async () => {
    const cart = cartWithItems();
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const quoting = cart.calculateShipping(destination);
    expect(cart.isQuotingShipping).toBe(true);
    await vi.advanceTimersByTimeAsync(600);

    await expect(quoting).resolves.toEqual({ destination, costCents: 1500 });
    expect(cart.isQuotingShipping).toBe(false);
    expect(cart.totalCents).toBe(107908 + 1500);
  });

  it("charges no shipping once the last line is removed", async () => {
    const cart = cartWithItems([sampleCartItems()[0]!]);
    await quote(cart);

    cart.removeItem("product-1");

    expect(cart.shippingCents).toBeNull();
    expect(cart.totalCents).toBe(0);
  });
});
