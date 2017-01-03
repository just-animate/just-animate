import { random, shuffle, splitText } from './common';
import { animator, mixins, timeloop, easingList } from './plugins/core';

export const justAnimate = (): ja.JustAnimate => {
    const resolver = mixins();
    const timeLoop = timeloop();
    const plugins: ja.IPlugin<{}>[] = [];

    const self = {
        easings: easingList,
        animate(options: ja.AnimationOptions | ja.AnimationOptions[]): ja.IAnimator {
            return animator(resolver, timeLoop, plugins).animate(options);
        },
        plugin<T>(plugin: ja.IPlugin<T>): void {
            plugins.push(plugin);
        },
        random(first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string {
            return random(first, last, unit, wholeNumbersOnly);
        },
        register(preset: ja.AnimationMixin): void {
            resolver.set(preset, false);
        },
        shuffle: shuffle,
        splitText: splitText,
        inject(animations: ja.AnimationMixin[]): void {
            for (let i = 0, len = animations.length; i < len; i++) {
                resolver.set(animations[i], true);
            }
        }
    };

    return self;
};
