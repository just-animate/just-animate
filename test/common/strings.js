var assert = require('chai').assert;
var strings = require('../../dist/common/strings');

describe('strings', function () {
    describe('hyphenatedToCamelCase()', function () {
        it('returns undefined if not a string', function () {
            assert.equal('', strings.toCamelCase(undefined));
            assert.equal('', strings.toCamelCase(null));
            assert.equal('', strings.toCamelCase({}));
            assert.equal('', strings.toCamelCase([]));
        });

        it('returns the original if no changes are needed ', function () {
            assert.equal('color', strings.toCamelCase('color'));
        });

        it('converts single hyphenated words to camelcase', function () {
            assert.equal('backgroundColor', strings.toCamelCase('background-color'));
        });

        it('converts multiple hyphenated words to camelcase', function () {
            assert.equal('borderLeftWidth', strings.toCamelCase('border-left-width'));
        });

        it('converts strings with spaces to camelcase', function () {
            assert.equal('somethingWithSpaces', strings.toCamelCase('something with spaces'));
        });
    });

});