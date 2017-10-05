import { timeline } from '../../src/main'
import * as chai from 'chai'
const { assert } = chai

describe('custom-ease', () => {
  it('handles a simple ease on props', () => {
    const target = { opacity: 0 }

    const t1 = timeline()

    t1.animate({
      targets: target,
      duration: 1000,
      easing: _o => 1,
      props: {
        opacity: [0, 1]
      }
    })

    t1.seek(200)

    assert.equal(target.opacity, 1)
  })

  it('handles a simple ease as a reference', () => {
    const target = { opacity: 0 }

    const t1 = timeline({
      references: {
        superCoolEasing: (_o: number) => 1
      }
    })

    t1.animate({
      targets: target,
      duration: 1000,
      props: {
        opacity: {
          value: [0, 1],
          easing: '@superCoolEasing'
        }
      }
    })

    t1.seek(200)

    assert.equal(target.opacity, 1)
  })

  it('handles a simple ease on value keyframes', () => {
    const target = { opacity: 0 }

    const t1 = timeline()

    t1.animate({
      targets: target,
      duration: 1000,
      props: {
        opacity: [{ value: 0, easing: _o => 1, offset: 0 }, { value: 1, easing: _o => 1, offset: 1 }]
      }
    })

    t1.seek(200)

    assert.equal(target.opacity, 1)
  })
})
