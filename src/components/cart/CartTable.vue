<script setup lang="ts">
import { computed, nextTick, useTemplateRef } from "vue";

import BaseAlert from "@/components/base/BaseAlert.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import CartItemRow from "@/components/cart/CartItemRow.vue";
import CartItemSkeleton from "@/components/cart/CartItemSkeleton.vue";
import { cartGrid } from "@/components/cart/cartGrid";
import { INITIAL_PRODUCT_COUNT } from "@/config";
import type { CartItem, LoadStatus } from "@/types/cart";

const { items, status } = defineProps<{
  items: CartItem[];
  status: LoadStatus;
}>();

const emit = defineEmits<{
  updateQuantity: [key: string, quantity: number];
  remove: [key: string];
  retry: [];
}>();

const isLoading = computed(() => status === "idle" || status === "loading");
const isEmpty = computed(() => status === "success" && items.length === 0);

const rowRefs = useTemplateRef<InstanceType<typeof CartItemRow>[]>("rows");

async function remove(key: string, index: number) {
  emit("remove", key);
  await nextTick();
  const next = items[Math.min(index, items.length - 1)];
  rowRefs.value
    ?.find((row) => row.$props.item.key === next?.key)
    ?.focusRemoveButton();
}
</script>

<template>
  <div>
    <div
      aria-hidden="true"
      class="hidden pb-2 font-heading text-lg font-bold text-navy"
      :class="cartGrid"
    >
      <span>Product</span>
      <span>Price</span>
      <span>Quantity</span>
      <span class="text-right">Total</span>
    </div>

    <BaseAlert
      v-if="status === 'error'"
      tone="error"
      title="We couldn't load your products."
      class="my-4"
    >
      <template #actions>
        <BaseButton variant="secondary" @click="emit('retry')"
          >Try again</BaseButton
        >
      </template>
    </BaseAlert>

    <ul
      v-if="isLoading || items.length > 0"
      aria-label="Cart items"
      :aria-busy="isLoading ? 'true' : undefined"
    >
      <template v-if="isLoading">
        <CartItemSkeleton
          v-for="n in INITIAL_PRODUCT_COUNT"
          :key="`skeleton-${n}`"
        />
      </template>
      <CartItemRow
        v-for="(item, index) in items"
        ref="rows"
        :key="item.key"
        :item="item"
        @update-quantity="emit('updateQuantity', item.key, $event)"
        @remove="remove(item.key, index)"
      />
    </ul>

    <BaseAlert v-if="isEmpty" title="Your cart is empty." class="my-4">
      Use Add Item to add a product.
    </BaseAlert>
  </div>
</template>
