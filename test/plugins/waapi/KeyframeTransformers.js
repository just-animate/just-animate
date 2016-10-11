var jsdom = require('mocha-jsdom');
var chai = require('chai');
var transformers = require('../../../dist/plugins/waapi/KeyframeTransformers');

var assert = chai.assert;
var expect = chai.expect;

describe('KeyframeTransformers', function () {
    jsdom();

    describe('propsToKeyframes', function() {
        it('should change opacity: [1,0,1,0] to appropriate keyframes', function() {
            var css = {
                opacity: [1, 0, 1, 0]
            };
            var sourceKeyframes = [];
            var options = {};
            var target = document.createElement('div');
            var ctx = {
                index: 0,
                options: options,
                target: target,
                targets: [target]
            };
            
            transformers.propsToKeyframes(css, sourceKeyframes, ctx);

            expect(sourceKeyframes[0]).to.deep.equal({ offset: 0, opacity: 1 });
            expect(sourceKeyframes[1]).to.deep.equal({ offset: 1 / 3, opacity: 0 });
            expect(sourceKeyframes[2]).to.deep.equal({ offset: 2 / 3, opacity: 1 });
            expect(sourceKeyframes[3]).to.deep.equal({ offset: 1, opacity: 0 });
        });

        it('should change opacity: [1,0] to appropriate keyframes', function() {
            var css = {
                opacity: [1, 0]
            };
            var sourceKeyframes = [];
            var options = {};
            var target = document.createElement('div');
            var ctx = {
                index: 0,
                options: options,
                target: target,
                targets: [target]
            };
            
            transformers.propsToKeyframes(css, sourceKeyframes, ctx);

            expect(sourceKeyframes[0]).to.deep.equal({ offset: 0, opacity: 1 });
            expect(sourceKeyframes[1]).to.deep.equal({ offset: 1, opacity: 0 });
        });

        it('should change rotate: [0, 90deg, -360deg] to appropriate keyframes', function() {
            var css = {
                rotate: [0, '90deg', '-360deg']
            };
            var sourceKeyframes = [];
            var options = {};
            var target = document.createElement('div');
            var ctx = {
                index: 0,
                options: options,
                target: target,
                targets: [target]
            };
            
            transformers.propsToKeyframes(css, sourceKeyframes, ctx);

            expect(sourceKeyframes[0]).to.deep.equal({ offset: 0, rotate: 0 });
            expect(sourceKeyframes[1]).to.deep.equal({ offset: 1/2, rotate: '90deg' });
            expect(sourceKeyframes[2]).to.deep.equal({ offset: 1, rotate: '-360deg' });
        });
    });

    describe('expandOffsets', function() {
        it('should copy offset: [0, 1] to { offset: 0 }, { offset: 1}', function() {
            var keyframes = [
              { offset: [0, 1], opacity: 1 },
              { offset: .5, opacity: 0 }
            ];

            transformers.expandOffsets(keyframes);

            expect(keyframes[0]).to.deep.equal({ offset: 0, opacity: 1 });            
            expect(keyframes[1]).to.deep.equal({ offset: .5, opacity: 0 });            
            expect(keyframes[2]).to.deep.equal({ offset: 1, opacity: 1 });
        });
    });
});
