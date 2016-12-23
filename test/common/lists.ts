import * as chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import { head, tail, toArray, chain } from '../../src/common';

describe('lists', () => {

  describe('head()', () => {
    it('should return undefined if array is empty', () => {
      assert.equal(undefined, head([]));
    });

    it('should return the first item if array is not empty', () => {
      assert.equal('1', head(['1']));
    });
  });

  describe('tail()', () => {
    it('should return undefined if array is empty', () => {
      assert.equal(undefined, tail([]));
    });

    it('should return the last item if array is not empty', () => {
      assert.equal('1', tail(['0', '1']));
    });
  });

  describe('toArray()', () => {
    it('returns an array from an array like structure', () => {
      expect(toArray({ length: 0 })).to.deep.equal([]);
    });
  });

  describe('chain', () => {
    it('wraps an existing object in an array', () => {
      const input = { x: 2 };
      const result = chain(input);
      expect(result[0]).to.equal(input);
    });

    it('wraps an existing string in an array', () => {
      const input = 'a string';
      const result = chain(input);
      expect(result[0]).to.equal(input);
    });

    it('returns an array back if passed an array', () => {
      const input = [1, 2, 3];
      const result = chain(input);
      expect(result).to.equal(input);
    });
  });

});