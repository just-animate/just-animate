import { timeline } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('play option', () => {
  it('from seeks to the appropriate position', () => {
    const t1 = timeline()

    t1.animate({
      targets: {},
      duration: 1000,
      props: {
        x: [0, 1000]
      }
    })

    t1.play({ from: 500 })

    assert.equal(t1.currentTime, 500)
  })

  it('from seeks a label', () => {
    const t1 = timeline()

    t1.animate({
      targets: {},
      duration: 1000,
      props: {
        x: [0, 1000]
      }
    })

    t1.setLabel('middle', 500)

    t1.play({ from: 'middle' })

    assert.equal(t1.currentTime, 500)
  })
  
  it('to automatically pauses on a time', (done) => {
    const t1 = timeline()

    t1.animate({
      targets: {},
      duration: 1000,
      props: {
        x: [0, 1000]
      }
    })

    t1.play({ to: 500 })

    t1.once('pause', () => {
        assert.equal(t1.currentTime, 500);
        done()
    })
  })  

  it('to automatically pauses on a label', (done) => {
    const t1 = timeline()

    t1.animate({
      targets: {},
      duration: 1000,
      props: {
        x: [0, 1000]
      }
    })

    t1.setLabel('middle', 500)

    t1.play({ to: 'middle' })

    t1.once('pause', () => {
        assert.equal(t1.currentTime, 500);
        done()
    })
  })
  
  it('automatically reverses when the label is behind the current position', (done) => {
    const t1 = timeline()

    t1.animate({
      targets: {},
      duration: 1000,
      props: {
        x: [0, 1000]
      }
    })

    t1.setLabel('middle', 500) 
      
    t1.play({ from: 990, to: 'middle' })

    t1.once('pause', () => {
        assert.equal(t1.currentTime, 500);
        done()
    })
  })  
  
  it('automatically reverses when the rate is reversed the label is ahead the current position', (done) => {
    const t1 = timeline()

    t1.animate({
      targets: {},
      duration: 1000,
      props: {
        x: [0, 1000]
      }
    }) 

    t1.setLabel('middle', 500) 
    
    t1.finish()    
      
    t1.play({ from: 990, to: 'middle' })

    t1.once('pause', () => {
        assert.equal(t1.currentTime, 500);
        done()
    })
  })    
})
