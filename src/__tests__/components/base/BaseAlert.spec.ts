import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import BaseAlert from '@/components/base/BaseAlert.vue'

describe('BaseAlert', () => {
  it('shows its title and text', () => {
    const wrapper = mount(BaseAlert, {
      props: { title: 'Your cart is empty.' },
      slots: { default: 'Use Add Item to add a product.' },
    })

    expect(wrapper.text()).toContain('Your cart is empty.')
    expect(wrapper.text()).toContain('Use Add Item to add a product.')
  })

  it('is a polite status message by default', () => {
    const wrapper = mount(BaseAlert, { props: { title: 'Your cart is empty.' } })

    expect(wrapper.attributes('role')).toBe('status')
  })

  it('is an alert when it reports an error', () => {
    const wrapper = mount(BaseAlert, {
      props: { title: "We couldn't load your products.", tone: 'error' },
    })

    expect(wrapper.attributes('role')).toBe('alert')
  })

  it('renders actions next to the message', () => {
    const wrapper = mount(BaseAlert, {
      props: { title: "We couldn't load your products.", tone: 'error' },
      slots: { actions: '<button type="button">Try again</button>' },
    })

    expect(wrapper.get('button').text()).toBe('Try again')
  })
})
