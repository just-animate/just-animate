import * as chai from 'chai';
const expect = chai.expect;
const jsdom = require('mocha-jsdom');

import { expandOffsets, propsToKeyframes } from '../../../src/plugins/waapi/KeyframeTransformers';

describe('KeyframeTransformers', () => {
    jsdom();

    describe('propsToKeyframes', () => {
        it('should change opacity: [1,0,1,0] to appropriate keyframes', () => {
            const css = {
                opacity: [1, 0, 1, 0]
            };
            const sourceKeyframes: any = [];
            const options = {};
            const target = document.createElement('div');
            const ctx = {
                index: 0,
                options: options,
                target: target,
                targets: [target]
            } as any;

            propsToKeyframes(css, sourceKeyframes, ctx);

            expect(sourceKeyframes[0]).to.deep.equal({ offset: 0, opacity: 1 });
            expect(sourceKeyframes[1]).to.deep.equal({ offset: 1 / 3, opacity: 0 });
            expect(sourceKeyframes[2]).to.deep.equal({ offset: 2 / 3, opacity: 1 });
            expect(sourceKeyframes[3]).to.deep.equal({ offset: 1, opacity: 0 });
        });

        it('should change opacity: [1,0] to appropriate keyframes', () => {
            const css = {
                opacity: [1, 0]
            };
            const sourceKeyframes: any = [];
            const target = document.createElement('div');
            const ctx = {
                index: 0,
                options: {},
                target: target,
                targets: [target],
            } as any;

            propsToKeyframes(css, sourceKeyframes, ctx);

            expect(sourceKeyframes[0]).to.deep.equal({ offset: 0, opacity: 1 });
            expect(sourceKeyframes[1]).to.deep.equal({ offset: 1, opacity: 0 });
        });

        it('should change rotate: [0, 90deg, -360deg] to appropriate keyframes', () => {
            const css = {
                rotate: [0, '90deg', '-360deg']
            };
            const sourceKeyframes: any = [];
            const options = {};
            const target = document.createElement('div');
            const ctx = {
                index: 0,
                options: options,
                target: target,
                targets: [target]
            } as any;

            propsToKeyframes(css, sourceKeyframes, ctx);

            expect(sourceKeyframes[0]).to.deep.equal({ offset: 0, rotate: 0 });
            expect(sourceKeyframes[1]).to.deep.equal({ offset: 1 / 2, rotate: '90deg' });
            expect(sourceKeyframes[2]).to.deep.equal({ offset: 1, rotate: '-360deg' });
        });
    });

    describe('expandOffsets', () => {
        it('should copy offset: [0, 1] to { offset: 0 }, { offset: 1}', () => {
            const keyframes = [
                { offset: [0, 1], opacity: 1 },
                { offset: .5, opacity: 0 }
            ];

            expandOffsets(keyframes);

            expect(keyframes[0]).to.deep.equal({ offset: 0, opacity: 1 });
            expect(keyframes[1]).to.deep.equal({ offset: .5, opacity: 0 });
            expect(keyframes[2]).to.deep.equal({ offset: 1, opacity: 1 });
        });
    });
});
