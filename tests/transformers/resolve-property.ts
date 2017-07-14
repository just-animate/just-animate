import * as chai from 'chai'
const { assert, expect } = chai

import { resolveProperty } from '../../src/transformers'

describe('resolve', () => {
  it('returns the same value when a non-function', () => {
    const initial = 5
    const actual = resolveProperty(initial, {})
    expect(actual).to.equal(initial)
  })

  it('returns the result of a function otherwise', () => {
    const initial = function (_target: any, index: number) { return index * 100 }
    const actual = resolveProperty(initial, {}, 2)
    expect(actual).to.equal(200)
  })

  it('returns a value untouched if it is an ordinary string', () => {
    const initial = 'nothing to see here folks'
    const actual = resolveProperty(initial, {}, 2) 
    expect(actual).to.equal(initial)
  })

  it('returns 60 for +=20 at 3rd index', () => {
    const initial = '+=20'
    const actual = resolveProperty(initial, {}, 2)
    expect(actual).to.equal(60)
  })

  it('returns 3.3 when passed +=1.1 at [2]', () => {
    const actual = resolveProperty('+=1.1', {}, 2) as number
    assert.approximately(actual, 3.3, 0.0001)
  })

  it('returns -3.3 when passed -=1.1 at [2]', () => {
    const actual = resolveProperty('-=1.1', {}, 2) as number
    assert.approximately(actual, -3.3, 0.0001)
  })
  
  it('returns 3px when passed +=1px at [2]', () => {
    const actual = resolveProperty('+=1px', {}, 2) as string
    assert.equal(actual, '3px')
  })

  it('returns -3px when passed -=1px at [2]', () => {
    const actual = resolveProperty('-=1px', {}, 2) as string
    assert.equal(actual, '-3px')
  })
  
  it('resolves nested functions holding a += notation string', () => {
    const insanity = () => () => () => '+=100em'
    const actual = resolveProperty(insanity, {}, 2) as string
    assert.equal(actual, '300em')
  })
})
