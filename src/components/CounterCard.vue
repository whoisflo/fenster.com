<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

withDefaults(defineProps<{ step?: number }>(), { step: 1 })

const counter = useCounterStore()
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm text-slate-500">Pinia store</p>
        <p class="text-4xl font-bold tabular-nums" data-testid="count">{{ counter.count }}</p>
        <p class="text-sm text-slate-500">verdoppelt: {{ counter.doubled }}</p>
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          @click="counter.increment(step)"
        >
          +{{ step }}
        </button>
        <button
          type="button"
          class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          @click="counter.reset()"
        >
          Reset
        </button>
      </div>
    </div>
  </section>
</template>
