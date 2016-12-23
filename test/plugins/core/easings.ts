import * as chai from 'chai';
const assert = chai.assert;

import { cubic, steps, getEasingFunction, getEasingString } from '../../../src/plugins/core';

describe('easings', () => {

    describe('cubic()', () => {

        it('linear should return the same value', () => {
            const linear = cubic(0, 0, 1, 1);

            assert.closeTo(0, linear(0), 0.0001);
            assert.closeTo(.25, linear(.25), 0.0001);
            assert.closeTo(.50, linear(.50), 0.0001);
            assert.closeTo(1, linear(1), 0.0001);
        });

        it('slowmo should return the same value', () => {
            const slowmo = cubic(0, 1, 1, 0);

            assert.equal(0, slowmo(0));
            assert.closeTo(.345, slowmo(.07), 0.001);
            assert.equal(.5, slowmo(.5));
            assert.closeTo(.655, slowmo(.93), 0.001);
            assert.equal(1, slowmo(1));
        });

    });

    describe('steps()', () => {
        it('steps(1,start) should return 1 until it reaches the very end', () => {
            const stepStart = steps(1, 'start');
            assert.equal(1, stepStart(0));
            assert.equal(1, stepStart(.01));
            assert.equal(1, stepStart(.5));
            assert.equal(1, stepStart(.75));
            assert.equal(1, stepStart(.99));
            assert.equal(1, stepStart(1));
        });
        it('steps(1,0.5) should return 1 after it reaches the middle point', () => {
            const stepMid = steps(1, .5);
            assert.equal(0, stepMid(0));
            assert.equal(0, stepMid(.01));
            assert.equal(1, stepMid(.5));
            assert.equal(1, stepMid(.75));
            assert.equal(1, stepMid(.99));
            assert.equal(1, stepMid(1));
        });
        it('steps(1,end) should return 0 until it reaches the very end', () => {
            const stepEnd = steps(1, 'end');
            assert.equal(0, stepEnd(0));
            assert.equal(0, stepEnd(.01));
            assert.equal(0, stepEnd(.5));
            assert.equal(0, stepEnd(.75));
            assert.equal(0, stepEnd(.99));
            assert.equal(1, stepEnd(1));
        });
    });

    describe('getEasing() => ', () => {
        it('gets a linear function', () => {
            const easingFn = getEasingFunction('linear');

            assert.equal(easingFn(0), 0);
            assert.equal(easingFn(.5), .5);
            assert.equal(easingFn(1), 1);
        });

        it('gets an ease function', () => {
            const easingFn = getEasingFunction('ease');

            assert.equal(easingFn(0), 0);
            assert.approximately(easingFn(.5), .8, 0.01);
            assert.equal(easingFn(1), 1);
        });

        it('gets an step-start function', () => {
            const easingFn = getEasingFunction('step-start');

            assert.equal(easingFn(0), 1);
            assert.equal(easingFn(.001), 1);
            assert.equal(easingFn(1), 1);
        });

        it('gets an step-end function', () => {
            const easingFn = getEasingFunction('step-end');

            assert.equal(easingFn(0), 0);
            assert.equal(easingFn(.999), 0);
            assert.equal(easingFn(1), 1);
        });

        it('slowmo should return the same value', () => {
            const slowmo = getEasingFunction('cubic-bezier(0,1,1,0)');

            assert.equal(0, slowmo(0));
            assert.closeTo(.345, slowmo(.07), 0.001);
            assert.equal(.5, slowmo(.5));
            assert.closeTo(.655, slowmo(.93), 0.001);
            assert.equal(1, slowmo(1));
        });
    });

    describe('getEasingString()', () => {
        it('changes linear to cubic-bezier', () => {
            const easingString = getEasingString('linear');
            assert.equal('cubic-bezier(0,0,1,1)', easingString);
        });

        it('changes ease to cubic-bezier', () => {
            const easingString = getEasingString('ease');
            assert.equal('cubic-bezier(0.25,0.1,0.25,1)', easingString);
        });
    });
});