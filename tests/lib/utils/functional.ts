import * as chai from 'chai'
import { memoize } from '../../../src/lib/utils/functional'
const { assert } = chai

describe('memoize', () => {
  it('caches when a primitive is resolved', () => {
    var i = 0
    var s = memoize(() => {
      i++
      return i
    })

    s()
    s()
    s()

    assert.equal(i, 1)
  })

  it('caches a function', () => {
    var s = memoize(() => () => { /**/ })

    var first = s()
    var second = s()

    assert.equal(first, second)
  })
    
  it('caches based on one argument', () => {
    var i = 0
    var s = memoize((n: number) => {
        i += n
        return i
    })

    s(1)
    s(2)
    s(3)
    
    s(1)
    s(2)
    s(3)
    
    s(1)
    s(2)
    s(3)  

    assert.equal(i, 6)
  }) 
  
  it('caches based on two arguments', () => {
    var i = 0
    var s = memoize((n1: number, _s: string) => {
        i += n1
        return i
    })

    s(1, '')
    s(1, 'something') 
    
    s(1, '')
    s(1, 'something') 

    assert.equal(i, 2)
  })    
})
