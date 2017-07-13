import * as chai from 'chai'
const { assert } = chai

import { isArrayLike, isDefined, isFunction, isNumber, isString } from '../../src/utils'

describe('type', () => {
  describe('isArray()', () => {
    it('returns true when an array is passed', () => {
      assert.equal(true, isArrayLike([]))
    })

    it('returns true when an array-like object is passed', () => {
      assert.equal(true, isArrayLike({
        length: 0
      }))
    })

    it('returns false when a normal object is passed', () => {
      assert.equal(false, isArrayLike({}))
    })
  })

  describe('isDefined()', () => {
    it('returns false when undefined', () => {
      assert.equal(false, isDefined(undefined))
      assert.equal(false, isDefined(''))
    })

    it('returns true when defined', () => {
      assert.equal(true, isDefined(' '))
      assert.equal(true, isDefined(0))
      assert.equal(true, isDefined(1))
      assert.equal(true, isDefined([]))
      assert.equal(true, isDefined({}))
      assert.equal(true, isDefined(false))
      assert.equal(true, isDefined(true))
    })
  })

  describe('isFunction()', () => {
    it('returns true when a function', () => {
      assert.equal(true, isFunction(() => { /* empty */ }))
    })
    it('returns true when a function', () => {
      const s = class {
        methodTwo() { /* empty */ }
      }

      assert.equal(true, isFunction(s))
      assert.equal(true, isFunction(new s().methodTwo))
    })

    it('returns false when not a function', () => {
      assert.equal(false, isFunction(' '))
      assert.equal(false, isFunction(0))
      assert.equal(false, isFunction(1))
      assert.equal(false, isFunction([]))
      assert.equal(false, isFunction({}))
      assert.equal(false, isFunction(false))
      assert.equal(false, isFunction(true))
    })
  })

  describe('isNumber()', () => {
    it('returns true when a number', () => {
      assert.equal(true, isNumber(1))
    })
    it('returns false when not a number', () => {
      assert.equal(false, isNumber('1'))
    })
  })

  describe('isString()', () => {
    it('returns true when a string', () => {
      assert.equal(true, isString(''))
    })
    it('returns false when not a string', () => {
      // tslint:disable-next-line:no-null-keyword
      assert.equal(false, isString(null))
    })
  })
})
