import { animate, timeline } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('labels', () => {
  it('can be set declaratively and seeked', () => {
    const t1 = timeline({
      labels: {
        first: 200,
        second: 400
      }
    })

    t1.seek('first')
    assert.equal(t1.currentTime, 200)

    t1.seek('second')
    assert.equal(t1.currentTime, 400)
  })

  it('places labels at the current position inthe timeline', () => {
    const t1 = animate({
      targets: {},
      duration: 1000,
      props: {
          x: [0, 200]
      }
    })

    assert.equal(t1.duration, 1000)

    t1.setLabel('second')
    t1.setLabel('first', 500)

    assert.equal(t1.getLabel('first'), 500)
    assert.equal(t1.getLabel('second'), 1000)
  })
  
  it('can be cleared from the timeline', () => {
    const t1 = animate({
      targets: {},
      duration: 1000,
      props: {
          x: [0, 200]
      }
    })
 
    t1.setLabel('first', 500) 
    assert.equal(t1.getLabel('first'), 500)
    
    t1.clearLabel('first')
    assert.equal(t1.getLabel('first'), undefined)  
  })  
  
  it('labels fire as an events when tick walks over them', (done) => {
    const t1 = animate({
      targets: {},
      duration: 1000,
      props: {
          x: [0, 200]
      }
    })
 
    t1.setLabel('first', 500)  
    
    t1.once('first', () => {
      assert.approximately(t1.currentTime, 500, 34)
      t1.destroy()
      done()
    })
    
    t1.play()
  })  
  
  it('labels fire only once when tick walks over them', (done) => {
    const t1 = animate({
      targets: {},
      duration: 1000,
      props: {
          x: [0, 200]
      }
    })
 
    t1.setLabel('first', 500)  
    
    let iterations = 0
    t1.on('first', () => { 
      iterations++
    })
    
    t1.play()
    
    t1.once('finish', () => { 
      assert.equal(iterations, 1)
      done()
    })
  })  
   
})
