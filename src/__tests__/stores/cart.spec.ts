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

describe("useCartStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("loadProducts", () => {
    it("loads five products as cart lines with quantity 1", async () => {
      const fetchMock = mockFakeStoreApi();
      const cart = useCartStore();

      await cart.loadProducts();

      expect(fetchMock).toHaveBeenCalledWith(
        "https://fakestoreapi.com/products?limit=5",
        expect.anything(),
      );
      expect(cart.loadStatus).toBe("success");
      expect(cart.items).toEqual(sampleCartItems());
    });

    it("is loading while the request runs", async () => {
      mockFakeStoreApi();
      const cart = useCartStore();

      const loading = cart.loadProducts();
      expect(cart.loadStatus).toBe("loading");

      await loading;
      expect(cart.loadStatus).toBe("success");
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
    it("adds the product the API created as a new line", async () => {
      mockFakeStoreApi();
      const cart = useCartStore();

      const item = await cart.addItem();

      expect(item).toEqual({
        key: "new-1",
        productId: 21,
        title: "Canvas Tote Bag",
        unitPriceCents: 2900,
        category: null,
        rating: null,
        quantity: 1,
      });
      expect(cart.items).toEqual([item]);
    });

    it("gives every added line its own key, although the API always answers with id 21", async () => {
      mockFakeStoreApi();
      const cart = useCartStore();

      await cart.addItem();
      await cart.addItem();

      expect(cart.items.map((item) => [item.key, item.productId])).toEqual([
        ["new-1", 21],
        ["new-2", 21],
      ]);
    });

    it("cycles through the built-in products", async () => {
      mockFakeStoreApi();
      const cart = useCartStore();

      for (let i = 0; i < 6; i++) await cart.addItem();

      expect(cart.items.map((item) => item.title)).toEqual([
        "Canvas Tote Bag",
        "Leather Card Holder",
        "Wool Beanie",
        "Ceramic Coffee Mug",
        "Linen Throw Pillow",
        "Canvas Tote Bag",
      ]);
    });

    it("is busy while the request runs", async () => {
      mockFakeStoreApi();
      const cart = useCartStore();

      const adding = cart.addItem();
      expect(cart.isAdding).toBe(true);

      await adding;
      expect(cart.isAdding).toBe(false);
    });

    it("leaves the cart unchanged and passes the error on when the request fails", async () => {
      mockFakeStoreApi({ failPost: true });
      const cart = useCartStore();

      await expect(cart.addItem()).rejects.toBeInstanceOf(ApiError);

      expect(cart.items).toEqual([]);
      expect(cart.isAdding).toBe(false);
    });

    it("tries the same product again after a failed request", async () => {
      mockFakeStoreApi({ failPost: true });
      const cart = useCartStore();
      await cart.addItem().catch(() => undefined);

      mockFakeStoreApi();
      const item = await cart.addItem();

      expect(item.title).toBe("Canvas Tote Bag");
      expect(item.key).toBe("new-1");
    });
  });

  describe("editing lines", () => {
    it("removes a line", () => {
      const cart = useCartStore();
      cart.items = sampleCartItems();

      cart.removeItem("product-3");

      expect(cart.items.map((item) => item.key)).not.toContain("product-3");
      expect(cart.items).toHaveLength(4);
    });

    it("sets a quantity", () => {
      const cart = useCartStore();
      cart.items = sampleCartItems();

      cart.setQuantity("product-3", 4);

      expect(cart.items[2]?.quantity).toBe(4);
    });

    it("keeps quantities whole and between 1 and 99", () => {
      const cart = useCartStore();
      cart.items = sampleCartItems();

      cart.setQuantity("product-1", 0);
      cart.setQuantity("product-2", 150);
      cart.setQuantity("product-3", 2.7);

      expect(cart.items.slice(0, 3).map((item) => item.quantity)).toEqual([
        1, 99, 2,
      ]);
    });

    it("ignores quantities that are not numbers", () => {
      const cart = useCartStore();
      cart.items = sampleCartItems();

      cart.setQuantity("product-1", Number.NaN);
      cart.setQuantity("product-1", Number.POSITIVE_INFINITY);

      expect(cart.items[0]?.quantity).toBe(1);
    });

    it("clears every line and the shipping quote", async () => {
      vi.useFakeTimers();
      const cart = useCartStore();
      cart.items = sampleCartItems();
      const quoting = cart.calculateShipping(destination);
      await vi.advanceTimersByTimeAsync(600);
      await quoting;

      cart.clearCart();

      expect(cart.items).toEqual([]);
      expect(cart.shippingQuote).toBeNull();
    });
  });

  describe("calculateShipping", () => {
    it("stores and returns the quote, and is busy meanwhile", async () => {
      vi.useFakeTimers();
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const cart = useCartStore();
      cart.items = sampleCartItems();

      const quoting = cart.calculateShipping(destination);
      expect(cart.isQuotingShipping).toBe(true);
      await vi.advanceTimersByTimeAsync(600);
      const quote = await quoting;

      expect(quote).toEqual({ destination, costCents: 1500 });
      expect(cart.shippingQuote).toEqual(quote);
      expect(cart.isQuotingShipping).toBe(false);
    });
  });

  describe("totals", () => {
    it("adds up the cart", () => {
      const cart = useCartStore();
      cart.items = sampleCartItems();

      expect(cart.subtotalCents).toBe(89923);
      expect(cart.taxCents).toBe(17985);
      expect(cart.shippingCents).toBeNull();
      expect(cart.totalCents).toBe(107908);
    });

    it("counts items by quantity, not by line", () => {
      const cart = useCartStore();
      cart.items = sampleCartItems();

      cart.setQuantity("product-1", 3);

      expect(cart.itemCount).toBe(7);
      expect(cart.isEmpty).toBe(false);
    });

    it("adds shipping to the total once it is calculated", async () => {
      vi.useFakeTimers();
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      const cart = useCartStore();
      cart.items = sampleCartItems();

      const quoting = cart.calculateShipping(destination);
      await vi.advanceTimersByTimeAsync(600);
      await quoting;

      expect(cart.shippingCents).toBe(1500);
      expect(cart.totalCents).toBe(107908 + 1500);
    });

    it("charges no shipping once the last line is removed", async () => {
      vi.useFakeTimers();
      const cart = useCartStore();
      cart.items = [sampleCartItems()[0]!];
      const quoting = cart.calculateShipping(destination);
      await vi.advanceTimersByTimeAsync(600);
      await quoting;

      cart.removeItem("product-1");

      expect(cart.isEmpty).toBe(true);
      expect(cart.shippingCents).toBeNull();
      expect(cart.totalCents).toBe(0);
    });
  });
});
