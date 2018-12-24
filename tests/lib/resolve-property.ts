import * as chai from 'chai';
const { assert } = chai;

import { resolveProperty } from '../../src/lib/utils/resolve-property';

describe('resolve', () => {
  it('leaves primitive values pristine', () => {
    const initial = 'nothing to see here folks';
    const actual = resolveProperty(initial, {}, 2, 3);
    assert.equal(actual, initial);
  });

  it('resolves the index in functions', () => {
    const actual = resolveProperty(
      (_target: any, index: number) => 'The number is ' + index,
      {},
      2,
      3
    );
    assert.equal(actual, 'The number is 2');
  });

  it('resolves the target in functions', () => {
    const actual = resolveProperty(
      (target: any) => 'The number is ' + target.number,
      { number: 3 },
      0,
      3
    );
    assert.equal(actual, 'The number is 3');
  });
});
