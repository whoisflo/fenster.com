<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  adding: boolean
  canClear: boolean
}>()

const emit = defineEmits<{
  add: []
  clear: []
}>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <BaseButton :loading="adding" loading-text="Adding…" @click="emit('add')">Add Item</BaseButton>
    <BaseButton variant="accent" :disabled="!canClear" @click="emit('clear')">Clear Cart</BaseButton>
  </div>
</template>
