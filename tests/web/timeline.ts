import { animate } from '../../src/main'
import { waapiPlugin } from '../../src/web'
import { addPlugin, removePlugin } from '../../src/lib/plugins'
import * as chai from 'chai'
const { assert } = chai

describe('timeline.add()', () => {
  before(() => addPlugin(waapiPlugin))
  after(() => removePlugin(waapiPlugin))

  it('adds no offset at 0', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate()
      .add({
        targets: target,
        duration: 1000,
        web: {
          opacity: [0, 1]
        }
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

  it('adds no offset at 0', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate()
      .add({
        targets: target,
        from: 500,
        duration: 1000,
        web: {
          opacity: [0, 1]
        }
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
