import * as chai from 'chai'
const assert = chai.assert

import { animate, timeline } from '../../src/main'
import { addPlugin, removePlugin } from '../../src/lib/plugins'
import { waapiPlugin } from '../../src/web/index'
import { getEffects, fromModel } from '../../src/lib/effects'

describe('basic', () => {
  before(() => addPlugin(waapiPlugin))
  after(() => removePlugin(waapiPlugin))

  it('infers offsets and consolidates animations by property on the same target', () => {
    /* Test code */
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate()
      .fromTo(200, 500, {
        targets: target,
        easing: 'linear',
        web: {
          opacity: [0, 0.5, 1],
          left: [0, { offset: 0.2, value: 40 }, 0, { offset: 0.8, value: 90 }, 100]
        }
      })
      .fromTo(600, 1000, {
        targets: [target],
        easing: 'linear',
        web: {
          opacity: [1, 0],
          left: [100, 0]
        }
      })

    const actual = getEffects(fromModel(t1))

    assert.deepEqual(actual, [
      {
        target: target,
        from: 200,
        to: 1000,
        plugin: 'web',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 0.1875, value: 0.5, easing: 'linear', interpolate: undefined },
          { offset: 0.375, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 0.5, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: target,
        from: 200,
        to: 1000,
        plugin: 'web',
        prop: 'left',
        keyframes: [
          { offset: 0, value: '0px', easing: 'linear', interpolate: undefined },
          { offset: 0.075, value: '40px', easing: 'linear', interpolate: undefined },
          { offset: 0.15, value: '0px', easing: 'linear', interpolate: undefined },
          { offset: 0.3, value: '90px', easing: 'linear', interpolate: undefined },
          { offset: 0.375, value: '100px', easing: 'linear', interpolate: undefined },
          { offset: 0.5, value: '100px', easing: 'linear', interpolate: undefined },
          { offset: 1, value: '0px', easing: 'linear', interpolate: undefined }
        ]
      }
    ])
    document.body.removeChild(target)
  })

  it('resolves a CSS selector', () => {
    /* Test code */
    const el1 = document.createElement('div')
    el1.classList.add('single-target-element')
    document.body.appendChild(el1)

    const el2 = document.createElement('div')
    el2.classList.add('single-target-element')
    document.body.appendChild(el2)

    const t1 = animate({
      duration: 1000,
      targets: '.single-target-element',
      easing: 'linear',
      web: {
        opacity: [0, 1]
      }
    })

    const actual = getEffects(fromModel(t1))

    document.body.removeChild(el1)
    document.body.removeChild(el2)

    assert.deepEqual(actual, [
      {
        plugin: 'web',
        target: el1,
        prop: 'opacity',
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        plugin: 'web',
        target: el2,
        prop: 'opacity',
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ])
  })

  it('handles seeking to 0%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      web: {
        opacity: [0, 1]
      }
    })

    t1.pause()
    t1.currentTime = 0

    assert.equal(+getComputedStyle(target).opacity, 0)
  })

  it('handles seeking t0 50%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      web: {
        opacity: [0, 1]
      }
    })

    t1.pause()
    t1.currentTime = 500
    assert.equal(+getComputedStyle(target).opacity, 0.5)
  })

  it('handles seeking to 100%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      web: {
        opacity: [0, 1]
      }
    })

    t1.pause()

    t1.currentTime = 1000
    assert.equal(+getComputedStyle(target).opacity, 1)
  })

  it('handles inferring start/end offsets', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = animate({
      targets: target,
      easing: 'linear',
      duration: 1000,
      web: {
        opacity: [0, { offset: 0.4, value: 1 }, 0]
      }
    })

    t1.pause()

    t1.currentTime = 0
    assert.approximately(+getComputedStyle(target).opacity, 0, 0.0001)

    t1.currentTime = 200
    assert.approximately(+getComputedStyle(target).opacity, 0.5, 0.0001)

    t1.currentTime = 400
    assert.approximately(+getComputedStyle(target).opacity, 1, 0.0001)

    t1.currentTime = 700
    assert.approximately(+getComputedStyle(target).opacity, 0.5, 0.0001)

    t1.currentTime = 1000
    assert.approximately(+getComputedStyle(target).opacity, 0, 0.0001)

    document.body.removeChild(target)
  })

  it('handles split definitions on the same target', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = timeline()

    t1.fromTo(200, 800, {
      targets: target,
      easing: 'linear',
      web: {
        opacity: [0, 1]
      }
    })

    t1.fromTo(800, 1000, {
      targets: target,
      easing: 'linear',
      web: {
        x: [0, 100]
      }
    })

    t1.pause()
    t1.currentTime = 0

    assert.equal(+getComputedStyle(target).opacity, 0)
  })

  it('handles split definition on the same property', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = timeline()

    t1.fromTo(200, 800, {
      targets: target,
      easing: 'linear',
      web: {
        opacity: [0, 1]
      }
    })

    t1.fromTo(800, 1000, {
      targets: target,
      easing: 'linear',
      web: {
        opacity: [1, 0]
      }
    })

    const actual = getEffects(fromModel(t1))
    assert.deepEqual(actual, [
      {
        plugin: 'web',
        target: target,
        prop: 'opacity',
        from: 200,
        to: 1000,
        keyframes: [
          {
            easing: 'linear',
            offset: 0,
            value: 0,
            interpolate: undefined
          },
          {
            easing: 'linear',
            offset: 0.75,
            value: 1,
            interpolate: undefined
          },
          {
            easing: 'linear',
            offset: 1,
            value: 0,
            interpolate: undefined
          }
        ]
      }
    ])
  })
})
