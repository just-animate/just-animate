import * as chai from 'chai'
const { assert, expect } = chai

import { deepCopyObject } from '../../src/utils'

describe('objects', () => {
  describe('deepCopyObject', () => {
    it('combines combines {x:1} and {y:2} into {x:1,y;2}', () => {
      const first = { x: 1 }
      const second = { y: 2 }
      let result = deepCopyObject(first)
      result = deepCopyObject(second, result)

      expect(result).to.deep.equal({ x: 1, y: 2 })
    })

    it('creates a copy of the object', () => {
      const testData = { x: 1 }
      const result = deepCopyObject(testData)

      expect(result).to.not.equal(testData)
    })

    it('creates a copy of all objects in properties of objects', () => {
      const level3 = { z: 1 }
      const level2 = { y: level3 }
      const level1 = { x: level2 }
      const result = deepCopyObject(level1)

      expect(result).to.deep.equal(level1)
      assert.isTrue(result.x.y !== level3)
    })

    it('creates a copy of an array inside a property', () => {
      const steps = [3, 2, 1, 'ignition!']
      const countdown = { steps: steps }
      const result = deepCopyObject(countdown)

      expect(result).to.deep.equal(countdown)
      expect(result.countdown).to.not.equal(steps)
    })
  })
})
