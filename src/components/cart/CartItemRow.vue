<script setup lang="ts">
import { ref, useTemplateRef } from "vue";

import BaseIconButton from "@/components/base/BaseIconButton.vue";
import BaseQuantityStepper from "@/components/base/BaseQuantityStepper.vue";
import { cartGrid } from "@/components/cart/cartGrid";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/config";
import { formatMoney } from "@/lib/money";
import { lineTotal } from "@/lib/pricing";
import type { CartItem } from "@/types/cart";

const { item } = defineProps<{ item: CartItem }>();

const emit = defineEmits<{
  updateQuantity: [quantity: number];
  remove: [];
}>();

const imageFailed = ref(false);

const removeButtonRef =
  useTemplateRef<InstanceType<typeof BaseIconButton>>("removeButton");

defineExpose({
  focusRemoveButton: () => removeButtonRef.value?.focus(),
});
</script>

<template>
  <li
    class="flex flex-col gap-4 border-b border-line py-5 md:items-center"
    :class="cartGrid"
  >
    <div class="flex items-start gap-4">
      <div class="relative shrink-0">
        <img
          v-if="item.image && !imageFailed"
          :src="item.image"
          alt=""
          class="size-20 rounded-xs object-contain"
          @error="imageFailed = true"
        />
        <div
          v-else
          aria-hidden="true"
          class="size-20 rounded-xs bg-placeholder"
        />
        <span class="absolute -top-2 -right-2">
          <BaseIconButton
            ref="removeButton"
            icon="close"
            variant="badge"
            :label="`Remove ${item.title}`"
            @click="emit('remove')"
          />
        </span>
      </div>
      <div class="min-w-0 pt-1">
        <p class="line-clamp-2 text-sm text-neutral-900">{{ item.title }}</p>
      </div>
    </div>

    <div class="flex items-end justify-between gap-3 md:contents">
      <div class="text-sm text-navy tabular-nums">
        <span class="block text-xs text-muted md:sr-only">Price</span>
        {{ formatMoney(item.unitPriceCents) }}
      </div>
      <div>
        <span class="block text-center text-xs text-muted md:sr-only"
          >Quantity</span
        >
        <BaseQuantityStepper
          :model-value="item.quantity"
          :label="item.title"
          :min="MIN_QUANTITY"
          :max="MAX_QUANTITY"
          @update:model-value="emit('updateQuantity', $event)"
        />
      </div>
      <div class="text-right text-sm text-navy tabular-nums">
        <span class="block text-xs text-muted md:sr-only">Total</span>
        {{ formatMoney(lineTotal(item)) }}
      </div>
    </div>
  </li>
</template>
