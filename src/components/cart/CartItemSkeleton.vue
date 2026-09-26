<script setup lang="ts">
import { cartGrid } from "@/components/cart/cartGrid";
</script>

<template>
  <li
    aria-hidden="true"
    class="flex animate-pulse flex-col gap-4 border-b border-line py-5 md:items-center"
    :class="cartGrid"
  >
    <div class="flex items-start gap-4">
      <div class="size-20 shrink-0 rounded-xs bg-placeholder/60" />
      <div class="flex-1 space-y-2 pt-1">
        <div class="h-3.5 w-3/4 rounded-xs bg-placeholder/60" />
        <div class="h-3 w-1/3 rounded-xs bg-placeholder/40" />
        <div class="h-3 w-1/4 rounded-xs bg-placeholder/40" />
      </div>
    </div>
    <div class="flex items-center justify-between gap-3 md:contents">
      <div class="h-3.5 w-14 rounded-xs bg-placeholder/60" />
      <div class="h-8 w-28 rounded-xs bg-placeholder/40" />
      <div
        class="h-3.5 w-16 rounded-xs bg-placeholder/60 md:justify-self-end"
      />
    </div>
  </li>
</template>
