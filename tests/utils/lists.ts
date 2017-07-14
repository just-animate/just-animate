import * as chai from 'chai'
const { assert, expect } = chai

import { _, head, tail, toArray, listify, each } from '../../src/utils'

describe('all()', () => {
  it('returns an empty array if an empty array is provided', () => {
    assert.deepEqual([], each([], s => s))
  })
  it('returns an equal array for a passthru function', () => {
    assert.deepEqual(['test', 'test2'], each(['test', 'test2'], s => s))
  })
  it('returns undefined for a no-op Action', () => {
    assert.deepEqual(undefined, each(['test', 'test2'], _s => {  /* nothing */ }))
  })
  it('returns undefined when input is undefined', () => {
    assert.deepEqual(undefined, each(_, s => s))
  })
  it('filters undefined results', () => {
    assert.deepEqual([2, 4, 6], each([1, 2, 3, 4, 5, 6], s => s % 2 === 0 ? s : _))
  })
})

describe('head()', () => {
  it('should return undefined if array is empty', () => {
    assert.equal(undefined, head([]))
  })

  it('should return the first item if array is not empty', () => {
    assert.equal('1', head(['1']))
  })
})

describe('tail()', () => {
  it('should return undefined if array is empty', () => {
    assert.equal(undefined, tail([]))
  })

  it('should return the last item if array is not empty', () => {
    assert.equal('1', tail(['0', '1']))
  })
})

describe('toArray()', () => {
  it('returns an array from an array like structure', () => {
    expect(toArray({ length: 0 })).to.deep.equal([])
  })
})

describe('chain', () => {
  it('wraps an existing object in an array', () => {
    const input = { x: 2 }
    const result = listify(input)
    expect(result[0]).to.equal(input)
  })

  it('wraps an existing string in an array', () => {
    const input = 'a string'
    const result = listify(input)
    expect(result[0]).to.equal(input)
  })

  it('returns an array back if passed an array', () => {
    const input = [1, 2, 3]
    const result = listify(input)
    expect(result).to.equal(input)
  })
})
