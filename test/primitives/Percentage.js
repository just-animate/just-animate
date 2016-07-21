var assert = require('chai').assert;
var Percentage = require('../../dist/primitives/Percentage').Percentage;

describe('Percentage', function () {
    describe('from()', function () {
        it('returns undefined when passed undefined', function () {
            var result = Percentage.from(undefined);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed null', function () {
            var result = Percentage.from(null);
            assert.equal(undefined, result);
        });

        it('returns undefined when passed ""', function () {
            var result = Percentage.from("");
            assert.equal(undefined, result);
        });

        it('returns 2.2% when passed 2.2', function () {
            var result = Percentage.from(2.2);
            assert.equal(2.2, result.value);
        });

        it('returns -2.2% when passed -2.2', function () {
            var result = Percentage.from(-2.2);
            assert.equal(-2.2, result.value);
        });

        it('returns -2.2% when passed "-2.2%"', function () {
            var result = Percentage.from("-2.2%");
            assert.equal(-2.2, result.value);
        });

        it('returns 100% when passed 100', function () {
            var result = Percentage.from(100);
            assert.equal(100, result.value);
        });

        it('returns 100% when passed "100"', function () {
            var result = Percentage.from("100");
            assert.equal(100, result.value);
        });

        it('returns 100% when passed "100%"', function () {
            var result = Percentage.from("100%");
            assert.equal(100, result.value);
        });

        it('returns -100% when passed -100', function () {
            var result = Percentage.from(-100);
            assert.equal(-100, result.value);
        });

        it('returns -100% when passed "-100"', function () {
            var result = Percentage.from("-100");
            assert.equal(-100, result.value);
        });

        it('returns -100% when passed "-100%"', function () {
            var result = Percentage.from("-100%");
            assert.equal(-100, result.value);
        });
    });
});