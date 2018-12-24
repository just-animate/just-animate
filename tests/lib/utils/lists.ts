import * as chai from 'chai';
import { all, find, list } from '../../../src/lib/utils/lists';
const { assert, expect } = chai;

describe('forEach()', () => {
  it('calls the function for each item', () => {
    const results: number[] = [];
    all([1, 2, 3, 4], s => results.push(s));
    assert.deepEqual([1, 2, 3, 4], results);
  });
});

describe('find()', () => {
  it('should return undefined if array is empty', () => {
    assert.equal(undefined, find([]));
  });

  it('should return the first item if array is not empty', () => {
    assert.equal('1', find(['1']));
  });

  it('should return undefined if array is empty', () => {
    assert.equal(undefined, find([], undefined, true));
  });

  it('should return the last item if array is not empty', () => {
    assert.equal('1', find(['0', '1'], undefined, true));
  });
});

describe('list', () => {
  it('wraps an existing object in an array', () => {
    const input = { x: 2 };
    const result = list(input);
    expect(result[0]).to.equal(input);
  });

  it('wraps an existing string in an array', () => {
    const input = 'a string';
    const result = list(input);
    expect(result[0]).to.equal(input);
  });

  it('returns an array back if passed an array', () => {
    const input = [1, 2, 3];
    const result = list(input);
    expect(result).to.equal(input);
  });
});
