import { animate } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('staggering', () => {
  it('staggers targets', () => {
    const targets = [{}, {}, {}, {}]

    const timeline = animate({
      targets: targets,
      duration: 1000,
      easing: 'linear',
      stagger: 100,
      props: {
        opacity: [0, 1]
      }
    })

    const actual = timeline.getEffects()

    assert.deepEqual(actual, [
      {
        target: {},
        from: 100,
        to: 1100,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: {},
        from: 200,
        to: 1200,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: {},
        from: 300,
        to: 1300,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: {},
        from: 400,
        to: 1400,
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
