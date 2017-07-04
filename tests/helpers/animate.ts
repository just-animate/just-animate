import { animate } from '../../src/helpers'
import * as chai from 'chai'
const { assert } = chai

describe('sequence', () => {
  it('handles seeking to 0%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    timeline.currentTime = 0
    assert.equal(+getComputedStyle(target).opacity, 0)
  });

  it('handles seeking t0 50%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()
    timeline.currentTime = 500
    assert.equal(+getComputedStyle(target).opacity, .5)
  });

  it('handles seeking to 100%', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    timeline.currentTime = 1000
    assert.equal(+getComputedStyle(target).opacity, 1)
  });

  it('handles inferring start/end offsets', () => {
    const target = document.createElement('div')
    document.body.appendChild(target)

    const timeline = animate({
      targets: target,
      duration: 1000,
      css: [
        { opacity: 0 },
        { opacity: 1, offset: .4 },
        { opacity: 0 }
      ]
    })
    
    timeline.pause()

    timeline.currentTime = 0
    assert.approximately(+getComputedStyle(target).opacity, 0, .0001)

    timeline.currentTime = 200
    assert.approximately(+getComputedStyle(target).opacity, .5, .0001)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(target).opacity, 1, .0001)

    timeline.currentTime = 700
    assert.approximately(+getComputedStyle(target).opacity, .5, .0001)

    timeline.currentTime = 1000
    assert.approximately(+getComputedStyle(target).opacity, 0, .0001)

    document.body.removeChild(target)
  });

  it('staggers targets', () => {
    const targets = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]
    targets.forEach(element => {
      document.body.appendChild(element)
    });

    const timeline = animate({
      targets: targets,
      duration: 1000,
      stagger: 100,
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    assert.equal(timeline.duration, 1400)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(targets[0]).opacity, .3, .0001)
    assert.approximately(+getComputedStyle(targets[1]).opacity, .2, .0001)
    assert.approximately(+getComputedStyle(targets[2]).opacity, .1, .0001)
    assert.approximately(+getComputedStyle(targets[3]).opacity, 0, .0001)

    targets.forEach(element => {
      document.body.removeChild(element)
    });
  });

  it('delay/staggers targets', () => {
    const targets = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]
    targets.forEach(element => {
      document.body.appendChild(element)
    });

    const timeline = animate({
      targets: targets,
      duration: 1000,
      delay: '+=100ms',
      css: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    })
    
    timeline.pause()

    assert.equal(timeline.duration, 1400)

    timeline.currentTime = 400
    assert.approximately(+getComputedStyle(targets[0]).opacity, .3, .0001)
    assert.approximately(+getComputedStyle(targets[1]).opacity, .2, .0001)
    assert.approximately(+getComputedStyle(targets[2]).opacity, .1, .0001)
    assert.approximately(+getComputedStyle(targets[3]).opacity, 0, .0001)
  });

  describe('elements', () => {
    it('decomposes and then re-composes a single set of keyframes', () => {
      /* Test code */
      const target = {}

      const timeline = animate()
        .to(1000, {
          targets: [target],
          css: [
            { opacity: 0 },
            { opacity: 1 }
          ]
        }) 

      const actual = timeline.getEffects()
      const expected = [{
        target: {},
        from: 0,
        to: 1000, 
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }]

      assert.deepEqual<{}>(actual, expected)
    })

    it('decomposes and then re-composes a single set of keyframes', () => {
      /* Test code */
      const target = {}

      const timeline = animate()
        .add({
          duration: 1000,
          targets: [target],
          css: [
            { opacity: 0 },
            { opacity: 1 }
          ]
        })

      const actual = timeline.getEffects()
      const expected = [{
        target,
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }] 
      assert.deepEqual<{}>(actual, expected)
    })

    it('decomposes and then re-composes a single set of keyframes for multiple targets', () => {
      /* Test code */
      const target1 = { id: 'element1' }
      const target2 = { id: 'element2' }

      const timeline = animate()
        .to(1000, {
          targets: [target1],
          css: [
            { opacity: 0 },
            { opacity: 1 }
          ]
        })
        .to(2000, {
          targets: [target2],
          css: [
            { x: 0 },
            { x: 200 }
          ]
        })

      const actual = timeline.getEffects()
      const expected = [{
        target: target1,
        from: 0,
        to: 1000, 
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      },
      {
        target: target2,
        from: 1000,
        to: 2000, 
        keyframes: [
            { offset: 0, transform: 'translateX(0px)' },
            { offset: 1, transform: 'translateX(200px)' }
          ]
      }]

      assert.deepEqual<{}>(actual, expected)
    })

    it('functions on properties resolve target', () => {
      /* Test code */
      const target1 = { opacity: .1 }
      const target2 = { opacity: .2 }

      const opacityFromTarget = (target: {}) => {
        return (target as any).opacity;
      }

      const timeline = animate()
        .to(1000, {
          targets: [target1, target2],
          css: [
            { opacity: opacityFromTarget },
            { opacity: 1 }
          ]
        })

      const actual = timeline.getEffects()
      const expected = [{
        target: { opacity: .1 },
        from: 0,
        to: 1000, 
        keyframes: [
          { offset: 0, opacity: .1 },
          { offset: 1, opacity: 1 }
        ]
      }, {
        target: { opacity: .2 },
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: .2 },
          { offset: 1, opacity: 1 }
        ]
      }]

      assert.deepEqual<{}>(actual, expected)
    })

    it('functions on properties resolve index', () => {
      /* Test code */
      const target1 = {}
      const target2 = {}

      const opacityFromIndex = (_target: {}, index: number) => {
        return .1 * (index + 1)
      }

      const timeline = animate()
        .to(1000, {
          targets: [target1, target2],
          css: [
            { opacity: opacityFromIndex },
            { opacity: 1 }
          ]
        })

      const actual = timeline.getEffects()
      const expected = [{
        target: {},
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: .1 },
          { offset: 1, opacity: 1 }
        ]
      }, {
        target: {},
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: .2 },
          { offset: 1, opacity: 1 }
        ]
      }]

      assert.deepEqual<{}>(actual, expected)
    })

    it('only last value for opacity at an offset is kept, others are ignored', () => {
      /* Test code */
      const target1 = {}
      const timeline = animate()
        .to(1000, {
          targets: [target1],
          css: [
            { opacity: 0, offset: 0 },
            { opacity: 1, offset: 0 },
            { opacity: 1 }
          ]
        })

      const actual = timeline.getEffects()[0]
      const expected = {
        target: {},
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 1 },
          { offset: 1, opacity: 1 }
        ]
      }
      assert.deepEqual<{}>(actual, expected)
    })

    it('infers offsets and consolidates animations by property on the same target', () => {
      /* Test code */
      const target = {}

      const timeline = animate()
        .fromTo(200, 500, {
          targets: [target],
          css: [
            { opacity: 0, x: 0 },
            { offset: .2, x: 40 },
            { opacity: .5, x: 0 },
            { offset: .8, x: 90 },
            { opacity: 1, x: 100 }
          ]
        })
        .fromTo(600, 1000, {
          targets: [target],
          css: [
            { opacity: 1, x: 100 },
            { opacity: 0, x: 0 }
          ]
        })

      const actual = timeline.getEffects()
      const expected = [{
        target: {},
        from: 200,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 0.15, opacity: 0.5 },
          { offset: 0.375, opacity: 1 },
          { offset: 0.5, opacity: 1 },
          { offset: 1, opacity: 0 }
        ]
      }, {
        target: {},
        from: 200,
        to: 1000,
        keyframes: [
          { offset: 0, transform: 'translateX(0px)' },
          { offset: 0.075, transform: 'translateX(40px)' },
          { offset: 0.15, transform: 'translateX(0px)' },
          { offset: 0.3, transform: 'translateX(90px)' },
          { offset: 0.375, transform: 'translateX(100px)' },
          { offset: 0.5, transform: 'translateX(100px)' },
          { offset: 1, transform: 'translateX(0px)' }
        ]
      }];

      assert.deepEqual<{}>(actual, expected)
    })

    it('resolves single target', () => {
      /* Test code */
      const target1 = {}
      const timeline = animate()
        .to(1000, {
          targets: target1,
          css: [
            { opacity: 0 },
            { opacity: 1 }
          ]
        })

      const actual = timeline.getEffects()[0]
      const expected = {
        target: target1,
        from: 0,
        to: 1000,
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }
      assert.deepEqual<{}>(actual, expected)
    })

    it('resolves a CSS selector', () => {
      /* Test code */
      const el1 = document.createElement('div')
      el1.classList.add('single-target-element')
      document.body.appendChild(el1)

      const el2 = document.createElement('div')
      el2.classList.add('single-target-element')
      document.body.appendChild(el2)

      const timeline = animate()
        .to(1000, {
          targets: '.single-target-element',
          css: [
            { opacity: 0 },
            { opacity: 1 }
          ]
        })

      const actual = timeline.getEffects()
      const expected = [{
        target: el1,
        from: 0,
        to: 1000, 
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }, {
        target: el2,
        from: 0,
        to: 1000, 
        keyframes: [
          { offset: 0, opacity: 0 },
          { offset: 1, opacity: 1 }
        ]
      }]

      document.body.removeChild(el1)
      document.body.removeChild(el2)
      assert.deepEqual<{}>(actual, expected)
    })
  })

});
