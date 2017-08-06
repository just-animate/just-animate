import * as chai from 'chai';
const assert = chai.assert

import { animate } from '../../src/main'
import { addPlugin, removePlugin } from '../../src/lib/plugins'
import { waapiPlugin } from '../../src/web/index'

describe('basic', () => {
  before(() => addPlugin(waapiPlugin))
  after(() => removePlugin(waapiPlugin))

  it('infers offsets and consolidates animations by property on the same target', () => {
    /* Test code */
    const target = document.createElement('div')
    document.body.appendChild(target)
 
    const timeline = animate()
      .fromTo(200, 500, {
        targets: target,
        web: {
          opacity: [0, .5, 1],
          left: [
            0,
            { offset: .2, value: 40 },
            0,
            { offset: .8, value: 90 },
            100
          ]
        }
      })
      .fromTo(600, 1000, {
        targets: [target],
        web: {
          opacity: [1, 0],
          left: [100, 0]
        }
      })

    const actual = timeline.getEffects()

    const expected = [{
      target: target,
      from: 200,
      to: 1000,
      plugin: 'web',
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 0.1875, value: 0.5 },
        { offset: 0.375, value: 1 },
        { offset: 0.5, value: 1 },
        { offset: 1, value: 0 }
      ]
    }, {
      target: target,
      from: 200,
      to: 1000,
      plugin: 'web',      
      prop: 'left',
      keyframes: [
        { offset: 0, value: '0px' },
        { offset: 0.075, value: '40px' },
        { offset: 0.15, value: '0px' },
        { offset: 0.3, value: '90px' },
        { offset: 0.375, value: '100px' },
        { offset: 0.5, value: '100px' },
        { offset: 1, value: '0px' }
      ]
    }];

    assert.deepEqual(actual, expected)
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

    const timeline = animate({
      duration: 1000,
      targets: '.single-target-element',
      web: {
        opacity: [0, 1]
      }
    })

    const actual = timeline.getEffects()
    const expected = [{
      target: el1,
      from: 0,
      to: 1000,
      plugin: 'web',      
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    }, {
      target: el2,
      from: 0,
      to: 1000,
      plugin: 'web',      
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    }]

    document.body.removeChild(el1)
    document.body.removeChild(el2)
    assert.deepEqual(actual, expected)
  })

  it('handles seeking to 0%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      web: {
        opacity: [0, 1]
      }
    })

    timeline.pause()
    timeline.currentTime = 0

    assert.equal(+getComputedStyle(target).opacity, 0)
  });

  it('handles seeking t0 50%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      web: {
        opacity: [0, 1]
      }
    })

    timeline.pause()
    timeline.currentTime = 500
    assert.equal(+getComputedStyle(target).opacity, .5)
  });

  it('handles seeking to 100%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      web: {
        opacity: [0, 1]
      }
    })

    timeline.pause()

    timeline.currentTime = 1000
    assert.equal(+getComputedStyle(target).opacity, 1)
  });

  it('handles inferring start/end offsets', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      web: {
        opacity: [0, { offset: .4, value: 1 }, 0]
      }
    })

    timeline.pause()

    timeline.currentTime = 0
    assert.approximately(+getComputedStyle(target).opacity, 0, .0001)

    timeline.currentTime = 200
    assert.approximately(+getComputedStyle(target).opacity, .5, .0001)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(target).opacity, 1, .0001)

    timeline.currentTime = 700
    assert.approximately(+getComputedStyle(target).opacity, .5, .0001)

    timeline.currentTime = 1000
    assert.approximately(+getComputedStyle(target).opacity, 0, .0001)

    document.body.removeChild(target)
  });
});
