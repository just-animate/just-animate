import { animate } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('timeline.to()', () => {
  it('infers 1000 duration when position is 0 and to is 1000', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate()
    timeline.to(1000, {
      targets: target,
      props: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    assert.equal(timeline.duration, 1000)
    
    timeline.currentTime = 0
    assert.approximately(+getComputedStyle(target).opacity, 0, .0001)
    
    timeline.currentTime = 500
    assert.approximately(+getComputedStyle(target).opacity, .5, .0001)
    
    timeline.currentTime = 1000
    assert.approximately(+getComputedStyle(target).opacity, 1, .0001)
  });
  
  it('infers 1000 duration when from is 500 and to is 1500', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate()
    timeline.to(1500, {
      from: 500,
      targets: target,
      props: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    assert.equal(timeline.duration, 1500)
    
    timeline.currentTime = 0
    assert.approximately(+getComputedStyle(target).opacity, 0, .0001)
    
    timeline.currentTime = 500
    assert.approximately(+getComputedStyle(target).opacity, 0, .0001)
    
    timeline.currentTime = 1000
    assert.approximately(+getComputedStyle(target).opacity, .5, .0001)
    
    timeline.currentTime = 1500
    assert.approximately(+getComputedStyle(target).opacity, 1, .0001)
  });
});
