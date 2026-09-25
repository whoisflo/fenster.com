<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue'

type ButtonVariant = 'primary' | 'accent' | 'secondary'

const { variant = 'primary', type = 'button' } = defineProps<{
  variant?: ButtonVariant
  type?: 'button' | 'submit'
  block?: boolean
  loading?: boolean
  loadingText?: string
  disabled?: boolean
}>()

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-green text-white enabled:hover:brightness-95',
  accent: 'bg-pink text-white enabled:hover:brightness-95',
  secondary: 'border border-navy bg-white text-navy enabled:hover:bg-panel',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-xs px-6 text-sm font-bold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60"
    :class="[variantClasses[variant], { 'w-full': block }]"
  >
    <BaseIcon v-if="loading" name="spinner" />
    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <slot v-else />
  </button>
</template>
