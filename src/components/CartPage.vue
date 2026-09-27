<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";

import CartActions from "@/components/cart/CartActions.vue";
import CartTable from "@/components/cart/CartTable.vue";
import CartTotals from "@/components/cart/CartTotals.vue";
import ShippingCalculator from "@/components/cart/ShippingCalculator.vue";
import { pluralize } from "@/lib/text";
import { useCartStore } from "@/stores/cart";
import { useToastStore } from "@/stores/toast";

const cart = useCartStore();
const toast = useToastStore();
const {
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
} = storeToRefs(cart);

const isLoading = computed(
  () => loadStatus.value === "idle" || loadStatus.value === "loading",
);

onMounted(() => cart.loadProducts());

async function addItem() {
  try {
    const item = await cart.addItem();
    toast.show(`Added ${item.title}`, "success");
  } catch {
    toast.show("Couldn't add the item. Please try again.", "error");
  }
}

function clearCart() {
  cart.clearCart();
  toast.show("Cart cleared");
}

function checkout() {
  toast.show("Checkout isn't part of this demo.");
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
    <h1 class="font-heading text-3xl font-bold text-navy">
      Shopping Cart
      <span v-if="!isLoading" class="font-sans text-lg font-normal">
        ({{ pluralize(itemCount, "item") }})
      </span>
    </h1>

    <div
      class="mt-10 grid gap-12 lg:mt-14 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:gap-16"
    >
      <div class="space-y-6">
        <CartTable
          :items="items"
          :status="loadStatus"
          @update-quantity="cart.setQuantity"
          @remove="cart.removeItem"
          @retry="cart.loadProducts"
        />
        <CartActions
          :adding="isAdding"
          :can-clear="!isEmpty"
          @add="addItem"
          @clear="clearCart"
        />
      </div>

      <div class="grid content-start gap-10 sm:grid-cols-2 xl:grid-cols-1">
        <CartTotals
          :subtotal-cents="subtotalCents"
          :shipping-cents="shippingCents"
          :tax-cents="taxCents"
          :total-cents="totalCents"
          :checkout-disabled="isEmpty"
          @checkout="checkout"
        />
        <ShippingCalculator
          :quote="shippingQuote"
          :loading="isQuotingShipping"
          :disabled="isEmpty && !isLoading"
          @calculate="cart.calculateShipping"
        />
      </div>
    </div>
  </main>
</template>
