import { animate, timeline } from '../../src/main';
import * as chai from 'chai';
import { getEffects } from '../../src/lib/model/effects';
import { getState } from '../../src/lib/store';
const { assert } = chai;

describe('basic', () => {
  it('resolves single target', () => {
    /* Test code */
    const target1 = {};

    const t1 = animate({
      easing: 'linear',
      duration: 1000,
      targets: target1,
      props: {
        opacity: [0, 1]
      }
    });

    const actual = getEffects(getState(t1.id))[0];

    assert.deepEqual(actual, {
      target: target1,
      from: 0,
      to: 1000,
      plugin: 'props',
      prop: 'opacity',
      keyframes: [
        { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
        { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
      ]
    });

    t1.destroy();
  });

  it('decomposes and then re-composes a single set of keyframes', () => {
    /* Test code */
    const target = {};

    const t1 = animate().add({
      duration: 1000,
      easing: 'linear',
      targets: target,
      props: {
        opacity: [0, 1]
      }
    });

    const actual = getEffects(getState(t1.id));

    assert.deepEqual<{}>(actual, [
      {
        target,
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ]);

    t1.destroy();
  });

  it('decomposes and then re-composes a single set of keyframes for multiple targets', () => {
    /* Test code */
    const target1 = { id: 'element1' };
    const target2 = { id: 'element2' };

    const t1 = animate()
      .add({
        easing: 'linear',
        duration: 1000,
        targets: [target1],
        props: {
          opacity: [0, 1]
        }
      })
      .add({
        easing: 'linear',
        duration: 1000,
        targets: [target2],
        props: {
          number: [0, 200]
        }
      });

    const actual = getEffects(getState(t1.id));

    assert.deepEqual<{}>(actual, [
      {
        target: target1,
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: target2,
        from: 1000,
        to: 2000,
        plugin: 'props',
        prop: 'number',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 200, easing: 'linear', interpolate: undefined }
        ]
      }
    ]);

    t1.destroy();
  });

  it('functions on properties resolve target', () => {
    /* Test code */
    const target1 = { opacity: 0.1 };
    const target2 = { opacity: 0.2 };

    const opacityFromTarget = (target: {}) => {
      return (target as any).opacity;
    };

    const t1 = animate({
      duration: 1000,
      easing: 'linear',
      targets: [target1, target2],
      props: {
        opacity: [opacityFromTarget, 1]
      }
    });

    const actual = getEffects(getState(t1.id));

    assert.deepEqual<{}>(actual, [
      {
        target: { opacity: 0.1 },
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0.1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: { opacity: 0.2 },
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0.2, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ]);

    t1.destroy();
  });

  it('functions on properties resolve index', () => {
    /* Test code */
    const target1 = {};
    const target2 = {};

    const opacityFromIndex = (_target: {}, index: number) => {
      return 0.1 * (index + 1);
    };

    const t1 = animate({
      duration: 1000,
      easing: 'linear',
      targets: [target1, target2],
      props: {
        opacity: [opacityFromIndex, 1]
      }
    });

    const actual = getEffects(getState(t1.id));

    assert.deepEqual<{}>(actual, [
      {
        target: {},
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0.1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: {},
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0.2, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      }
    ]);

    t1.destroy();
  });

  it('only last value for opacity at an offset is kept, others are ignored', () => {
    /* Test code */
    const target1 = {};
    const t1 = animate({
      easing: 'linear',
      duration: 1000,
      targets: [target1],
      props: {
        opacity: [
          { value: 0, offset: 0 },
          { value: 1, offset: 0 },
          { value: 1, offset: 1 },
          { value: 0, offset: 1 }
        ]
      }
    });

    const actual = getEffects(getState(t1.id));

    assert.deepEqual<{}>(actual, [
      {
        target: {},
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 1, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 0, easing: 'linear', interpolate: undefined }
        ]
      }
    ]);

    t1.destroy();
  });

  it('add() accepts an array', () => {
    /* Test code */
    const target1 = { id: 'element1' };
    const target2 = { id: 'element2' };

    const t1 = timeline();
    t1.add([
      {
        easing: 'linear',
        duration: 1000,
        targets: target1,
        props: {
          opacity: [0, 1]
        }
      },
      {
        easing: 'linear',
        duration: 1000,
        targets: target2,
        props: {
          number: [0, 200]
        }
      }
    ]);

    const actual = getEffects(getState(t1.id));

    assert.deepEqual<{}>(actual, [
      {
        target: target1,
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: target2,
        from: 0,
        to: 1000,
        plugin: 'props',
        prop: 'number',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 200, easing: 'linear', interpolate: undefined }
        ]
      }
    ]);

    t1.destroy();
  });

  it('fromTo() accepts an array', () => {
    /* Test code */
    const target1 = { id: 'element1' };
    const target2 = { id: 'element2' };

    const t1 = timeline();
    t1.fromTo(200, 800, [
      {
        easing: 'linear',
        targets: target1,
        props: {
          opacity: [0, 1]
        }
      },
      {
        easing: 'linear',
        targets: target2,
        props: {
          number: [0, 200]
        }
      }
    ]);

    const actual = getEffects(getState(t1.id));

    assert.deepEqual<{}>(actual, [
      {
        target: target1,
        from: 200,
        to: 800,
        plugin: 'props',
        prop: 'opacity',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 1, easing: 'linear', interpolate: undefined }
        ]
      },
      {
        target: target2,
        from: 200,
        to: 800,
        plugin: 'props',
        prop: 'number',
        keyframes: [
          { offset: 0, value: 0, easing: 'linear', interpolate: undefined },
          { offset: 1, value: 200, easing: 'linear', interpolate: undefined }
        ]
      }
    ]);

    t1.destroy();
  });

  it('sets props at specific times', () => {
    /* Test code */
    const target = {
      opacity: -1
    };

    const t1 = timeline();
    t1.set({
      easing: 'linear',
      targets: target,
      props: {
        opacity: 0
      }
    });

    t1.set({
      at: 1000,
      easing: 'linear',
      targets: target,
      props: {
        opacity: 1
      }
    });

    t1.pause();

    t1.currentTime = 0;
    assert.equal(target.opacity, 0);

    t1.currentTime = 999;
    assert.equal(target.opacity, 0);

    t1.currentTime = 1000;
    assert.equal(target.opacity, 1);

    t1.destroy();
  });

  it('sets props dynamically at the current time', () => {
    /* Test code */
    const target = {
      opacity: -1,
      transformOrigin: 'inherit'
    };

    const t1 = timeline();
    t1.add({
      duration: 1000,
      easing: 'linear',
      targets: target,
      props: {
        opacity: [1, 0]
      }
    });

    t1.set({
      targets: target,
      props: {
        transformOrigin: 'center center'
      }
    });

    t1.pause();

    t1.currentTime = 999;
    assert.equal(target.transformOrigin, 'inherit');

    t1.currentTime = 1000;
    assert.equal(target.transformOrigin, 'center center');

    t1.destroy();
  });

  xit('player actually plays', done => {
    /* Test code */
    const target = { x: 0 };

    const t1 = animate({
      targets: target,
      duration: 1000,
      easing: 'linear',
      props: {
        x: 1000
      }
    });

    t1.play({ destroy: true });

    setTimeout(() => {
      assert.approximately(target.x, 500, 50);
      t1.destroy();
      done();
    }, 500);
  });

  it('accessing a destroyed animation throws an error', done => {
    const t1 = animate({
      targets: { x: 200 },
      duration: 1000,
      props: { x: 0 }
    });

    t1.play().destroy();

    setTimeout(() => {
      assert.throws(function() {
        t1.duration;
      });

      assert.throws(function() {
        t1.currentTime;
      });

      assert.throws(function() {
        t1.playbackRate;
      });

      assert.throws(function() {
        t1.play();
      });

      done();
    });
  });

  it('auto-destroy removes an animation after it finished playing', done => {
    const t1 = animate({
      targets: { x: 200 },
      duration: 200,
      props: { x: 0 }
    });

    t1.on('finish', function() {
      setTimeout(() => {
        assert.throws(function() {
          t1.duration;
        });

        assert.throws(function() {
          t1.currentTime;
        });

        assert.throws(function() {
          t1.playbackRate;
        });

        assert.throws(function() {
          t1.play();
        });

        done();
      });
    });

    t1.play({ destroy: true });
  });

  it('once() only handles the event one time', done => {
    var iterations = 0;

    const t1 = timeline()
      .animate({
        targets: { x: 200 },
        duration: 200,
        props: { x: 0 }
      })
      .once('update', () => {
        iterations++;
      })
      .on('finish', () => {
        assert.equal(iterations, 1);
        t1.destroy();
        done();
      });

    t1.play();
  });
});
