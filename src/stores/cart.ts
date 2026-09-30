import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { createProduct, fetchProducts, type ApiProduct } from "@/api/fakeStore";
import { INITIAL_PRODUCT_COUNT, MAX_QUANTITY, MIN_QUANTITY } from "@/config";
import { newProducts } from "@/data/newProducts";
import { toCents } from "@/lib/money";
import { clampInteger } from "@/lib/number";
import { subtotal, tax } from "@/lib/pricing";
import { quoteShipping } from "@/lib/shipping";
import type {
  CartItem,
  LoadStatus,
  ShippingDestination,
  ShippingQuote,
} from "@/types/cart";

function toCartItem(product: ApiProduct, key: string): CartItem {
  return {
    key,
    productId: product.id,
    title: product.title.trim(),
    unitPriceCents: toCents(product.price),
    quantity: 1,
  };
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const loadStatus = ref<LoadStatus>("idle");
  const isAdding = ref(false);
  const shippingQuote = ref<ShippingQuote | null>(null);
  const isQuotingShipping = ref(false);
  let addedCount = 0;

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );
  const isEmpty = computed(() => items.value.length === 0);
  const subtotalCents = computed(() => subtotal(items.value));
  const shippingCents = computed(() =>
    isEmpty.value || !shippingQuote.value
      ? null
      : shippingQuote.value.costCents,
  );
  const taxCents = computed(() => tax(subtotalCents.value));
  const totalCents = computed(
    () => subtotalCents.value + (shippingCents.value ?? 0) + taxCents.value,
  );

  async function loadProducts() {
    if (loadStatus.value === "loading") return;
    loadStatus.value = "loading";

    try {
      const products = await fetchProducts(INITIAL_PRODUCT_COUNT);
      const loaded = products.map((product) =>
        toCartItem(product, `product-${product.id}`),
      );
      items.value = [...loaded, ...items.value];
      loadStatus.value = "success";
    } catch {
      loadStatus.value = "error";
    }
  }

  async function addItem(): Promise<CartItem> {
    const product = newProducts[addedCount % newProducts.length]!;
    isAdding.value = true;

    try {
      const created = await createProduct(product);
      addedCount += 1;
      const item = toCartItem(created, `new-${addedCount}`);
      items.value.push(item);
      return item;
    } finally {
      isAdding.value = false;
    }
  }

  function removeItem(key: string) {
    items.value = items.value.filter((item) => item.key !== key);
  }

  function setQuantity(key: string, quantity: number) {
    if (!Number.isFinite(quantity)) return;
    const item = items.value.find((line) => line.key === key);
    if (item)
      item.quantity = clampInteger(quantity, MIN_QUANTITY, MAX_QUANTITY);
  }

  function clearCart() {
    items.value = [];
    shippingQuote.value = null;
  }

  async function calculateShipping(
    destination: ShippingDestination,
  ): Promise<ShippingQuote> {
    isQuotingShipping.value = true;

    try {
      const quote = await quoteShipping(destination);
      shippingQuote.value = quote;
      return quote;
    } finally {
      isQuotingShipping.value = false;
    }
  }

  return {
    items,
    loadStatus,
    isAdding,
    shippingQuote,
    isQuotingShipping,
    itemCount,
    isEmpty,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    loadProducts,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    calculateShipping,
  };
});
