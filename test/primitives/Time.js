var assert = require('chai').assert;
var Time = require('../../dist/primitives/Time').Time;

describe('Time', function () {
    describe('toTime()', function () {
        it('returns =0 when passed 0', function () {
            var result = Time.from(0);
            assert.equal(0, result.value);
            assert.equal(Time.STAGGER_NONE, result.stagger);
        });

        it('returns =2 when passed "2"', function () {
            var result = Time.from('2');
            assert.equal(2, result.value);
            assert.equal(Time.STAGGER_NONE, result.stagger);
        });

        it('returns =1 when passed 1ms', function () {
            var result = Time.from('1ms');
            assert.equal(1, result.value);
            assert.equal(Time.STAGGER_NONE, result.stagger);
        });

        it('returns +=1 when passed +=1ms', function () {
            var result = Time.from('+=1ms');
            assert.equal(1, result.value);
            assert.equal(Time.STAGGER_INCREASE, result.stagger);
        });

        it('returns -=1 when passed -=1ms', function () {
            var result = Time.from('-=1ms');
            assert.equal(1, result.value);
            assert.equal(Time.STAGGER_DECREASE, result.stagger);
        });

        it('returns =1000 when passed 1s', function () {
            var result = Time.from('1s');
            assert.equal(1000, result.value);
            assert.equal(Time.STAGGER_NONE, result.stagger);
        });

        it('returns +=1000 when passed +=1s', function () {
            var result = Time.from('+=1s');
            assert.equal(1000, result.value);
            assert.equal(Time.STAGGER_INCREASE, result.stagger);
        });

        it('returns +=1000 when passed -=1s', function () {
            var result = Time.from('-=1s');
            assert.equal(1000, result.value);
            assert.equal(Time.STAGGER_DECREASE, result.stagger);
        });
    });
});