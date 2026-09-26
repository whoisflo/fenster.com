<script setup lang="ts">
import { computed } from "vue";

import BaseButton from "@/components/base/BaseButton.vue";
import BasePanel from "@/components/base/BasePanel.vue";
import { TAX_RATE } from "@/config";
import { formatMoney } from "@/lib/money";

const { subtotalCents, shippingCents, taxCents, totalCents } = defineProps<{
  subtotalCents: number;
  shippingCents: number | null;
  taxCents: number;
  totalCents: number;
  checkoutDisabled: boolean;
}>();

const emit = defineEmits<{
  checkout: [];
}>();

const rows = computed(() => [
  { label: "Subtotal", value: formatMoney(subtotalCents) },
  {
    label: "Shipping",
    value: shippingCents === null ? "—" : formatMoney(shippingCents),
  },
  {
    label: `Tax (${Math.round(TAX_RATE * 100)}%)`,
    value: formatMoney(taxCents),
  },
  { label: "Total", value: formatMoney(totalCents), isTotal: true },
]);
</script>

<template>
  <BasePanel title="Cart Totals">
    <dl class="text-navy">
      <div
        v-for="row in rows"
        :key="row.label"
        class="flex justify-between gap-4 border-b border-panel-line pb-3"
        :class="row.isTotal ? 'mt-8 font-bold' : 'mt-4 first:mt-0'"
      >
        <dt>{{ row.label }}</dt>
        <dd
          class="tabular-nums"
          :aria-live="row.isTotal ? 'polite' : undefined"
        >
          {{ row.value }}
        </dd>
      </div>
    </dl>
    <BaseButton
      block
      class="mt-8"
      :disabled="checkoutDisabled"
      @click="emit('checkout')"
    >
      Proceed To Checkout
    </BaseButton>
  </BasePanel>
</template>
