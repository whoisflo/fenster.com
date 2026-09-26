<script setup lang="ts">
import { storeToRefs } from "pinia";

import BaseIconButton from "@/components/base/BaseIconButton.vue";
import { useToastStore, type ToastTone } from "@/stores/toast";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

const toneClasses: Record<ToastTone, string> = {
  success: "border-green",
  error: "border-red-600",
  info: "border-navy",
};
</script>

<template>
  <TransitionGroup
    tag="div"
    aria-live="polite"
    class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    enter-active-class="transition duration-200 motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition duration-200 motion-reduce:transition-none"
    leave-to-class="opacity-0"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-sm border-l-4 bg-white py-2 pr-2 pl-4 text-sm text-navy shadow-lg sm:w-80"
      :class="toneClasses[toast.tone]"
    >
      <p class="flex-1">{{ toast.message }}</p>
      <BaseIconButton
        icon="close"
        label="Dismiss notification"
        @click="toastStore.dismiss(toast.id)"
      />
    </div>
  </TransitionGroup>
</template>
