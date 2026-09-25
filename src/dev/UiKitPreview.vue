<script setup lang="ts">
import { ref } from 'vue'

import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import BaseIconButton from '@/components/base/BaseIconButton.vue'
import BasePanel from '@/components/base/BasePanel.vue'
import BaseQuantityStepper from '@/components/base/BaseQuantityStepper.vue'
import BaseTextField from '@/components/base/BaseTextField.vue'
import type { IconName } from '@/components/base/icons'

const iconNames: IconName[] = ['plus', 'minus', 'close', 'spinner']

const quantity = ref(3)
const city = ref('')
const address = ref('')
const postalCode = ref('1')
</script>

<template>
  <div class="space-y-12">
    <p class="rounded-sm bg-panel p-4 text-sm text-navy">
      Temporary preview of the base UI kit, for reviewing build steps 1–4. The real
      <code>CartPage</code> replaces it in step 5.
    </p>

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
          <BaseIconButton icon="minus" label="Decrease quantity" variant="control" disabled />
          <BaseIconButton icon="plus" label="Increase quantity" variant="control" />
        </div>
        <div class="relative size-20 rounded-xs bg-placeholder">
          <span class="absolute -top-2 -right-2">
            <BaseIconButton icon="close" label="Remove product" variant="badge" />
          </span>
        </div>
        <BaseIconButton icon="close" label="Dismiss notification" />
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="font-heading text-xl font-bold text-navy">BaseIcon</h2>
      <ul class="flex flex-wrap gap-6 text-navy">
        <li v-for="name in iconNames" :key="name" class="flex items-center gap-2 text-sm">
          <BaseIcon :name="name" class="size-5" />
          {{ name }}
        </li>
      </ul>
    </section>

    <section class="space-y-4">
      <h2 class="font-heading text-xl font-bold text-navy">BaseQuantityStepper</h2>
      <div class="flex items-center gap-6">
        <BaseQuantityStepper v-model="quantity" label="Wool Beanie" />
        <p class="text-sm text-navy">
          Committed quantity: <strong>{{ quantity }}</strong> (try typing 0, 150 or abc)
        </p>
      </div>
    </section>

    <section class="space-y-6">
      <h2 class="font-heading text-xl font-bold text-navy">BaseAlert</h2>
      <BaseAlert title="Your cart is empty.">Use Add Item to add a product.</BaseAlert>
      <BaseAlert tone="error" title="We couldn't load your products.">
        <template #actions>
          <BaseButton variant="secondary">Try again</BaseButton>
        </template>
      </BaseAlert>
    </section>

    <section class="space-y-4">
      <h2 class="font-heading text-xl font-bold text-navy">BasePanel + BaseTextField</h2>
      <div class="max-w-sm">
        <BasePanel title="Calculate Shipping">
          <div class="space-y-6">
            <BaseTextField
              v-model="city"
              label="City"
              hide-label
              placeholder="Stuttgart"
              autocomplete="address-level2"
            />
            <BaseTextField
              v-model="address"
              label="Address"
              hide-label
              placeholder="Street and house number"
              autocomplete="address-line1"
            />
            <BaseTextField
              v-model="postalCode"
              label="Postal code"
              hide-label
              placeholder="12345"
              autocomplete="postal-code"
              error="Enter a valid postal code"
            />
            <BaseButton variant="accent">Calculate Shipping</BaseButton>
          </div>
        </BasePanel>
      </div>
    </section>
  </div>
</template>
