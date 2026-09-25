import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import BasePanel from '@/components/base/BasePanel.vue'

describe('BasePanel', () => {
  it('shows its title as a heading', () => {
    const wrapper = mount(BasePanel, { props: { title: 'Cart Totals' } })

    expect(wrapper.get('h2').text()).toBe('Cart Totals')
  })

  it('is a section named by its heading', () => {
    const wrapper = mount(BasePanel, { props: { title: 'Cart Totals' } })

    const section = wrapper.get('section')
    expect(section.attributes('aria-labelledby')).toBe(wrapper.get('h2').attributes('id'))
  })

  it('renders its content', () => {
    const wrapper = mount(BasePanel, {
      props: { title: 'Cart Totals' },
      slots: { default: '<p>Subtotal</p>' },
    })

    expect(wrapper.get('section p').text()).toBe('Subtotal')
  })
})
