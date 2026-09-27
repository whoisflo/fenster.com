<script setup lang="ts">
import { useTemplateRef } from "vue";

import BaseIcon from "@/components/base/BaseIcon.vue";
import type { IconName } from "@/components/base/icons";

type IconButtonVariant = "control" | "badge" | "ghost";

const { variant = "ghost", disabled = false } = defineProps<{
  icon: IconName;
  label: string;
  variant?: IconButtonVariant;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonEl = useTemplateRef<HTMLButtonElement>("button");

const variantClasses: Record<IconButtonVariant, string> = {
  control:
    "size-8 rounded-xs bg-control text-muted not-aria-disabled:hover:text-navy",
  badge:
    "size-4.5 rounded-full bg-black text-white before:absolute before:-inset-1 before:content-['']",
  ghost: "size-8 rounded-xs not-aria-disabled:hover:bg-black/5",
};

const iconClasses: Record<IconButtonVariant, string> = {
  control: "size-3.5",
  badge: "size-2.5",
  ghost: "size-4",
};

function onClick(event: MouseEvent) {
  if (disabled) {
    event.preventDefault();
    return;
  }
  emit("click", event);
}

defineExpose({
  focus: () => buttonEl.value?.focus(),
});
</script>

<template>
  <button
    ref="button"
    type="button"
    :aria-label="label"
    :aria-disabled="disabled ? 'true' : undefined"
    class="relative inline-grid shrink-0 place-items-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
    :class="variantClasses[variant]"
    @click="onClick"
  >
    <BaseIcon :name="icon" :class="iconClasses[variant]" />
  </button>
</template>
