import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const doubled = computed(() => count.value * 2)

  function increment(step = 1) {
    count.value += step
  }

  function reset() {
    count.value = 0
  }

  return { count, doubled, increment, reset }
})
