import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import BaseButton from '@/components/base/BaseButton.vue'

describe('BaseButton', () => {
  it('renders its label', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Add Item' } })

    expect(wrapper.get('button').text()).toBe('Add Item')
  })

  it('is a plain button by default, so it never submits a form by accident', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Add Item' } })

    expect(wrapper.get('button').attributes('type')).toBe('button')
  })

  it('can be a submit button', () => {
    const wrapper = mount(BaseButton, {
      props: { type: 'submit' },
      slots: { default: 'Calculate Shipping' },
    })

    expect(wrapper.get('button').attributes('type')).toBe('submit')
  })

  it('passes clicks through to the parent', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, { attrs: { onClick }, slots: { default: 'Add Item' } })

    await wrapper.get('button').trigger('click')

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('can be disabled', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Clear Cart' },
    })

    expect(wrapper.get('button').element.disabled).toBe(true)
  })

  it('is disabled and shows the loading text while loading', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true, loadingText: 'Adding…' },
      slots: { default: 'Add Item' },
    })

    const button = wrapper.get('button')
    expect(button.element.disabled).toBe(true)
    expect(button.text()).toBe('Adding…')
  })

  it('keeps its label while loading when no loading text is given', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Add Item' },
    })

    expect(wrapper.get('button').text()).toBe('Add Item')
  })

  it('ignores clicks while loading', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      attrs: { onClick },
      slots: { default: 'Add Item' },
    })

    await wrapper.get('button').trigger('click')

    expect(onClick).not.toHaveBeenCalled()
  })
})
