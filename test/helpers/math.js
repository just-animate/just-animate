var assert = require('chai').assert;
var math = require('../../dist/helpers/math');

describe('math', function () {
    describe('clamp()', function () {
        it('should return the min value when equal or lower', function () {
            assert.equal(0, math.clamp(0, 0, 10));
            assert.equal(0, math.clamp(-10, 0, 10));
        });

        it('should return the max value when equal or greater', function () {
            assert.equal(10, math.clamp(11, 0, 10));
        });

        it('should return the value when between the min and max', function () {
            assert.equal(5, math.clamp(5, 0, 10));
        });
    });

});