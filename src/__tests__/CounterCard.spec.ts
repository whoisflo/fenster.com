import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import CounterCard from '@/components/CounterCard.vue'
import { useCounterStore } from '@/stores/counter'

describe('CounterCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the current count', () => {
    const wrapper = mount(CounterCard)
    expect(wrapper.get('[data-testid="count"]').text()).toBe('0')
  })

  it('increments by the given step', async () => {
    const wrapper = mount(CounterCard, { props: { step: 5 } })

    await wrapper.get('button').trigger('click')

    expect(useCounterStore().count).toBe(5)
    expect(wrapper.get('[data-testid="count"]').text()).toBe('5')
  })
})
