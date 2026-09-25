import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import BaseIconButton from '@/components/base/BaseIconButton.vue'

describe('BaseIconButton', () => {
  it('uses the label as its accessible name', () => {
    const wrapper = mount(BaseIconButton, {
      props: { icon: 'close', label: 'Remove Wool Beanie' },
    })

    expect(wrapper.get('button').attributes('aria-label')).toBe('Remove Wool Beanie')
  })

  it('shows a decorative icon and no visible text', () => {
    const wrapper = mount(BaseIconButton, {
      props: { icon: 'plus', label: 'Increase quantity' },
    })

    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toBe('')
  })

  it('is a plain button, so it never submits a form by accident', () => {
    const wrapper = mount(BaseIconButton, {
      props: { icon: 'minus', label: 'Decrease quantity' },
    })

    expect(wrapper.get('button').attributes('type')).toBe('button')
  })

  it('passes clicks through to the parent', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseIconButton, {
      props: { icon: 'plus', label: 'Increase quantity' },
      attrs: { onClick },
    })

    await wrapper.get('button').trigger('click')

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('ignores clicks when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseIconButton, {
      props: { icon: 'minus', label: 'Decrease quantity', disabled: true },
      attrs: { onClick },
    })

    const button = wrapper.get('button')
    await button.trigger('click')

    expect(button.element.disabled).toBe(true)
    expect(onClick).not.toHaveBeenCalled()
  })
})
