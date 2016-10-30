import * as chai from 'chai';
const assert = chai.assert;
const jsdom = require('mocha-jsdom');

import {random} from '../../src/common/random';
    
describe('random', () => {
    describe('random()', () => {
        jsdom();
        it('returns a number between start and end', () => {
            const result = random(0, 100) as number;
            assert.isBelow(result, 100);
            assert.isAbove(result, -1);
        }); 

        it('returns the number as a unit', () => {
            const result = random(1, 2, 'px', true);
            assert.isTrue(result === '1px');
        });
    })
})