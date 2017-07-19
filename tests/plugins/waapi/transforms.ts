import { animate } from '../../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('transforms', () => {
  it('uses transform over shorthand properties', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      stagger: 80,
      props: {
        y: [0, 200, 0],
        rotate: [0, 180, 360],
        transform: ['none', 'none', 'none']
      }
    })
    timeline.pause()

    timeline.currentTime = 0
    assert.equal(getComputedStyle(target).transform, 'none');

    timeline.currentTime = 500
    assert.equal(getComputedStyle(target).transform, 'none');

    document.body.removeChild(target)
  });

  it('combines multiple shorthand properties in property order', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      stagger: 80,
      props: {
        y: [0, 200, 0],
        rotate: [0, 180, 360]
      }
    })
    timeline.pause()

    timeline.currentTime = 0
    assert.equal(getComputedStyle(target).transform, 'matrix(1, 0, 0, 1, 0, 0)');

    timeline.currentTime = 500
    assert.equal(getComputedStyle(target).transform, 'matrix(-0.876307, 0.481754, -0.481754, -0.876307, 0, 168)');

    document.body.removeChild(target)
  });
});
