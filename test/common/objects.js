var chai = require('chai');
var objects = require('../../dist/common/objects');
var assert = chai.assert;
var expect = chai.expect;

describe('objects', function () {
    describe('extend()', function () {
        it('combines objects together', function () {
            var first = { first: 'Jane' };
            var last = { last: 'Smith' };
            var name = objects.extend(first, last);

            assert.equal(first, name);
            assert.equal('Jane Smith', name.first + ' ' + name.last);
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
    });  
});