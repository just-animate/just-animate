import * as chai from 'chai'
import { toCamelCase } from '../../src/utils/strings';
const { assert } = chai

describe('strings', () => {
    describe('hyphenatedToCamelCase()', () => {
        it('returns undefined if not a string', () => {
            assert.equal('', toCamelCase(undefined))
            assert.equal('', toCamelCase({} as any))
            assert.equal('', toCamelCase([] as any))
        })

        it('returns the original if no changes are needed ', () => {
            assert.equal('color', toCamelCase('color'))
        })

        it('converts single hyphenated words to camelcase', () => {
            assert.equal('backgroundColor', toCamelCase('background-color'))
        })

        it('converts multiple hyphenated words to camelcase', () => {
            assert.equal('borderLeftWidth', toCamelCase('border-left-width'))
        })

        it('converts strings with spaces to camelcase', () => {
            assert.equal('somethingWithSpaces', toCamelCase('something with spaces'))
        })
    })

})
