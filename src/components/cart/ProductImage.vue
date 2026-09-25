<script setup lang="ts">
import { ref, watch } from "vue";

const { src } = defineProps<{
  src: string | null;
  alt: string;
}>();

const failed = ref(false);

// A new image gets a fresh chance to load.
watch(
  () => src,
  () => {
    failed.value = false;
  },
);
</script>

<template>
  <img
    v-if="src && !failed"
    :src="src"
    :alt="alt"
    loading="lazy"
    class="bg-white object-contain"
    @error="failed = true"
  />
  <div
    v-else
    class="bg-placeholder"
    :role="alt ? 'img' : undefined"
    :aria-label="alt || undefined"
    :aria-hidden="alt ? undefined : 'true'"
  />
</template>
