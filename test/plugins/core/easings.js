var assert = require('chai').assert;
var easings = require('../../../dist/plugins/core/easings');

describe('easings', function() {

    describe('cubic()', function () {

        it('linear should return the same value', function () {
            var linear = easings.cubic(0,0,1,1);

            assert.closeTo(0, linear(0), 0.0001);
            assert.closeTo(.25, linear(.25), 0.0001);
            assert.closeTo(.50, linear(.50), 0.0001);
            assert.closeTo(1, linear(1), 0.0001);
        });

        it('slowmo should return the same value', function () {
            var slowmo = easings.cubic(0,1,1,0);

            assert.equal(0, slowmo(0));
            assert.closeTo(.345, slowmo(.07), 0.001);
            assert.equal(.5, slowmo(.5));
            assert.closeTo(.655, slowmo(.93), 0.001);
            assert.equal(1, slowmo(1));
        });

    });

    describe('steps()', function() {
        it('steps(1,start) should return 1 until it reaches the very end', function () {
            var stepStart = easings.steps(1, 'start');
            assert.equal(1, stepStart(0));
            assert.equal(1, stepStart(.01));
            assert.equal(1, stepStart(.5));
            assert.equal(1, stepStart(.75));
            assert.equal(1, stepStart(.99));
            assert.equal(1, stepStart(1));
        });
        it('steps(1,0.5) should return 1 after it reaches the middle point', function() {
            var stepMid = easings.steps(1, .5);
            assert.equal(0, stepMid(0));
            assert.equal(0, stepMid(.01));
            assert.equal(1, stepMid(.5));
            assert.equal(1, stepMid(.75));
            assert.equal(1, stepMid(.99));
            assert.equal(1, stepMid(1));
        });
        it('steps(1,end) should return 0 until it reaches the very end', function() {
            var stepEnd = easings.steps(1, 'end');
            assert.equal(0, stepEnd(0));
            assert.equal(0, stepEnd(.01));
            assert.equal(0, stepEnd(.5));
            assert.equal(0, stepEnd(.75));
            assert.equal(0, stepEnd(.99));
            assert.equal(1, stepEnd(1));
        });
    });

    describe('getEasingFunction()', function () {
        it('gets a linear function', function () {
            var easingFn = easings.getEasingFunction('linear');

            assert.equal(easingFn(0), 0);
            assert.equal(easingFn(.5), .5);
            assert.equal(easingFn(1), 1);
        });

        it('gets an ease function', function () {
            var easingFn = easings.getEasingFunction('ease');

            assert.equal(easingFn(0), 0);
            assert.approximately(easingFn(.5), .8, 0.01);
            assert.equal(easingFn(1), 1);
        });

        it('gets an step-start function', function () {
            var easingFn = easings.getEasingFunction('step-start');

            assert.equal(easingFn(0), 1);
            assert.equal(easingFn(.001), 1);
            assert.equal(easingFn(1), 1);
        });

        it('gets an step-end function', function () {
            var easingFn = easings.getEasingFunction('step-end');

            assert.equal(easingFn(0), 0);
            assert.equal(easingFn(.999), 0);
            assert.equal(easingFn(1), 1);
        });
    });

    describe('getEasingString()', function() {
        it('changes linear to cubic-bezier', function() {
            var easingString = easings.getEasingString('linear');
            assert.equal('cubic-bezier(0,0,1,1)', easingString);
        });

        it('changes ease to cubic-bezier', function() {
            var easingString = easings.getEasingString('ease');
            assert.equal('cubic-bezier(0.25,0.1,0.25,1)', easingString);
        });
    });
});