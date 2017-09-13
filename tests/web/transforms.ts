import * as assert from 'assert'
import { animate } from '../../src/main'
import { addPlugin, removePlugin } from '../../src/lib/plugins'
import { waapiPlugin } from '../../src/web/index'
import { fromModel, getEffects } from '../../src/lib/effects'

describe('transforms', () => {
  before(() => addPlugin(waapiPlugin))
  after(() => removePlugin(waapiPlugin))

  it('throws an error if the user attempts to use transform and shorthand properties together', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    function throwsError() {
      const timeline = animate({
        targets: target,
        easing: 'linear',
        duration: 1000,
        stagger: 80,
        web: {
          transform: ['none'],
          y: [undefined, 360]
        }
      })

      getEffects(fromModel(timeline))
    }

    assert.throws(throwsError, 'mixing transform and shorthand properties is not allowed')

    document.body.removeChild(target)
  })

  it('leaves transform intact', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      web: {
        transform: ['none', 'rotate(180deg)', 'none']
      }
    })

    const actual = getEffects(fromModel(t1))

    assert.deepEqual(actual, [
      {
        target: target,
        from: 0,
        to: 1000,
        plugin: 'web',
        prop: 'transform',
        keyframes: [
          { offset: 0, value: 'none', easing: 'linear', interpolate: undefined },
          { offset: 0.5, value: 'rotate(180deg)', easing: 'linear', interpolate: undefined },
          { offset: 1, value: 'none', easing: 'linear', interpolate: undefined }
        ]
      }
    ])

    document.body.removeChild(target)
  })

  it('leaves units intact', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      web: {
        x: ['10vh', '-20vh', '0.5vh']
      }
    })

    const actual = getEffects(fromModel(t1))

    assert.deepEqual(actual, [
      {
        target: target,
        from: 0,
        to: 1000,
        plugin: 'web',
        prop: 'transform',
        keyframes: [
          { offset: 0, value: 'translateX(10vh)', easing: 'linear', interpolate: undefined },
          { offset: 0.5, value: 'translateX(-20vh)', easing: 'linear', interpolate: undefined },
          { offset: 1, value: 'translateX(0.5vh)', easing: 'linear', interpolate: undefined }
        ]
      }
    ])

    document.body.removeChild(target)
  })

  it('combines multiple shorthand properties in property order', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      stagger: 80,
      web: {
        y: [0, 200, 0],
        rotate: [0, 180, 360]
      }
    })
    timeline.pause()

    timeline.currentTime = 0
    assert.equal(getComputedStyle(target).transform, 'matrix(1, 0, 0, 1, 0, 0)')

    timeline.currentTime = 500
    assert.equal(getComputedStyle(target).transform, 'matrix(-0.876307, 0.481754, -0.481754, -0.876307, 0, 168)')

    document.body.removeChild(target)
  })

  it('infers missing transform properties and maintains property order in property syntax', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      stagger: 80,
      web: {
        y: [0, 200, 0],
        rotate: [0, 360]
      }
    })

    timeline.pause()

    timeline.currentTime = 0
    assert.equal(getComputedStyle(target).transform, 'matrix(1, 0, 0, 1, 0, 0)')

    timeline.currentTime = 500
    assert.equal(getComputedStyle(target).transform, 'matrix(-0.876307, 0.481754, -0.481754, -0.876307, 0, 168)')

    document.body.removeChild(target)
  })

  it('infers missing transform properties and maintains property order in keyframe syntax', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      stagger: 80,
      web: {
        y: [0, 200, 0],
        rotate: [0, 360]
      }
    })
    
    timeline.pause()

    timeline.currentTime = 0
    assert.equal(getComputedStyle(target).transform, 'matrix(1, 0, 0, 1, 0, 0)')

    timeline.currentTime = 500
    assert.equal(getComputedStyle(target).transform, 'matrix(-0.876307, 0.481754, -0.481754, -0.876307, 0, 168)')

    document.body.removeChild(target)
  })

  it('fills transform properties with the first available property in either direction', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      web: {
        rotate: [180, 180],
        y: [{ offset: 0.5, value: 120 }, { offset: 1, value: 0 }]
      }
    })

    const actual = getEffects(fromModel(t1))

    assert.deepEqual(actual, [
      {
        target: target,
        from: 0,
        to: 1000,
        plugin: 'web',
        prop: 'transform',
        keyframes: [
          { offset: 0, value: 'rotate(180deg)', easing: 'linear', interpolate: undefined },
          { offset: 0.5, value: 'rotate(180deg) translateY(120px)', easing: 'linear', interpolate: undefined },
          { offset: 1, value: 'rotate(180deg) translateY(0px)', easing: 'linear', interpolate: undefined }
        ]
      }
    ])

    document.body.removeChild(target)
  })
})
