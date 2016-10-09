var chai = require('chai');
var objects = require('../../dist/common/objects');
var assert = chai.assert;
var expect = chai.expect;

describe('objects', function () {

    describe('resolve', function () {
        it('returns the same value when a non-function', function () {
            var initial = 5;
            var result = objects.resolve(initial);

            expect(result).to.equal(initial);
        });

        it('returns the result of a function otherwise', function () {
            var target = {};
            var context = {
                target: target,
                index: 2,
                targets: [undefined, undefined, target],
            }
            var initial = function (t, i, ts) { return i * 100; };
            var result = objects.resolve(initial, context);

            expect(result).to.equal(200);
        });
    });  

    describe('deepCopyObject', function () {
        it('combines combines {x:1} and {y:2} into {x:1,y;2}', function () {
            var first = { x: 1 };
            var second = { y: 2 };
            var result = objects.deepCopyObject(first);
            result = objects.deepCopyObject(second, result);

            expect(result).to.deep.equal({ x: 1, y: 2 });
        });

        it('creates a copy of the object', function () {
            var testData = { x: 1 };
            var result = objects.deepCopyObject(testData);

            expect(result).to.not.equal(testData);
        });

        it('creates a copy of all objects in properties of objects', function () {
            var level3 = { z: 1 };
            var level2 = { y: level3 };
            var level1 = { x: level2 };
            var result = objects.deepCopyObject(level1);
         
            expect(result).to.deep.equal(level1);            
            expect(result.x.y).to.not.equal(level3);
        });

        it('creates a copy of an array inside a property', function () {
            var steps = [3, 2, 1, 'ignition!'];
            var countdown = { steps: steps };
            var result = objects.deepCopyObject(countdown);
         
            expect(result).to.deep.equal(countdown);            
            expect(result.countdown).to.not.equal(steps);
        });
    });  
});