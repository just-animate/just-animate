var assert = require('chai').assert;
var type = require('../../dist/helpers/type')

describe('type', function () {
  describe('isArray()', function () {
    it('returns true when an array is passed', function () {
      assert.equal(true, type.isArray([]));
    });

    it('returns true when an array-like object is passed', function () {
      assert.equal(true, type.isArray({
        length: 0
      }));
    });

    it('returns false when a normal object is passed', function () {
      assert.equal(false, type.isArray({}));
    });
  });

  describe('isDefined()', function () {
    it('returns false when undefined', function () {
      assert.equal(false, type.isDefined(undefined));
      assert.equal(false, type.isDefined(null));
      assert.equal(false, type.isDefined(''));
    });

    it('returns true when defined', function () {
      assert.equal(true, type.isDefined(' '));
      assert.equal(true, type.isDefined(0));
      assert.equal(true, type.isDefined(1));
      assert.equal(true, type.isDefined([]));
      assert.equal(true, type.isDefined({}));
      assert.equal(true, type.isDefined(false));
      assert.equal(true, type.isDefined(true));
    });
  });

  describe('isFunction()', function () {
    it('returns true when a function', function () {
      assert.equal(true, type.isFunction(function () { }));
    });
    it('returns true when a function', function () {
      var s = function () { };
      s.prototype.methodOne = function () { };

      assert.equal(true, type.isFunction(s));
      assert.equal(true, type.isFunction(new s().methodOne));
    });

    it('returns false when not a function', function () {
      assert.equal(false, type.isFunction(' '));
      assert.equal(false, type.isFunction(0));
      assert.equal(false, type.isFunction(1));
      assert.equal(false, type.isFunction([]));
      assert.equal(false, type.isFunction({}));
      assert.equal(false, type.isFunction(false));
      assert.equal(false, type.isFunction(true));
    });
  });

  describe('isNumber()', function () {
    it('returns true when a number', function () {
      assert.equal(true, type.isNumber(1));
    });
    it('returns false when not a number', function () {
      assert.equal(false, type.isNumber('1'));
    });
  });

  describe('isString()', function () {
    it('returns true when a string', function () {
      assert.equal(true, type.isString(''));
    });
    it('returns false when not a string', function () {
      assert.equal(false, type.isString(null));
    });
  });
});
