import * as chai from 'chai'
const { assert, expect } = chai

import { resolve } from '../../src/transformers'

describe('resolve', () => {
  it('returns the same value when a non-function', () => {
    const initial = 5
    const result = resolve(initial, {})

    expect(result).to.equal(initial)
  })

  it('returns the result of a function otherwise', () => {
    const target = {}
    const context = {
      index: 2,
      target: target,
      targets: [undefined, undefined, target]
    }
    const initial = function (ctx: any): number { return ctx.index * 100 }
    const result = resolve(initial, context as any)

    expect(result).to.equal(200)
  })

  it('returns a value untouched if it is an ordinary string', () => {
    const target = {}
    const context = {
      index: 2,
      target: target,
      targets: [undefined, undefined, target]
    }
    const initial = 'nothing to see here folks'
    const result = resolve(initial, context as any)

    expect(result).to.equal(initial)
  })

  it('returns 60 for +=20 at 3rd index', () => {
    const target = {}
    const context = {
      index: 2,
      target: target,
      targets: [undefined, undefined, target]
    }
    const initial = '+=20'
    const result = resolve(initial, context as any)

    expect(result).to.equal(60)
  })

  it('returns 3.3 when passed +=1.1 at [2]', () => {
    const target = {}
    const context = {
      index: 2,
      target: target,
      targets: [undefined, undefined, target]
    }
    assert.approximately(resolve('+=1.1', context as any) as number, 3.3, 0.0001)
  })

  it('returns -3.3 when passed -=1.1 at [2]', () => {
    const target = {}
    const context = {
      index: 2,
      target: target,
      targets: [undefined, undefined, target]
    }
    assert.approximately(resolve('-=1.1', context as any) as number, -3.3, 0.0001)
  })
  
  it('returns 3px when passed +=1px at [2]', () => {
    const target = {}
    const context = {
      index: 2,
      target: target,
      targets: [undefined, undefined, target]
    }
    assert.equal(resolve('+=1px', context as any) as string, '3px')
  })

  it('returns -3px when passed -=1px at [2]', () => {
    const target = {}
    const context = {
      index: 2,
      target: target,
      targets: [undefined, undefined, target]
    }
    assert.equal(resolve('-=1px', context as any) as string, '-3px')
  })
})
