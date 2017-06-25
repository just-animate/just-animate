import { animate } from '../../src/helpers'
import * as chai from 'chai'
const { assert } = chai

describe('sequence', () => {
  it('handles seeking to 0%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })

    timeline.currentTime = 0
    assert.equal(+getComputedStyle(target).opacity, 0)
  });

  it('handles seeking t0 50%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })

    timeline.currentTime = 500
    assert.equal(+getComputedStyle(target).opacity, .5)
  });

  it('handles seeking to 100%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })

    timeline.currentTime = 1000
    assert.equal(+getComputedStyle(target).opacity, 1)
  });

  it('handles inferring start/end offsets', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      fill: 'both',
      css: [
        { opacity: 0 },
        { opacity: 1, offset: .4 },
        { opacity: 0 }
      ]
    })

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
  });

  it('staggers targets', () => {
    const targets = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]
    targets.forEach(element => {
        document.body.appendChild(element)
    });

    const timeline = animate({
      targets: targets,
      duration: 1000,
      stagger: 100,
      fill: 'both',
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })

    assert.equal(timeline.duration, 1400)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(targets[0]).opacity, .3, .0001)
    assert.approximately(+getComputedStyle(targets[1]).opacity, .2, .0001)
    assert.approximately(+getComputedStyle(targets[2]).opacity, .1, .0001)
    assert.approximately(+getComputedStyle(targets[3]).opacity, 0, .0001)
  });
  
  it('delay/staggers targets', () => {
    const targets = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]
    targets.forEach(element => {
        document.body.appendChild(element)
    });

    const timeline = animate({
      targets: targets,
      duration: 1000,
      delay: '+=100ms',
      fill: 'both',
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })

    assert.equal(timeline.duration, 1400)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(targets[0]).opacity, .3, .0001)
    assert.approximately(+getComputedStyle(targets[1]).opacity, .2, .0001)
    assert.approximately(+getComputedStyle(targets[2]).opacity, .1, .0001)
    assert.approximately(+getComputedStyle(targets[3]).opacity, 0, .0001)
  });
});
