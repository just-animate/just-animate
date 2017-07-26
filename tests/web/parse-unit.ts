import * as assert from 'assert'
import { parseUnit } from '../../src/web/parse-unit'

describe('parse-unit', () => {
  it('parses suffixed values correctly', () => {
    const actual = parseUnit('100vh');
    
    assert.deepEqual(actual, {
      unit: 'vh',
      value: 100
    })
  })
  
  it('parses suffixed negative values correctly', () => {
    const actual = parseUnit('-100vw');
    
    assert.deepEqual(actual, {
      unit: 'vw',
      value: -100
    })
  })
  
  it('parses suffixed negative decimal values correctly', () => {
    const actual = parseUnit('-.5%');
    
    assert.deepEqual(actual, {
      unit: '%',
      value: -.5
    })
  })
  
  it('parses number strings as unitless values', () => {
    const actual = parseUnit('-9000');
    
    assert.deepEqual(actual, {
      unit: undefined,
      value: -9000
    })
  })
  
  it('parses numbers as unitless values', () => {
    const actual = parseUnit(-9000);
    
    assert.deepEqual(actual, {
      unit: undefined,
      value: -9000
    })
  })
})
