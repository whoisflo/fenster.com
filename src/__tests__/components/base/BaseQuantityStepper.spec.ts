import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'

import BaseQuantityStepper from '@/components/base/BaseQuantityStepper.vue'

/** Mounts the stepper with a working v-model, the way a parent component would use it. */
function mountStepper(modelValue = 3) {
  const wrapper: VueWrapper = mount(BaseQuantityStepper, {
    props: {
      modelValue,
      label: 'Wool Beanie',
      'onUpdate:modelValue': (value: number) => wrapper.setProps({ modelValue: value }),
    },
  })
  return wrapper
}

const decrease = (wrapper: VueWrapper) =>
  wrapper.get<HTMLButtonElement>('button[aria-label="Decrease quantity of Wool Beanie"]')
const increase = (wrapper: VueWrapper) =>
  wrapper.get<HTMLButtonElement>('button[aria-label="Increase quantity of Wool Beanie"]')
const input = (wrapper: VueWrapper) => wrapper.get('input')

describe('BaseQuantityStepper', () => {
  it('shows the current quantity in an input named after the product', () => {
    const wrapper = mountStepper(3)

    expect(input(wrapper).element.value).toBe('3')
    expect(input(wrapper).attributes('aria-label')).toBe('Quantity of Wool Beanie')
  })

  it('increases the quantity with +', async () => {
    const wrapper = mountStepper(3)

    await increase(wrapper).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
    expect(input(wrapper).element.value).toBe('4')
  })

  it('decreases the quantity with −', async () => {
    const wrapper = mountStepper(3)

    await decrease(wrapper).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
    expect(input(wrapper).element.value).toBe('2')
  })

  it('disables − at the minimum', () => {
    const wrapper = mountStepper(1)

    expect(decrease(wrapper).element.disabled).toBe(true)
    expect(increase(wrapper).element.disabled).toBe(false)
  })

  it('disables + at the maximum', () => {
    const wrapper = mountStepper(99)

    expect(increase(wrapper).element.disabled).toBe(true)
    expect(decrease(wrapper).element.disabled).toBe(false)
  })

  it('respects a custom range', () => {
    const wrapper = mount(BaseQuantityStepper, {
      props: { modelValue: 5, label: 'Wool Beanie', min: 5, max: 5 },
    })

    expect(decrease(wrapper).element.disabled).toBe(true)
    expect(increase(wrapper).element.disabled).toBe(true)
  })

  it('commits a typed quantity on blur', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('7')
    await input(wrapper).trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toEqual([[7]])
  })

  it('commits a typed quantity on Enter', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('8')
    await input(wrapper).trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toEqual([[8]])
  })

  it('clamps a typed quantity above the maximum', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('150')
    await input(wrapper).trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toEqual([[99]])
    expect(input(wrapper).element.value).toBe('99')
  })

  it('clamps a typed quantity below the minimum', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('0')
    await input(wrapper).trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(input(wrapper).element.value).toBe('1')
  })

  it('reverts text that is not a number', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('abc')
    await input(wrapper).trigger('blur')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input(wrapper).element.value).toBe('3')
  })

  it('reverts on Escape', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('7')
    await input(wrapper).trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input(wrapper).element.value).toBe('3')
  })

  it('marks invalid text and explains the problem', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('abc')

    const field = input(wrapper)
    expect(field.attributes('aria-invalid')).toBe('true')
    const message = wrapper.get(`#${field.attributes('aria-describedby')}`)
    expect(message.text()).toBe('Whole numbers only')
  })

  it('clears the error once the text is valid again', async () => {
    const wrapper = mountStepper(3)

    await input(wrapper).setValue('abc')
    await input(wrapper).setValue('5')

    expect(input(wrapper).attributes('aria-invalid')).toBeUndefined()
    expect(input(wrapper).attributes('aria-describedby')).toBeUndefined()
  })

  it('follows quantity changes from the parent', async () => {
    const wrapper = mountStepper(3)

    await wrapper.setProps({ modelValue: 5 })

    expect(input(wrapper).element.value).toBe('5')
  })
})
