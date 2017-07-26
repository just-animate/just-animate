import { animate } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('timeline.add()', () => {
  it('adds no offset at 0', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate()
      .add({
        targets: target,
        duration: 1000,
        props: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      })
    
    timeline.pause()
    
    assert.equal(timeline.duration, 1000)
  });
  
  it('adds no offset at 0', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate()
      .add({
        targets: target,
        from: 500,
        duration: 1000,
        props: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      })
    
    timeline.pause()
      
    assert.equal(timeline.duration, 1500)
  });
});
