var assert = require('chai').assert;
var math = require('../../dist/common/math');

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

    describe('cubicBezier()', function () {

        it('linear should return the same value', function () {
            var linear = math.cubicBezier(0,0,1,1);

            assert.closeTo(0, linear(0), 0.0001);
            assert.closeTo(.25, linear(.25), 0.0001);
            assert.closeTo(.50, linear(.50), 0.0001);
            assert.closeTo(1, linear(1), 0.0001);
        });

        it('linear should return the same value', function () {
            var slowmo = math.cubicBezier(0,1,1,0);

            assert.equal(0, slowmo(0));
            assert.closeTo(.345, slowmo(.07), 0.001);
            assert.equal(.5, slowmo(.5));
            assert.closeTo(.655, slowmo(.93), 0.001);
            assert.equal(1, slowmo(1));
        });

    });
});