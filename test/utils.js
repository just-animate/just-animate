var assert = require('chai').assert;
var utils = require('../dist/core/utils.js')

describe('utils', function () {

  describe('clamp()', function () {
    it('should return the min value when equal or lower', function () {
      assert.equal(0, utils.clamp(0, 0, 10));
      assert.equal(0, utils.clamp(-10, 0, 10));
    });

    it('should return the max value when equal or greater', function () {
      assert.equal(10, utils.clamp(11, 0, 10));
    });

    it('should return the value when between the min and max', function () {
      assert.equal(5, utils.clamp(5, 0, 10));
    });
  });

  describe('head()', function () {
    it('should return undefined if array is empty', function () {
      assert.equal(undefined, utils.head([]));
    });

    it('should return the first item if array is not empty', function () {
      assert.equal("1", utils.head(["1"]));
    });
  });

  describe('tail()', function () {
    it('should return undefined if array is empty', function () {
      assert.equal(undefined, utils.tail([]));
    });

    it('should return the last item if array is not empty', function () {
      assert.equal("1", utils.tail(["0", "1"]));
    });
  });

  describe('isArray()', function () {
    it('returns true when an array is passed', function () {
      assert.equal(true, utils.isArray([]));
    });

    it('returns true when an array-like object is passed', function () {
      assert.equal(true, utils.isArray({
        length: 0
      }));
    });

    it('returns false when a normal object is passed', function () {
      assert.equal(false, utils.isArray({}));
    });
  });

  describe('isDefined()', function () {
    it('returns false when undefined', function () {
      assert.equal(false, utils.isDefined(undefined));
      assert.equal(false, utils.isDefined(null));
      assert.equal(false, utils.isDefined(''));
    });

    it('returns true when defined', function () {
      assert.equal(true, utils.isDefined(' '));
      assert.equal(true, utils.isDefined(0));
      assert.equal(true, utils.isDefined(1));
      assert.equal(true, utils.isDefined([]));
      assert.equal(true, utils.isDefined({}));
      assert.equal(true, utils.isDefined(false));
      assert.equal(true, utils.isDefined(true));
    });
  });

  describe('isFunction()', function () {
    it('returns true when a function', function () {
      assert.equal(true, utils.isFunction(function () { }));
    });
    it('returns true when a function', function () {
      var s = function () { };
      s.prototype.methodOne = function () { };

      assert.equal(true, utils.isFunction(s));
      assert.equal(true, utils.isFunction(new s().methodOne));
    });

    it('returns false when not a function', function () {
      assert.equal(false, utils.isFunction(' '));
      assert.equal(false, utils.isFunction(0));
      assert.equal(false, utils.isFunction(1));
      assert.equal(false, utils.isFunction([]));
      assert.equal(false, utils.isFunction({}));
      assert.equal(false, utils.isFunction(false));
      assert.equal(false, utils.isFunction(true));
    });
  });

  describe('isNumber()', function () {
    it('returns true when a number', function () {
      assert.equal(true, utils.isNumber(1));
    });
    it('returns false when not a number', function () {
      assert.equal(false, utils.isNumber('1'));
    });
  });

});