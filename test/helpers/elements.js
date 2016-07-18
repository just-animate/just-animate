var jsdom = require('mocha-jsdom');
var chai = require('chai');
var elements = require('../../dist/helpers/elements');

var assert = chai.assert;
var expect = chai.expect;

describe('elements', function () {

    describe('queryElements()', function () {
        jsdom();

        it('resolves element as element[]', function () {
            var element = document.createElement('div');
            assert.equal(1, elements.queryElements(element).length);
        });

        it('resolves elements by selector', function () {
            var parent = document.createElement('div');
            parent.id = 'elementBySelector';
            document.body.appendChild(parent);

            for (var i = 0; i < 20; i++) {
                var child = document.createElement('span');
                child.classList.add('child');
                parent.appendChild(child);
            }

            assert.equal(20, elements.queryElements('#elementBySelector .child').length);
            document.body.removeChild(parent);
        });

        it('resolves a NodeList or Element[]', function () {
            var parent = document.createElement('div');
            parent.id = 'elementBySelector';
            document.body.appendChild(parent);

            for (var i = 0; i < 20; i++) {
                var child = document.createElement('span');
                child.classList.add('child');
                parent.appendChild(child);
            }

            assert.equal(20, elements.queryElements(document.querySelectorAll('#elementBySelector .child')).length);
            document.body.removeChild(parent);
        });

        it('resolves an element from a function', function () {
            var targets = function () {
                return document.createElement('i');
            };
            assert.equal(1, elements.queryElements(targets).length);
        });

        it('flattens element list', function () {
            var targets = [
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
            assert.equal(6, elements.queryElements(targets).length);
        });

        it('handles general ridiculousness', function () {
            var byIdElement = document.createElement('div');
            byIdElement.id = 'byId';
            document.body.appendChild(byIdElement);

            var byId2Element = document.createElement('div');
            byId2Element.id = 'byId2';
            document.body.appendChild(byId2Element);

            var byId3Element = document.createElement('div');
            byId3Element.id = 'byId3';
            document.body.appendChild(byId3Element);

            var targets = function () {
                return [
                    byId2Element,
                    '#byId2',
                    document.createElement('i'),
                    document.querySelectorAll('#byId3')
                ];
            };
            assert.equal(4, elements.queryElements(targets).length);
        });
    });

});