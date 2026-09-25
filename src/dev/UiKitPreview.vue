<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseIcon from '@/components/base/BaseIcon.vue'
import BaseIconButton from '@/components/base/BaseIconButton.vue'
import type { IconName } from '@/components/base/icons'

const iconNames: IconName[] = ['plus', 'minus', 'close', 'spinner']
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
  </div>
</template>
