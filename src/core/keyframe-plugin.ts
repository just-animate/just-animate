import { isArray, isElement } from '../utils'; 

import {
    addTransition,
    arrangeKeyframes,
    expandOffsets,
    fixPartialKeyframes,
    keyframeOffsetComparer,
    propsToKeyframes,
    resolvePropertiesInKeyframes,
    spaceKeyframes
} from '../transformers'; 

export const keyframePlugin = {
    canHandle(ctx: ja.AnimationTargetContext<Element>): boolean {
        return !!(ctx.options!.css) && isElement(ctx.target!);
    },
    handle(timings: ja.AnimationTiming, ctx: ja.AnimationTargetContext<Element>): ja.IAnimationController {
        const animator = new KeyframeAnimator(() => initAnimator(timings, ctx));
        animator.totalDuration = timings.totalTime;
        return animator;
    }
};

export const initAnimator = (timings: AnimationEffectTiming, ctx: ja.AnimationTargetContext<Element>): Animation => {
    // process css as either keyframes or calculate what those keyframes should be   
    const options = ctx.options!;
    const target = ctx.target as HTMLElement;
    const css = options.css;

    let sourceKeyframes: ja.CssKeyframeOptions[];
    if (isArray(css)) {
        // if an array, no processing has to occur
        sourceKeyframes = css as ja.CssKeyframeOptions[];
        expandOffsets(sourceKeyframes);
    } else {
        sourceKeyframes = [];
        propsToKeyframes(css as ja.CssPropertyOptions, sourceKeyframes, ctx);
    }

    const targetKeyframes: Keyframe[] = [];

    resolvePropertiesInKeyframes(sourceKeyframes, targetKeyframes, ctx);

    if (options.isTransition === true) {
        addTransition(targetKeyframes, target);
    }

    spaceKeyframes(targetKeyframes);
    arrangeKeyframes(targetKeyframes);

    // sort by offset (should have all offsets assigned)
    targetKeyframes.sort(keyframeOffsetComparer);

    fixPartialKeyframes(targetKeyframes);

    const animator = target['animate'](targetKeyframes, timings);
    animator.cancel();
    return animator;
};

/**
 * Implements the IAnimationController interface for the Web Animation API
 * 
 * @export
 * @class KeyframeAnimator
 * @implements {ja.IAnimationController}
 */
export class KeyframeAnimator {
    public totalDuration: number;
    private _initialized: boolean | undefined;
    private _init: { (): Animation; } | undefined;
    private _animator: Animation;

    constructor(init: { (): Animation; }) {
        this._init = init;
        this._initialized = undefined;
    }
    public seek(value: number): void {
        this._ensureInit();
        if (this._animator.currentTime !== value) {
            this._animator.currentTime = value;
        }
    }
    public playbackRate(value: number): void {
        this._ensureInit();
        if (this._animator.playbackRate !== value) {
            this._animator.playbackRate = value;
        }
    }
    public reverse(): void {
        this._ensureInit();
        this._animator.playbackRate *= -1;
    }
    public restart(): void {
        const animator = this._animator;
        animator.cancel();
        animator.play();
    }
    public playState(): ja.AnimationPlaybackState;
    public playState(value: ja.AnimationPlaybackState): void;
    public playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | undefined {
        const self = this;
        self._ensureInit();

        const animator = self._animator;
        const playState = !animator || self._initialized === false ? 'fatal' : animator.playState;
        if (value === undefined) {
            return playState as ja.AnimationPlaybackState;
        }

        if (playState === value) {
            /* do nothing */
        } else if (playState === 'fatal') {
            animator.cancel();
        } else if (value === 'finished') {
            animator.finish();
        } else if (value === 'idle') {
            animator.cancel();
        } else if (value === 'paused') {
            animator.pause();
        } else if (value === 'running') {
            animator.play();
        }
        return undefined;
    }

    private _ensureInit(): void {
        const self = this;
        const init = self._init as { (): Animation; };
        if (init) {
            self._init = undefined;
            self._initialized = false;
            self._animator = init();
            self._initialized = true;
        }
    }
}
