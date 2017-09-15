import { animate, addPlugin, removePlugin } from '../../src/main'
import * as chai from 'chai'
import { waapiPlugin } from '../../src/web/index'
const { assert } = chai

describe('staggering', () => {
  before(() => addPlugin(waapiPlugin))
  after(() => removePlugin(waapiPlugin))

  it('increases the duration to fit staggered targets when active', () => {
    const root = document.createElement('div')
    root.innerHTML = `<i class="one"></i><i class="one"></i><i class="one"></i><i class="one"></i><i class="one"></i>`
    document.body.appendChild(root)

    const t1 = animate({
      targets: 'i.one',
      duration: 1000,
      easing: 'linear',
      stagger: 100,
      web: {
        opacity: [0, 1]
      }
    })

    t1.pause()
    assert.deepEqual(t1.duration, 1500)

    document.body.removeChild(root)
  })
})
