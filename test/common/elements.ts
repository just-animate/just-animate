import * as chai from 'chai';
const assert = chai.assert;
const jsdom = require('mocha-jsdom');

import { getTargets, splitText } from '../../src/common/elements';

describe('elements', () => {
    jsdom();
    
    describe('getTargets()', () => {

        it('resolves element as element[]', () => {
            const element = document.createElement('div');
            assert.equal(1, getTargets(element).length);
        });

        it('resolves elements by selector', () => {
            const parent = document.createElement('div');
            parent.id = 'elementBySelector';
            document.body.appendChild(parent);

            for (let i = 0; i < 20; i++) {
                const child = document.createElement('span');
                child.classList.add('child');
                parent.appendChild(child);
            }

            assert.equal(20, getTargets('#elementBySelector .child').length);
            document.body.removeChild(parent);
        });

        it('resolves a NodeList or Element[]', () => {
            const parent = document.createElement('div');
            parent.id = 'elementBySelector';
            document.body.appendChild(parent);

            for (let i = 0; i < 20; i++) {
                const child = document.createElement('span');
                child.classList.add('child');
                parent.appendChild(child);
            }

            assert.equal(20, getTargets(document.querySelectorAll('#elementBySelector .child')).length);
            document.body.removeChild(parent);
        });

        it('resolves an element from a function', () => {
            const targets = () => {
                return document.createElement('i');
            };
            assert.equal(1, getTargets(targets).length);
        });

        it('flattens element list', () => {
            const targets = [
                document.createElement('i'),
                [
                    document.createElement('i'),
                    document.createElement('i'),
                    [
                        document.createElement('i'),
                        document.createElement('i'),
                        document.createElement('i')
                    ]
                ]
            ];
            assert.equal(6, getTargets(targets as any).length);
        });

        it('handles general ridiculousness', () => {
            const byIdElement = document.createElement('div');
            byIdElement.id = 'byId';
            document.body.appendChild(byIdElement);

            const byId2Element = document.createElement('div');
            byId2Element.id = 'byId2';
            document.body.appendChild(byId2Element);

            const byId3Element = document.createElement('div');
            byId3Element.id = 'byId3';
            document.body.appendChild(byId3Element);

            const targets = () => {
                return [
                    byId2Element,
                    '#byId2',
                    document.createElement('i'),
                    document.querySelectorAll('#byId3')
                ];
            };
            assert.equal(4, getTargets(targets as any).length);
        });
    });


    describe('splitText()', () => {
        it('splits innerText characters into individual spans', () => {
            const element = document.createElement('h2');
            element.innerHTML = 'Hello World!';
            
            const letters = splitText(element)[0];
            assert(letters.length === 12, 'Wrong number of elements');
            assert(letters[0].textContent === 'H');
            assert(letters[1].textContent === 'e');
            assert(letters[2].textContent === 'l');
            assert(letters[3].textContent === 'l');
            assert(letters[4].textContent === 'o');
            assert(letters[5].textContent === ' ');
            assert(letters[6].textContent === 'W');
            assert(letters[7].textContent === 'o');
            assert(letters[8].textContent === 'r');
            assert(letters[9].textContent === 'l');
            assert(letters[10].textContent === 'd');
            assert(letters[11].textContent === '!');
        });

        it('it removes double spaces and newlines', () => {
            const element = document.createElement('h2');
            element.innerHTML = 's  \n\ts';
            const letters = splitText(element)[0];
            console.log(letters.length);

            assert(letters.length === 3, 'Wrong number of elements');
            assert(letters[0].textContent = 's');
            assert(letters[1].textContent = ' ');
            assert(letters[2].textContent = 's');
        });

        it('it removes whitespace before and after', () => {
            const element = document.createElement('h2');
            element.innerHTML = '  t  ';
            const letters = splitText(element)[0];

            assert(letters.length === 1, 'Wrong number of elements');
            assert(letters[0].textContent = 't');
        });
    });
});
