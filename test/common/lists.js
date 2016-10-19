var chai = require('chai');
var lists = require('../../dist/common/lists');

var assert = chai.assert;
var expect = chai.expect;

describe('lists', function () {

  describe('head()', function () {
    it('should return undefined if array is empty', function () {
      assert.equal(undefined, lists.head([]));
    });

    it('should return the first item if array is not empty', function () {
      assert.equal("1", lists.head(["1"]));
    });
  });

  describe('tail()', function () {
    it('should return undefined if array is empty', function () {
      assert.equal(undefined, lists.tail([]));
    });

    it('should return the last item if array is not empty', function () {
      assert.equal("1", lists.tail(["0", "1"]));
    });
  });

  describe('toArray()', function () {
    it('returns an array from an array like structure', function () {
      expect(lists.toArray({ length: 0 })).to.deep.equal([]);
    });
  });

  describe('chain', function () {
    it('wraps an existing object in an array', function () {
      var input = { x: 2 };
      var result = lists.chain(input);

      expect(result[0]).to.equal(input);
    });

    it('wraps an existing string in an array', function () {
      var input = 'a string';
      var result = lists.chain(input);

      expect(result[0]).to.equal(input);
    });

    it('returns an array back if passed an array', function () {
      var input = [1, 2, 3];
      var result = lists.chain(input);

      expect(result).to.equal(input);
    });
  });

});