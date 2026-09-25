<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'

import BaseIconButton from '@/components/base/BaseIconButton.vue'
import { clampInteger, parseWholeNumber } from '@/lib/number'

const { min = 1, max = 99 } = defineProps<{
  /** What is being counted, e.g. the product title. Used in the accessible names. */
  label: string
  min?: number
  max?: number
}>()

const quantity = defineModel<number>({ required: true })

// The input edits a draft; the quantity only changes when the draft is committed.
const draft = ref(String(quantity.value))
watch(quantity, (value) => {
  draft.value = String(value)
})

const parsed = computed(() => parseWholeNumber(draft.value, { min, max }))
const error = computed(() => (parsed.value.status === 'valid' ? null : parsed.value.error))
const errorId = useId()

function step(delta: number) {
  quantity.value = clampInteger(quantity.value + delta, min, max)
}

function commit() {
  const result = parsed.value
  if (result.status === 'invalid') {
    revert()
    return
  }

  const value = clampInteger(result.value, min, max)
  if (value !== quantity.value) quantity.value = value
  draft.value = String(value)
}

function revert() {
  draft.value = String(quantity.value)
}
</script>

<template>
  <div class="relative inline-flex items-center gap-1">
    <BaseIconButton
      icon="minus"
      variant="control"
      :label="`Decrease quantity of ${label}`"
      :disabled="quantity <= min"
      @click="step(-1)"
    />
    <input
      v-model="draft"
      type="text"
      inputmode="numeric"
      :aria-label="`Quantity of ${label}`"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      class="h-8 w-10 rounded-xs bg-control text-center text-sm text-navy tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy aria-invalid:ring-2 aria-invalid:ring-red-600"
      @blur="commit"
      @keydown.enter.prevent="commit"
      @keydown.esc="revert"
    />
    <BaseIconButton
      icon="plus"
      variant="control"
      :label="`Increase quantity of ${label}`"
      :disabled="quantity >= max"
      @click="step(1)"
    />
    <!-- Positioned below the stepper, so a message never shifts the surrounding layout. -->
    <p
      v-if="error"
      :id="errorId"
      class="absolute top-full left-1/2 mt-1 -translate-x-1/2 text-xs whitespace-nowrap text-red-600"
    >
      {{ error }}
    </p>
  </div>
</template>
