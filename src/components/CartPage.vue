<script setup lang="ts">
import CartActions from "@/components/cart/CartActions.vue";
import CartTable from "@/components/cart/CartTable.vue";
import CartTotals from "@/components/cart/CartTotals.vue";
import ShippingCalculator from "@/components/cart/ShippingCalculator.vue";
import { grandTotal, subtotal, tax } from "@/lib/pricing";
import { pluralize } from "@/lib/text";
import { sampleCartItems } from "@/__tests__/fixtures/cartItems";

const items = sampleCartItems();
const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
const subtotalCents = subtotal(items);
const taxCents = tax(subtotalCents);
const totalCents = grandTotal({ subtotalCents, shippingCents: 0, taxCents });
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
    <h1 class="font-heading text-3xl font-bold text-navy">
      Shopping Cart
      <span class="font-sans text-lg font-normal">
        ({{ pluralize(itemCount, "item") }})
      </span>
    </h1>

    <div
      class="mt-10 grid gap-12 lg:mt-14 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:gap-16"
    >
      <div class="space-y-6">
        <CartTable :items="items" status="success" />
        <CartActions :adding="false" :can-clear="items.length > 0" />
      </div>

      <div class="grid content-start gap-10 sm:grid-cols-2 xl:grid-cols-1">
        <CartTotals
          :subtotal-cents="subtotalCents"
          :shipping-cents="null"
          :tax-cents="taxCents"
          :total-cents="totalCents"
          :checkout-disabled="items.length === 0"
        />
        <ShippingCalculator
          :quote="null"
          :loading="false"
          :disabled="items.length === 0"
        />
      </div>
    </div>
  </main>
</template>
