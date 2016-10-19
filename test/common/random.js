var jsdom = require('mocha-jsdom');
var assert = require('chai').assert;
var random = require('../../dist/common/random');
    
describe('random', function () {
    describe('random()', function () {
        jsdom();
        it('returns a number between start and end', function () {
            var result = random.random(0, 100);
            assert.isBelow(result, 100);
            assert.isAbove(result, -1);
        }); 

        it('returns the number as a unit', function () {
            var result = random.random(1, 2, 'px', true);
            assert.isTrue(result === '1px');
        });
    })
})