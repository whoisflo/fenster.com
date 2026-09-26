<script setup lang="ts">
import { reactive, useTemplateRef } from "vue";

import BaseAlert from "@/components/base/BaseAlert.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BasePanel from "@/components/base/BasePanel.vue";
import BaseTextField from "@/components/base/BaseTextField.vue";
import { useFormValidation } from "@/composables/useFormValidation";
import { formatMoney } from "@/lib/money";
import { validateShippingForm } from "@/lib/shipping";
import { trimValues } from "@/lib/validation";
import type { ShippingDestination, ShippingQuote } from "@/types/cart";

defineProps<{
  quote: ShippingQuote | null;
  loading: boolean;
  disabled: boolean;
}>();

const emit = defineEmits<{
  calculate: [destination: ShippingDestination];
}>();

const form = reactive<ShippingDestination>({
  city: "",
  address: "",
  postalCode: "",
});

const { errors, validateAll, firstInvalidField } = useFormValidation(
  form,
  validateShippingForm,
);

type TextField = InstanceType<typeof BaseTextField>;
const fields = {
  city: useTemplateRef<TextField>("city"),
  address: useTemplateRef<TextField>("address"),
  postalCode: useTemplateRef<TextField>("postalCode"),
};

function submit() {
  if (validateAll()) {
    emit("calculate", trimValues(form));
    return;
  }

  const field = firstInvalidField.value;
  if (field) fields[field].value?.focus();
}
</script>

<template>
  <BasePanel title="Calculate Shipping">
    <BaseAlert
      v-if="disabled"
      title="Add items to calculate shipping."
      class="mb-6"
    />
    <form novalidate @submit.prevent="submit">
      <fieldset :disabled="disabled" class="space-y-6">
        <legend class="sr-only">Shipping destination</legend>
        <BaseTextField
          ref="city"
          v-model="form.city"
          label="City"
          hide-label
          placeholder="Stuttgart"
          autocomplete="address-level2"
          :error="errors.city"
        />
        <BaseTextField
          ref="address"
          v-model="form.address"
          label="Address"
          hide-label
          placeholder="Street and house number"
          autocomplete="address-line1"
          :error="errors.address"
        />
        <BaseTextField
          ref="postalCode"
          v-model="form.postalCode"
          label="Postal code"
          hide-label
          placeholder="12345"
          autocomplete="postal-code"
          :error="errors.postalCode"
        />
        <BaseButton
          type="submit"
          variant="accent"
          :loading="loading"
          loading-text="Calculating…"
        >
          Calculate Shipping
        </BaseButton>
      </fieldset>
    </form>
    <p v-if="quote && !disabled" class="mt-6 text-sm text-navy">
      Shipping to {{ quote.destination.city }}
      {{ quote.destination.postalCode }}:
      <strong class="tabular-nums">{{ formatMoney(quote.costCents) }}</strong>
    </p>
  </BasePanel>
</template>
