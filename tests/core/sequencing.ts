import { sequence } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('sequencing', () => {
  it('handles simple sequencing', () => {
    /* Test code */
    const target1 = {}
    const target2 = {}
    const timeline = sequence([
      {
        duration: 1000,
        targets: target1,
        css: [
          { opacity: 1 },
          { opacity: 0 }
        ]
      },
      {
        duration: 1000,
        targets: target2,
        css: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    ]);

    const actual = timeline.getEffects()
    const expected = [
      {
        target: target1,
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      },
      {
        target: target2,
        from: 1000,
        to: 2000,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }
    ]
    assert.deepEqual<{}>(actual, expected)
  })

  it('handles staggering in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }, { id: 'target2' }, { id: 'target3' }]
    const target2 = { id: 'target4' }
    const timeline = sequence([
      {
        duration: 1000,
        stagger: 100,
        targets: target1,
        css: [
          { opacity: 1 },
          { opacity: 0 }
        ]
      },
      {
        duration: 1000,
        targets: target2,
        css: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    ]);

    const actual = timeline.getEffects()
    const expected = [
      {
        target: { id: 'target1' },
        from: 100,
        to: 1100,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      },
      {
        target: { id: 'target2' },
        from: 200,
        to: 1200,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      },
      {
        target: { id: 'target3' },
        from: 300,
        to: 1300,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      },
      {
        target: { id: 'target4' },
        from: 1300,
        to: 2300,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }
    ]

    assert.deepEqual<{}>(actual, expected)
  })

  it('handles negative delays in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }]
    const target2 = { id: 'target2' }
    const timeline = sequence([
      {
        duration: 1000,
        targets: target1,
        css: [
          { opacity: 1 },
          { opacity: 0 }
        ]
      },
      {
        duration: 1000,
        delay: -500,
        targets: target2,
        css: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    ]);

    const actual = timeline.getEffects()
    const expected = [
      {
        target: { id: 'target1' },
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      },
      {
        target: { id: 'target2' },
        from: 500,
        to: 1500,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }
    ]
    
    assert.deepEqual<{}>(actual, expected)
  })
  
  it('handles positive endDelays in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }]
    const target2 = { id: 'target2' }
    const timeline = sequence([
      {
        duration: 1000,
        endDelay: 500,
        targets: target1,
        css: [
          { opacity: 1 },
          { opacity: 0 }
        ]
      },
      {
        duration: 1000,
        targets: target2,
        css: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    ]);

    const actual = timeline.getEffects()
    const expected = [
      {
        target: { id: 'target1' },
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      },
      {
        target: { id: 'target2' },
        from: 1500,
        to: 2500,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }
    ]
    console.log(JSON.stringify(actual, undefined, 4))
    assert.deepEqual<{}>(actual, expected)
  })
  
  it('handles negative endDelays in sequencing', () => {
    /* Test code */
    const target1 = [{ id: 'target1' }]
    const target2 = { id: 'target2' }
    const timeline = sequence([
      {
        duration: 1000,
        endDelay: -500,
        targets: target1,
        css: [
          { opacity: 1 },
          { opacity: 0 }
        ]
      },
      {
        duration: 1000,
        targets: target2,
        css: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    ]);

    const actual = timeline.getEffects()
    const expected = [
      {
        target: { id: 'target1' },
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      },
      {
        target: { id: 'target2' },
        from: 500,
        to: 1500,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }
    ]
    console.log(JSON.stringify(actual, undefined, 4))
    assert.deepEqual<{}>(actual, expected)
  })
})
