import { animate } from '../../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('transforms', () => {
  it('throws an error if the user attempts to use transform and shorthand properties together', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    function throwsError() {
      const timeline = animate({
        targets: target,
        duration: 1000,
        stagger: 80,
        props: [
          { transform: 'none' },
          { y: 360 }
        ]
      })

      timeline.getEffects()
    }

    assert.throws(throwsError, 'mixing transform and shorthand properties is not allowed')

    document.body.removeChild(target)
  });
  
  it('leaves transform intact', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
        targets: target,
        duration: 1000,
        props: [
          { transform: 'none' },
          { transform: 'rotate(180deg)' },
          { transform: 'none' }
        ]
      })

    const actual = timeline.getEffects()

    assert.deepEqual(actual, [{
      target: target,
      from: 0,
      to: 1000,
      prop: 'transform',
      keyframes: [
        { offset: 0, value: 'none' },
        { offset: .5, value: 'rotate(180deg)' },
        { offset: 1, value: 'none' }
      ]
    }]);

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

  it('infers missing transform properties and maintains property order in property syntax', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      stagger: 80,
      props: {
        y: [0, 200, 0],
        rotate: [0, 360]
      }
    })

    timeline.pause()

    timeline.currentTime = 0
    assert.equal(getComputedStyle(target).transform, 'matrix(1, 0, 0, 1, 0, 0)');

    timeline.currentTime = 500
    assert.equal(getComputedStyle(target).transform, 'matrix(-0.876307, 0.481754, -0.481754, -0.876307, 0, 168)');

    document.body.removeChild(target)
  });

  it('infers missing transform properties and maintains property order in keyframe syntax', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      stagger: 80,
      props: [
        { y: 0, rotate: 0 },
        { y: 200 },
        { y: 0, rotate: 360 }
      ]
    })

    timeline.pause()

    timeline.currentTime = 0
    assert.equal(getComputedStyle(target).transform, 'matrix(1, 0, 0, 1, 0, 0)');

    timeline.currentTime = 500
    assert.equal(getComputedStyle(target).transform, 'matrix(-0.876307, 0.481754, -0.481754, -0.876307, 0, 168)');

    document.body.removeChild(target)
  });

  it('fills transform properties with the first available property in either direction', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      props: [
        { rotate: 180 },
        { y: 120 },
        { y: 0 }
      ]
    })
    const actual = timeline.getEffects()

    assert.deepEqual(actual, [{
      target: target,
      from: 0,
      to: 1000,
      prop: 'transform',
      keyframes: [
        { offset: 0, value: 'rotate(180deg)' },
        { offset: .5, value: 'rotate(180deg) translateY(120px)' },
        { offset: 1, value: 'rotate(180deg) translateY(0px)' }
      ]
    }]);

    document.body.removeChild(target)
  });
});
