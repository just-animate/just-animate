import * as chai from 'chai'
import { animate, timeline } from '../../src/main'
const { assert } = chai

describe('events', () => {
  it('can be subscribed', done => {
    const t1 = animate({
      targets: {},
      duration: 100,
      props: { x: 1000 }
    })

    t1.on('update', () => {
      t1.destroy()
      done()
    })

    t1.play()
  })

  it('can be unsubscribed', done => {
    const t1 = animate({
      targets: {},
      duration: 100,
      props: { x: 1000 }
    })

    let iterations = 0
    const handler = () => {
      iterations++
    }
    t1.on('update', handler)
    t1.off('update', handler)

    t1.on('finish', () => {
      assert.equal(iterations, 0)
      t1.destroy()
      done()
    })
    t1.play()
  })

  it('on() passes the timeline itself to the handler', done => {
    const t1 = animate({
      targets: {},
      duration: 100,
      props: { x: 1000 }
    })

    t1.on('update', t2 => {
      assert.equal(t1, t2)
      t1.destroy()
      done()
    })

    t1.play()
  })

  it('once() only handles the event one time', done => {
    var iterations = 0

    const t1 = timeline()
      .animate({
        targets: { x: 200 },
        duration: 200,
        props: { x: 0 }
      })
      .on('finish', () => {
        assert.equal(iterations, 1)
        t1.destroy()
        done()
      })

    t1.once('update', _ => {
      iterations++
    })

    t1.play()
  })

  it('once() passes an instance of the timeline to the handler', done => {
    const t1 = animate({
      targets: { x: 200 },
      duration: 200,
      props: { x: 0 }
    })

    t1.once('finish', t2 => {
      assert.equal(t1, t2)
      t1.destroy()
      done()
    })

    t1.play()
  })
})
