<script setup lang="ts">
import { computed, ref } from 'vue'

import CounterCard from '@/components/CounterCard.vue'
import { useTitle } from '@/composables/useTitle'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

const projectName = ref('Project Neuffer')
const pageTitle = computed(() => `${projectName.value} — ${counter.count}`)

useTitle(pageTitle)

const stack = [
  { name: 'Vue 3', detail: 'Composition API, <script setup>' },
  { name: 'TypeScript', detail: 'strict mode, vue-tsc' },
  { name: 'Tailwind CSS', detail: 'v4 via @tailwindcss/vite' },
  { name: 'Pinia', detail: 'setup-style stores' },
  { name: 'Vitest', detail: 'jsdom + @vue/test-utils' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <h1 class="text-lg font-semibold tracking-tight">{{ projectName }}</h1>
        <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Vue 3 + TS + Tailwind
        </span>
      </div>
    </header>

    <main class="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <section class="space-y-3">
        <h2 class="text-3xl font-bold tracking-tight text-balance">
          Setup steht. Zeit zum Bauen.
        </h2>
        <p class="max-w-prose text-slate-600">
          Ein schlankes Starter-Setup mit Composition API, strikt typisiertem TypeScript und
          Tailwind. Ersetze diese Seite einfach mit deinem eigenen Einstieg.
        </p>
      </section>

      <CounterCard />

      <section>
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Stack</h3>
        <ul class="grid gap-3 sm:grid-cols-2">
          <li
            v-for="item in stack"
            :key="item.name"
            class="rounded-lg border border-slate-200 bg-white p-4"
          >
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-sm text-slate-500">{{ item.detail }}</p>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>
