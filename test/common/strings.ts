import * as chai from 'chai';
const assert = chai.assert;

import { toCamelCase } from '../../src/common/strings';

describe('strings', function () {
    describe('hyphenatedToCamelCase()', function () {
        it('returns undefined if not a string', function () {
            assert.equal('', toCamelCase(undefined));
            assert.equal('', toCamelCase(null as any));
            assert.equal('', toCamelCase({} as any));
            assert.equal('', toCamelCase([] as any));
        });

        it('returns the original if no changes are needed ', function () {
            assert.equal('color', toCamelCase('color'));
        });

        it('converts single hyphenated words to camelcase', function () {
            assert.equal('backgroundColor', toCamelCase('background-color'));
        });

        it('converts multiple hyphenated words to camelcase', function () {
            assert.equal('borderLeftWidth', toCamelCase('border-left-width'));
        });

        it('converts strings with spaces to camelcase', function () {
            assert.equal('somethingWithSpaces', toCamelCase('something with spaces'));
        });
    });

});