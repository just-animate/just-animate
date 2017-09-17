import { sequence } from '../../src/main'
import * as chai from 'chai'
import { getEffects } from '../../src/lib/model/effects'
import { getState } from '../../src/lib/store'
const { assert } = chai

describe('sequencing', () => {
  it('handles simple sequencing', () => {
    /* Test code */
    const target1 = {}
    const target2 = {}
    const t1 = sequence([
      {
        easing: 'linear',
        duration: 1000,
        targets: target1,
        props: {
          opacity: [1, 0]
        }
      },
      {
        easing: 'linear',
        duration: 1000,
        targets: target2,
        props: {
          opacity: [0, 1]
        }
      }
    ])

    const actual = getEffects(getState(t1.id))
    assert.deepEqual(actual, [
      {
        target: target1,
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: target2,
        from: 1000,
        to: 2000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ])
  })

  it('handles staggering in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }, { id: 'target2' }, { id: 'target3' }]
    const target2 = { id: 'target4' }
    const t1 = sequence([
      {
        duration: 1000,
        easing: 'linear',
        stagger: 100,
        targets: target1,
        props: {
          opacity: [1, 0]
        }
      },
      {
        duration: 1000,
        easing: 'linear',
        targets: target2,
        props: {
          opacity: [0, 1]
        }
      }
    ])

    const actual = getEffects(getState(t1.id))
    assert.deepEqual<{}>(actual, [
      {
        target: { id: 'target1' },
        from: 100,
        to: 1100,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: { id: 'target2' },
        from: 200,
        to: 1200,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: { id: 'target3' },
        from: 300,
        to: 1300,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: { id: 'target4' },
        from: 1300,
        to: 2300,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ])
  })

  it('handles negative delays in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }]
    const target2 = { id: 'target2' }
    const t1 = sequence([
      {
        duration: 1000,
        easing: 'linear',
        targets: target1,
        props: {
          opacity: [1, 0]
        }
      },
      {
        duration: 1000,
        easing: 'linear',
        delay: -500,
        targets: target2,
        props: {
          opacity: [0, 1]
        }
      }
    ])

    const actual = getEffects(getState(t1.id))

    assert.deepEqual<{}>(actual, [
      {
        target: { id: 'target1' },
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: { id: 'target2' },
        from: 500,
        to: 1500,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ])
  })

  it('handles positive endDelays in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }]
    const target2 = { id: 'target2' }
    const t1 = sequence([
      {
        duration: 1000,
        easing: 'linear',
        endDelay: 500,
        targets: target1,
        props: {
          opacity: [1, 0]
        }
      },
      {
        duration: 1000,
        easing: 'linear',
        targets: target2,
        props: {
          opacity: [0, 1]
        }
      }
    ])

    const actual = getEffects(getState(t1.id))
    assert.deepEqual<{}>(actual, [
      {
        target: { id: 'target1' },
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: { id: 'target2' },
        from: 1500,
        to: 2500,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ])
  })

  it('handles negative endDelays in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }]
    const target2 = { id: 'target2' }
    const t1 = sequence([
      {
        duration: 1000,
        endDelay: -500,
        easing: 'linear',
        targets: target1,
        props: {
          opacity: [1, 0]
        }
      },
      {
        duration: 1000,
        easing: 'linear',
        targets: target2,
        props: {
          opacity: [0, 1]
        }
      }
    ])

    const actual = getEffects(getState(t1.id))
    assert.deepEqual<{}>(actual, [
      {
        target: { id: 'target1' },
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: { id: 'target2' },
        from: 500,
        to: 1500,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ])
  })
})
