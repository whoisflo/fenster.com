<script setup lang="ts">
import { icons, type IconName } from '@/components/base/icons'

defineProps<{ name: IconName }>()
</script>

<template>
  <!-- width/height are only a 16px default: any size class on the component overrides them. -->
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="shrink-0"
    :class="{ 'animate-spin': name === 'spinner' }"
  >
    <path v-for="(path, index) in icons[name]" :key="index" :d="path.d" :opacity="path.opacity" />
  </svg>
</template>
