import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import BaseIcon from '@/components/base/BaseIcon.vue'

describe('BaseIcon', () => {
  it('is hidden from screen readers', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'plus' } })

    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it.each(['plus', 'minus', 'close', 'spinner'] as const)('draws the %s icon', (name) => {
    const wrapper = mount(BaseIcon, { props: { name } })

    expect(wrapper.findAll('path').length).toBeGreaterThan(0)
  })
})
