import { animate } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('basic', () => {
  it('resolves single target', () => {
    /* Test code */
    const target1 = {}

    const timeline = animate({
      duration: 1000,
      targets: target1,
      props: {
        opacity: [0, 1]
      }
    })

    const actual = timeline.getEffects()[0]
    assert.deepEqual(actual, {
      target: target1,
      from: 0,
      to: 1000,
      plugin: 'props',
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    })
  })

  it('decomposes and then re-composes a single set of keyframes', () => {
    /* Test code */
    const target = {}

    const timeline = animate()
      .add({
        duration: 1000,
        targets: target,
        props: {
          opacity: [0, 1]
        }
      })

    const actual = timeline.getEffects()
 
    assert.deepEqual<{}>(actual, [{
      target,
      from: 0,
      to: 1000,
      plugin: 'props',
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    }])
  })

  it('decomposes and then re-composes a single set of keyframes for multiple targets', () => {
    /* Test code */
    const target1 = { id: 'element1' }
    const target2 = { id: 'element2' }

    const timeline = animate()
      .add({
        duration: 1000,
        targets: [target1],
        props: {
          opacity: [0, 1]
        }
      })
      .add({
        duration: 1000,
        targets: [target2],
        props: {
          number: [0, 200]
        }
      })

    const actual = timeline.getEffects()
 
    assert.deepEqual<{}>(actual, [{
      target: target1,
      from: 0,
      to: 1000,
      plugin: 'props',
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    },
    {
      target: target2,
      from: 1000,
      to: 2000,
      plugin: 'props',      
      prop: 'number',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 200 }
      ]
    }])
  })

  it('functions on properties resolve target', () => {
    /* Test code */
    const target1 = { opacity: .1 }
    const target2 = { opacity: .2 }

    const opacityFromTarget = (target: {}) => {
      return (target as any).opacity;
    }

    const timeline = animate({
      duration: 1000,
      targets: [target1, target2],
      props: {
        opacity: [opacityFromTarget, 1]
      }
    })

    const actual = timeline.getEffects() 
    
    assert.deepEqual<{}>(actual, [{
      target: { opacity: .1 },
      from: 0,
      to: 1000,
      plugin: 'props',            
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: .1 },
        { offset: 1, value: 1 }
      ]
    }, {
      target: { opacity: .2 },
      from: 0,
      to: 1000,
      plugin: 'props',            
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: .2 },
        { offset: 1, value: 1 }
      ]
    }])
  })

  it('functions on properties resolve index', () => {
    /* Test code */
    const target1 = {}
    const target2 = {}

    const opacityFromIndex = (_target: {}, index: number) => {
      return .1 * (index + 1)
    }

    const timeline = animate({
      duration: 1000,
      targets: [target1, target2],
      props: {
        opacity: [opacityFromIndex, 1]
      }
    })

    const actual = timeline.getEffects()
    const expected = [{
      target: {},
      from: 0,
      to: 1000,
      plugin: 'props',  
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: .1 },
        { offset: 1, value: 1 }
      ]
    }, {
      target: {},
      from: 0,
      to: 1000,
      plugin: 'props',  
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: .2 },
        { offset: 1, value: 1 }
      ]
    }]

    assert.deepEqual<{}>(actual, expected)
  })

  it('only first value for opacity at an offset is kept, others are ignored', () => {
    /* Test code */
    const target1 = {}
    const timeline = animate({
      duration: 1000,
      targets: [target1],
      props: {
        opacity: [
          { value: 0, offset: 0 },
          { value: 1, offset: 0 },
          { value: 1, offset: 1 },
          { value: 0, offset: 1 }
        ]
      }
    })

    const actual = timeline.getEffects()[0]

    const expected = {
      target: {},
      from: 0,
      to: 1000,
      plugin: 'props',  
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    }
    assert.deepEqual<{}>(actual, expected)
  })
})
