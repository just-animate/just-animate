var assert = require('chai').assert;
var helpers = require('../../dist/core/helpers.js')

describe('utils', function() {
  describe('clamp()', function () {
    it('should return the min value when equal or lower', function () {
      assert.equal(0, helpers.clamp(0, 0, 10));
      assert.equal(0, helpers.clamp(-10, 0, 10));
    });
  });
});