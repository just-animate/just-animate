import * as chai from 'chai'
import { forEach, head, tail, list } from '../../src/lib/lists';
const { assert, expect } = chai

describe('forEach()', () => {
  it('calls the function for each item', () => {
    const results: number[] = []
    forEach([1, 2, 3, 4], s => results.push(s))
    assert.deepEqual([1, 2, 3, 4], results)
  })
  
  it('stops execution when false is returned', () => {
    const results: number[] = []
    forEach([1, 2, 3, 4], s => {
      if (s === 3) {
        return false
      }
      results.push(s)
      return undefined
    })
    assert.deepEqual([1, 2], results)
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

describe('list', () => {
  it('wraps an existing object in an array', () => {
    const input = { x: 2 }
    const result = list(input)
    expect(result[0]).to.equal(input)
  })

  it('wraps an existing string in an array', () => {
    const input = 'a string'
    const result = list(input)
    expect(result[0]).to.equal(input)
  })

  it('returns an array back if passed an array', () => {
    const input = [1, 2, 3]
    const result = list(input)
    expect(result).to.equal(input)
  })
})
