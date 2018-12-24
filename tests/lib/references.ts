import { timeline, addPlugin, removePlugin } from '../../src/main';
import * as chai from 'chai';
import { waapiPlugin } from '../../src/web/index';
const { assert } = chai;

describe('references', () => {
  before(() => addPlugin(waapiPlugin));
  after(() => removePlugin(waapiPlugin));

  it('replaces a selector', () => {
    const block = document.createElement('div');
    block.classList.add('block');
    document.body.appendChild(block);

    const t1 = timeline({
      references: {
        block: '.block'
      }
    });

    t1.add({
      targets: '@block',
      duration: 1000,
      web: { opacity: [1, 0] }
    });

    t1.pause().seek(1000);

    assert.equal(+getComputedStyle(block).opacity, 0);

    document.body.removeChild(block);
  });

  it('replaces multiple elements from a selector', () => {
    const block = document.createElement('div');
    block.classList.add('block');
    document.body.appendChild(block);

    const block2 = document.createElement('div');
    block2.classList.add('block');
    document.body.appendChild(block2);

    const t1 = timeline({
      references: {
        block: '.block'
      }
    });

    t1.add({
      targets: '@block',
      duration: 1000,
      web: { opacity: [1, 0] }
    });

    t1.pause().seek(1000);

    assert.equal(+getComputedStyle(block).opacity, 0);
    assert.equal(+getComputedStyle(block2).opacity, 0);

    document.body.removeChild(block);
  });

  it('replaces multiple elements in targets', () => {
    const block = document.createElement('div');
    block.classList.add('block');
    document.body.appendChild(block);

    const block2 = document.createElement('div');
    block2.classList.add('block');
    document.body.appendChild(block2);

    const t1 = timeline({
      references: {
        block,
        block2
      }
    });

    t1.add({
      targets: ['@block', '@block2'],
      duration: 1000,
      web: { opacity: [1, 0] }
    });

    t1.pause().seek(1000);

    assert.equal(+getComputedStyle(block).opacity, 0);
    assert.equal(+getComputedStyle(block2).opacity, 0);

    document.body.removeChild(block);
  });

  it('replaces multiple selectors in targets', () => {
    const block = document.createElement('div');
    block.classList.add('block');
    document.body.appendChild(block);

    const block2 = document.createElement('div');
    block2.classList.add('block2');
    document.body.appendChild(block2);

    const t1 = timeline({
      references: {
        block: '.block',
        block2: '.block2'
      }
    });

    t1.add({
      targets: ['@block', '@block2'],
      duration: 1000,
      web: { opacity: [1, 0] }
    });

    t1.pause().seek(1000);

    assert.equal(+getComputedStyle(block).opacity, 0);
    assert.equal(+getComputedStyle(block2).opacity, 0);

    document.body.removeChild(block);
  });

  it('replaces an interpolator', () => {
    const target = { x: 0 };

    const t1 = timeline({
      references: {
        xinterpolator: function(_left: number, _right: number) {
          return (_offset: number) => 42;
        }
      }
    });

    t1.add({
      targets: target,
      duration: 1000,
      props: {
        x: {
          value: 1,
          interpolate: '@xinterpolator'
        }
      }
    });

    t1.pause().seek(1000);

    assert.equal(target.x, 42);
  });

  it('replaces a property as a function', () => {
    const target = { x: 0 };

    const t1 = timeline({
      references: {
        xProp: function() {
          return 42;
        }
      }
    });

    t1.add({
      targets: target,
      duration: 1000,
      easing: 'linear',
      props: {
        x: '@xProp'
      }
    });

    t1.pause().seek(500);

    assert.equal(target.x, 21);
  });

  it('replaces a property as a function in a set of values', () => {
    const target = { x: 1 };

    const t1 = timeline({
      references: {
        xProp: function() {
          return 42;
        }
      }
    });

    t1.add({
      targets: target,
      duration: 1000,
      easing: 'linear',
      props: {
        x: [0, '@xProp']
      }
    });

    t1.pause().seek(500);

    assert.equal(target.x, 21);
  });

  it('replaces a property as a function in a keyframe', () => {
    const target = { x: 1 };

    const t1 = timeline({
      references: {
        xinterpolator: function(_left: number, _right: number) {
          return (_offset: number) => 42;
        }
      }
    });

    t1.add({
      targets: target,
      duration: 1000,
      props: {
        x: [0, { offset: 0.8, value: 42, interpolate: '@xinterpolator' }]
      }
    });

    t1.pause().seek(500);

    assert.equal(target.x, 42);
  });

  it('replaces an interpolator in a keyframe', () => {
    const target = { x: 1 };

    const t1 = timeline({
      references: {
        mid() {
          return 30;
        }
      }
    });

    t1.add({
      targets: target,
      duration: 1000,
      easing: 'linear',
      props: {
        x: [0, { offset: 0.8, value: '@mid' }, 42]
      }
    });

    t1.pause().seek(800);

    assert.equal(target.x, 30);
  });

  it('replaces an easing', () => {
    const target = { x: 1 };

    const t1 = timeline({
      references: {
        myeasing: 'linear'
      }
    });

    t1.add({
      targets: target,
      duration: 1000,
      easing: '@myeasing',
      props: {
        x: [0, 42]
      }
    });

    t1.pause().seek(500);

    assert.equal(target.x, 21);
  });
});
