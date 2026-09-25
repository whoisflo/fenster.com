import { describe, expect, it } from 'vitest'

import { clampInteger, parseWholeNumber } from '@/lib/number'

describe('clampInteger', () => {
  it('keeps whole numbers inside the range', () => {
    expect(clampInteger(5, 1, 99)).toBe(5)
  })

  it('drops the decimal part', () => {
    expect(clampInteger(2.7, 1, 99)).toBe(2)
  })

  it('raises values below the minimum to the minimum', () => {
    expect(clampInteger(0, 1, 99)).toBe(1)
    expect(clampInteger(-4, 1, 99)).toBe(1)
  })

  it('lowers values above the maximum to the maximum', () => {
    expect(clampInteger(150, 1, 99)).toBe(99)
  })
})

describe('parseWholeNumber', () => {
  const range = { min: 1, max: 99 }

  it('accepts whole numbers inside the range', () => {
    expect(parseWholeNumber('5', range)).toEqual({ status: 'valid', value: 5 })
    expect(parseWholeNumber('1', range)).toEqual({ status: 'valid', value: 1 })
    expect(parseWholeNumber('99', range)).toEqual({ status: 'valid', value: 99 })
  })

  it('ignores surrounding spaces', () => {
    expect(parseWholeNumber(' 7 ', range)).toEqual({ status: 'valid', value: 7 })
  })

  it('asks for a number when the text is empty', () => {
    expect(parseWholeNumber('', range)).toEqual({ status: 'invalid', error: 'Enter a number' })
    expect(parseWholeNumber('   ', range)).toEqual({ status: 'invalid', error: 'Enter a number' })
  })

  it.each(['abc', '1.5', '-2', '1e3', '3 4'])('rejects "%s" as not a whole number', (text) => {
    expect(parseWholeNumber(text, range)).toEqual({
      status: 'invalid',
      error: 'Whole numbers only',
    })
  })

  it('reports numbers below the minimum, keeping the value', () => {
    expect(parseWholeNumber('0', range)).toEqual({
      status: 'outOfRange',
      value: 0,
      error: 'Minimum is 1',
    })
  })

  it('reports numbers above the maximum, keeping the value', () => {
    expect(parseWholeNumber('150', range)).toEqual({
      status: 'outOfRange',
      value: 150,
      error: 'Maximum is 99',
    })
  })
})
