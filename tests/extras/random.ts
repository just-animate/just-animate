import * as chai from 'chai';
import { random } from '../../src/extras/random';
const assert = chai.assert;

describe('random', () => {
  describe('random()', () => {
    it('returns a number between start and end', () => {
      const result = random(0, 100) as number;
      assert.isBelow(result, 100);
      assert.isAbove(result, -1);
    });

    it('returns the number as a unit', () => {
      const result = random(1, 2, 'px', true);
      assert.equal(result, '1px');
    });
  });
});
