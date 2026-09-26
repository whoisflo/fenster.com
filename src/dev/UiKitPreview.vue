<script setup lang="ts">
import { computed, ref } from "vue";

import BaseAlert from "@/components/base/BaseAlert.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseIcon from "@/components/base/BaseIcon.vue";
import BaseIconButton from "@/components/base/BaseIconButton.vue";
import BaseQuantityStepper from "@/components/base/BaseQuantityStepper.vue";
import type { IconName } from "@/components/base/icons";
import CartActions from "@/components/cart/CartActions.vue";
import CartTable from "@/components/cart/CartTable.vue";
import CartTotals from "@/components/cart/CartTotals.vue";
import ShippingCalculator from "@/components/cart/ShippingCalculator.vue";
import { grandTotal, subtotal, tax } from "@/lib/pricing";
import type {
  CartItem,
  LoadStatus,
  ShippingDestination,
  ShippingQuote,
} from "@/types/cart";
import {
  sampleAddedItem,
  sampleCartItems,
} from "@/__tests__/fixtures/cartItems";

const iconNames: IconName[] = ["plus", "minus", "close", "spinner"];

const quantity = ref(3);

// Cart components, driven by local state until the store exists (build step 6).
type PreviewState = "Loaded" | "Loading" | "Load error" | "Empty";
const previewStates: Record<
  PreviewState,
  { status: LoadStatus; items: () => CartItem[] }
> = {
  Loaded: { status: "success", items: sampleCartItems },
  Loading: { status: "loading", items: () => [] },
  "Load error": { status: "error", items: () => [] },
  Empty: { status: "success", items: () => [] },
};
const stateNames = Object.keys(previewStates) as PreviewState[];

const cartStatus = ref<LoadStatus>("success");
const cartItems = ref<CartItem[]>(sampleCartItems());
const adding = ref(false);
let addedCount = 0;

function showState(name: PreviewState) {
  cartStatus.value = previewStates[name].status;
  cartItems.value = previewStates[name].items();
}

// ?state=Loading (or Loaded, Load error, Empty) opens the preview in that state.
const requestedState = new URLSearchParams(window.location.search).get("state");
if (requestedState && requestedState in previewStates)
  showState(requestedState as PreviewState);

function updateQuantity(key: string, newQuantity: number) {
  const item = cartItems.value.find((line) => line.key === key);
  if (item) item.quantity = newQuantity;
}

function removeItem(key: string) {
  cartItems.value = cartItems.value.filter((line) => line.key !== key);
}

function addItem() {
  adding.value = true;
  setTimeout(() => {
    addedCount += 1;
    cartItems.value.push({ ...sampleAddedItem(), key: `new-${addedCount}` });
    adding.value = false;
  }, 800);
}

const shippingQuote = ref<ShippingQuote | null>(null);
const quoting = ref(false);
const checkoutClicked = ref(false);

const subtotalCents = computed(() => subtotal(cartItems.value));
const shippingCents = computed(() =>
  cartItems.value.length > 0 && shippingQuote.value
    ? shippingQuote.value.costCents
    : null,
);
const taxCents = computed(() => tax(subtotalCents.value));
const totalCents = computed(() =>
  grandTotal({
    subtotalCents: subtotalCents.value,
    shippingCents: shippingCents.value ?? 0,
    taxCents: taxCents.value,
  }),
);

function calculateShipping(destination: ShippingDestination) {
  quoting.value = true;
  setTimeout(() => {
    const costCents = (5 + Math.floor(Math.random() * 21)) * 100;
    shippingQuote.value = { destination, costCents };
    quoting.value = false;
  }, 600);
}
</script>

<template>
  <div class="space-y-12">
    <p class="rounded-sm bg-panel p-4 text-sm text-navy">
      Temporary preview of the base UI kit, for reviewing build steps 1–4. The
      real
      <code>CartPage</code> replaces it in step 5.
    </p>

    <section class="space-y-6">
      <h2 class="font-heading text-xl font-bold text-navy">Cart components</h2>
      <div class="flex flex-wrap gap-2">
        <BaseButton
          v-for="name in stateNames"
          :key="name"
          variant="secondary"
          @click="showState(name)"
        >
          {{ name }}
        </BaseButton>
      </div>
      <p v-if="checkoutClicked" class="text-sm text-navy">
        Proceed To Checkout was clicked. The real page shows a notification
        (step 7).
      </p>
      <div class="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div class="space-y-6">
          <CartTable
            :items="cartItems"
            :status="cartStatus"
            @update-quantity="updateQuantity"
            @remove="removeItem"
            @retry="showState('Loaded')"
          />
          <CartActions
            :adding="adding"
            :can-clear="cartItems.length > 0"
            @add="addItem"
            @clear="cartItems = []"
          />
        </div>
        <div class="grid content-start gap-10 sm:grid-cols-2 lg:grid-cols-1">
          <CartTotals
            :subtotal-cents="subtotalCents"
            :shipping-cents="shippingCents"
            :tax-cents="taxCents"
            :total-cents="totalCents"
            :checkout-disabled="cartItems.length === 0"
            @checkout="checkoutClicked = true"
          />
          <ShippingCalculator
            :quote="shippingQuote"
            :loading="quoting"
            :disabled="cartItems.length === 0"
            @calculate="calculateShipping"
          />
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-heading text-xl font-bold text-navy">BaseButton</h2>
      <div class="flex flex-wrap items-center gap-4">
        <BaseButton>Add Item</BaseButton>
        <BaseButton variant="accent">Clear Cart</BaseButton>
        <BaseButton variant="secondary">Try again</BaseButton>
        <BaseButton loading loading-text="Adding…">Add Item</BaseButton>
        <BaseButton variant="accent" disabled>Clear Cart</BaseButton>
      </div>
      <div class="max-w-xs">
        <BaseButton block>Proceed To Checkout</BaseButton>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-heading text-xl font-bold text-navy">BaseIconButton</h2>
      <div class="flex flex-wrap items-center gap-10">
        <div class="flex items-center gap-1">
          <BaseIconButton
            icon="minus"
            label="Decrease quantity"
            variant="control"
            disabled
          />
          <BaseIconButton
            icon="plus"
            label="Increase quantity"
            variant="control"
          />
        </div>
        <div class="relative size-20 rounded-xs bg-placeholder">
          <span class="absolute -top-2 -right-2">
            <BaseIconButton
              icon="close"
              label="Remove product"
              variant="badge"
            />
          </span>
        </div>
        <BaseIconButton icon="close" label="Dismiss notification" />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-heading text-xl font-bold text-navy">BaseIcon</h2>
      <ul class="flex flex-wrap gap-6 text-navy">
        <li
          v-for="name in iconNames"
          :key="name"
          class="flex items-center gap-2 text-sm"
        >
          <BaseIcon :name="name" class="size-5" />
          {{ name }}
        </li>
      </ul>
    </section>

    <section class="space-y-4">
      <h2 class="font-heading text-xl font-bold text-navy">
        BaseQuantityStepper
      </h2>
      <div class="flex items-center gap-6">
        <BaseQuantityStepper v-model="quantity" label="Wool Beanie" />
        <p class="text-sm text-navy">
          Committed quantity: <strong>{{ quantity }}</strong> (try typing 0, 150
          or abc)
        </p>
      </div>
    </section>

    <section class="space-y-6">
      <h2 class="font-heading text-xl font-bold text-navy">BaseAlert</h2>
      <BaseAlert title="Your cart is empty."
        >Use Add Item to add a product.</BaseAlert
      >
      <BaseAlert tone="error" title="We couldn't load your products.">
        <template #actions>
          <BaseButton variant="secondary">Try again</BaseButton>
        </template>
      </BaseAlert>
    </section>
  </div>
</template>
