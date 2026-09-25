import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'

import BaseTextField from '@/components/base/BaseTextField.vue'

enableAutoUnmount(afterEach)

describe('BaseTextField', () => {
  it('shows the value it is bound to', () => {
    const wrapper = mount(BaseTextField, { props: { modelValue: 'Stuttgart', label: 'City' } })

    expect(wrapper.get('input').element.value).toBe('Stuttgart')
  })

  it('emits what the user types', async () => {
    const wrapper = mount(BaseTextField, { props: { modelValue: '', label: 'City' } })

    await wrapper.get('input').setValue('Berlin')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Berlin']])
  })

  it('is labelled by its label', () => {
    const wrapper = mount(BaseTextField, { props: { modelValue: '', label: 'City' } })

    const label = wrapper.get('label')
    expect(label.text()).toBe('City')
    expect(label.attributes('for')).toBe(wrapper.get('input').attributes('id'))
  })

  it('keeps a hidden label available to screen readers', () => {
    const wrapper = mount(BaseTextField, {
      props: { modelValue: '', label: 'City', hideLabel: true },
    })

    const label = wrapper.get('label')
    expect(label.classes()).toContain('sr-only')
    expect(label.attributes('for')).toBe(wrapper.get('input').attributes('id'))
  })

  it('passes placeholder, autocomplete and inputmode to the input', () => {
    const wrapper = mount(BaseTextField, {
      props: {
        modelValue: '',
        label: 'Postal code',
        placeholder: '12345',
        autocomplete: 'postal-code',
        inputmode: 'numeric',
      },
    })

    const field = wrapper.get('input')
    expect(field.attributes('placeholder')).toBe('12345')
    expect(field.attributes('autocomplete')).toBe('postal-code')
    expect(field.attributes('inputmode')).toBe('numeric')
  })

  it('shows an error and links it to the field', () => {
    const wrapper = mount(BaseTextField, {
      props: { modelValue: '', label: 'City', error: 'Enter a city' },
    })

    const field = wrapper.get('input')
    expect(field.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get(`#${field.attributes('aria-describedby')}`).text()).toBe('Enter a city')
  })

  it('has no error state without an error', () => {
    const wrapper = mount(BaseTextField, { props: { modelValue: '', label: 'City' } })

    const field = wrapper.get('input')
    expect(field.attributes('aria-invalid')).toBeUndefined()
    expect(field.attributes('aria-describedby')).toBeUndefined()
  })

  it('can be focused by its parent', () => {
    const wrapper = mount(BaseTextField, {
      props: { modelValue: '', label: 'City' },
      attachTo: document.body,
    })

    wrapper.vm.focus()

    expect(document.activeElement).toBe(wrapper.get('input').element)
  })
})
