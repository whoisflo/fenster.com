<script setup lang="ts">
import BaseIcon from "@/components/base/BaseIcon.vue";

type ButtonVariant = "primary" | "accent" | "secondary";

const {
  variant = "primary",
  type = "button",
  loading = false,
  disabled = false,
} = defineProps<{
  variant?: ButtonVariant;
  type?: "button" | "submit";
  block?: boolean;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-green text-white enabled:not-aria-disabled:hover:brightness-95",
  accent: "bg-pink text-white enabled:not-aria-disabled:hover:brightness-95",
  secondary:
    "border border-navy bg-white text-navy enabled:not-aria-disabled:hover:bg-panel",
};

function onClick(event: MouseEvent) {
  if (disabled || loading) {
    event.preventDefault();
    return;
  }
  emit("click", event);
}
</script>

<template>
  <button
    :type="type"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-xs px-6 text-sm font-bold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
    :class="[variantClasses[variant], { 'w-full': block }]"
    @click="onClick"
  >
    <BaseIcon v-if="loading" name="spinner" />
    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <slot v-else />
  </button>
</template>
