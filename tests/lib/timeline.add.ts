import { timeline } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('timeline.add()', () => {
  it('adds no offset at 0', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = timeline().add({
      targets: target,
      duration: 1000,
      props: {
        opacity: [0, 1]
      }
    })

    t1.pause()

    assert.equal(t1.duration, 1000)
  })

  it('adds no offset at 0', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const t1 = timeline().add({
      targets: target,
      from: 500,
      duration: 1000,
      props: {
        opacity: [0, 1]
      }
    })

    t1.pause()

    assert.equal(t1.duration, 1500)
  })
})
