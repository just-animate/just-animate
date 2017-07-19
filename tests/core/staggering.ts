import { animate } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('staggering', () => {
  it('staggers targets', () => {
    const targets = [
      {}, {}, {}, {}
    ]

    const timeline = animate({
      targets: targets,
      duration: 1000,
      stagger: 100,
      props: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })

    const actual = timeline.getEffects()

    assert.deepEqual(actual, [
      {
        target: {},
        from: 100,
        to: 1100,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      },
      {
        target: {},
        from: 200,
        to: 1200,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      },
      {
        target: {},
        from: 300,
        to: 1300,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      },
      {
        target: {},
        from: 400,
        to: 1400,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }
    ])
  });
});
