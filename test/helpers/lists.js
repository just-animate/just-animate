var chai = require('chai');
var lists = require('../../dist/helpers/lists');

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

  describe('each()', function () {
    it('iterates over each item', function () {
      var initial = [1, 2, 3];
      var result = [];
      lists.each(initial, (i) => result.push(i));
      expect(result).to.deep.equal(initial);
    });
  });

  describe('max()', function () {
    it('returns the max value for a property in an array of items', function () {
      var source = [
        { value: 10 },
        { value: 6078 },
        { value: -30 }
      ];
      assert(6078, lists.max(source, 'value'));
    });
  });

  describe('map()', function () {
    it('maps an array of items', function () {
      var source = [
        { letter: 't' },
        { letter: 'e' },
        { letter: 's' },
        { letter: undefined },
        { letter: 't' }
      ];
      assert.equal('test', lists.map(source, i => i.letter).join(''));
    });
  });

  describe('pushALl()', function () {
    it('pushes a array of items into an existing array', function () {
      var target = [];
      var source = [1, 2, 3, 4];

      lists.pushAll(target, source);

      assert.equal(source.length, target.length, true);
    });
  });
});