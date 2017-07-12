import { animate } from '../../src/helpers'
import * as chai from 'chai'
const { assert } = chai

describe('staggering', () => {
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
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    assert.equal(timeline.duration, 1400)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(targets[0]).opacity, .3, .0001)
    assert.approximately(+getComputedStyle(targets[1]).opacity, .2, .0001)
    assert.approximately(+getComputedStyle(targets[2]).opacity, .1, .0001)
    assert.approximately(+getComputedStyle(targets[3]).opacity, 0, .0001)

    targets.forEach(element => {
      document.body.removeChild(element)
    });
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
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    assert.equal(timeline.duration, 1400)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(targets[0]).opacity, .3, .0001)
    assert.approximately(+getComputedStyle(targets[1]).opacity, .2, .0001)
    assert.approximately(+getComputedStyle(targets[2]).opacity, .1, .0001)
    assert.approximately(+getComputedStyle(targets[3]).opacity, 0, .0001)
  });
});
