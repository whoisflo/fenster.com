<script setup lang="ts">
import { useId } from "vue";

defineProps<{ title: string }>();

const headingId = useId();
</script>

<template>
  <section :aria-labelledby="headingId">
    <h2
      :id="headingId"
      class="mb-6 text-center font-heading text-xl font-bold text-navy"
    >
      {{ title }}
    </h2>
    <div class="rounded-sm bg-panel p-6 sm:p-8">
      <slot />
    </div>
  </section>
</template>
