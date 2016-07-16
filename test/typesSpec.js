var assert = require('chai').assert;
var types = require('../dist/core/types.js')

describe('types', function () {
    describe('toTime()', function () {
        it('returns =0 when passed 0', function () {
            var result = types.toTime(0);
            assert.equal(0, result.value);
            assert.equal('=', result.operator);
        });

        it('returns =2 when passed "2"', function () {
            var result = types.toTime('2');
            assert.equal(2, result.value);
            assert.equal('=', result.operator);
        });

        it('returns =1 when passed 1ms', function () {
            var result = types.toTime('1ms');
            assert.equal(1, result.value);
            assert.equal('=', result.operator);
        });

        it('returns +=1 when passed +=1ms', function () {
            var result = types.toTime('+=1ms');
            assert.equal(1, result.value);
            assert.equal('+=', result.operator);
        });

        it('returns -=1 when passed -=1ms', function () {
            var result = types.toTime('-=1ms');
            assert.equal(1, result.value);
            assert.equal('-=', result.operator);
        });

        it('returns =1000 when passed 1s', function () {
            var result = types.toTime('1s');
            assert.equal(1000, result.value);
            assert.equal('=', result.operator);
        });

        it('returns +=1000 when passed +=1s', function () {
            var result = types.toTime('+=1s');
            assert.equal(1000, result.value);
            assert.equal('+=', result.operator);
        });

        it('returns +=1000 when passed -=1s', function () {
            var result = types.toTime('-=1s');
            assert.equal(1000, result.value);
            assert.equal('-=', result.operator);
        });
    });
});