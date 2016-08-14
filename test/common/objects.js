var assert = require('chai').assert;
var objects = require('../../dist/common/objects');

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

});