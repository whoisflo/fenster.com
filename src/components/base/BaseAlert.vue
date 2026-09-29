<script setup lang="ts">
type AlertTone = "info" | "error";

const { tone = "info" } = defineProps<{
  tone?: AlertTone;
  title: string;
}>();

const toneClasses: Record<AlertTone, string> = {
  info: "bg-panel text-navy",
  error: "border border-red-200 bg-red-50 text-red-800",
};
</script>

<template>
  <div
    :role="tone === 'error' ? 'alert' : 'status'"
    class="flex flex-col gap-3 rounded-sm p-4 sm:flex-row sm:items-center sm:justify-between"
    :class="toneClasses[tone]"
  >
    <div>
      <p class="font-bold">{{ title }}</p>
      <div v-if="$slots.default" class="mt-1 text-sm">
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
