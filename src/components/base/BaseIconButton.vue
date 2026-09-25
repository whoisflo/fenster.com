<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue'
import type { IconName } from '@/components/base/icons'

type IconButtonVariant = 'control' | 'badge' | 'ghost'

const { variant = 'ghost' } = defineProps<{
  icon: IconName
  /** Accessible name. Required, because the button shows no text. */
  label: string
  variant?: IconButtonVariant
  disabled?: boolean
}>()

const variantClasses: Record<IconButtonVariant, string> = {
  control: 'size-8 rounded-xs bg-control text-muted enabled:hover:text-navy',
  // The visible circle is 18px; the pseudo-element grows the tap target to 26px.
  badge:
    "size-4.5 rounded-full bg-black text-white before:absolute before:-inset-1 before:content-['']",
  ghost: 'size-8 rounded-xs enabled:hover:bg-black/5',
}

const iconClasses: Record<IconButtonVariant, string> = {
  control: 'size-3.5',
  badge: 'size-2.5',
  ghost: 'size-4',
}
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :disabled="disabled"
    class="relative inline-grid shrink-0 place-items-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-40"
    :class="variantClasses[variant]"
  >
    <BaseIcon :name="icon" :class="iconClasses[variant]" />
  </button>
</template>
