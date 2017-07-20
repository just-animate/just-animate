import { animate } from '../../../src/main'
import * as chai from 'chai'
import { waapiPlugin } from '../../../src/plugins/waapi';
import { addPlugin } from '../../../src/core/plugins';
const { assert } = chai

describe('basic', () => {
  addPlugin(waapiPlugin)

  it('infers offsets and consolidates animations by property on the same target', () => {
    /* Test code */
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate()
      .fromTo(200, 500, {
        targets: [target],
        props: [
          { opacity: 0, left: 0 },
          { offset: .2, left: 40 },
          { opacity: .5, left: 0 },
          { offset: .8, left: 90 },
          { opacity: 1, left: 100 }
        ]
      })
      .fromTo(600, 1000, {
        targets: [target],
        props: [
          { opacity: 1, left: 100 },
          { opacity: 0, left: 0 }
        ]
      })

    const actual = timeline.getEffects()

    const expected = [{
      target: target,
      from: 200,
      to: 1000,
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 0.15, value: 0.5 },
        { offset: 0.375, value: 1 },
        { offset: 0.5, value: 1 },
        { offset: 1, value: 0 }
      ]
    }, {
      target: target,
      from: 200,
      to: 1000,
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

    assert.deepEqual<{}>(actual, expected)
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

    const timeline = animate()
      .to(1000, {
        targets: '.single-target-element',
        props: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      })

    const actual = timeline.getEffects()
    const expected = [{
      target: el1,
      from: 0,
      to: 1000,
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    }, {
      target: el2,
      from: 0,
      to: 1000,
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0 },
        { offset: 1, value: 1 }
      ]
    }]

    document.body.removeChild(el1)
    document.body.removeChild(el2)
    assert.deepEqual<{}>(actual, expected)
  })

  it('handles seeking to 0%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      props: [
        { opacity: 0 },
        { opacity: 1 }
      ]
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
      props: [
        { opacity: 0 },
        { opacity: 1 }
      ]
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
      props: [
        { opacity: 0 },
        { opacity: 1 }
      ]
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
      props: [
        { opacity: 0 },
        { opacity: 1, offset: .4 },
        { opacity: 0 }
      ]
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
