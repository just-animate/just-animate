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
  });
});
