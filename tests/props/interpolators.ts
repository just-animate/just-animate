import * as chai from 'chai';
const assert = chai.assert

import { animate } from '../../src/main'

describe('interpolators', () => { 
  it('use the left keyframe\'s interpolator', () => {
    /* Test code */
    const target = { background: '' }
 
    function hueInterpolator(left: number, right: number, offset: number) {
      console.log('was here')
      return 'hsl(' + Math.round(left + ((right - left) * offset)) + ', 50%, 50%)'
    }
    
    const timeline = animate({
      targets: target,
      easing: 'linear',  
      duration: 1000,
      props: {
        background: [
          { offset: 0, value: 0, interpolate: hueInterpolator },
          { offset: 1, value: 360 }
        ]
      }
    })
    
    timeline.pause()
    
    timeline.seek(250)
    assert.equal(target.background, 'hsl(90, 50%, 50%)') 
    
    timeline.seek(500)
    assert.equal(target.background, 'hsl(180, 50%, 50%)') 
    
    timeline.seek(750)
    assert.equal(target.background, 'hsl(270, 50%, 50%)') 
  })
});
