import { isArray, isElement } from '../../common';
import { KeyframeAnimator } from './animator';
import {
    addTransition,
    arrangeKeyframes,
    expandOffsets,
    fixPartialKeyframes,
    keyframeOffsetComparer,
    propsToKeyframes,
    resolvePropertiesInKeyframes,
    spaceKeyframes
} from './transform';
import { Animation, EffectTiming, Keyframe } from './waapi';


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

export const initAnimator = (timings: EffectTiming, ctx: ja.AnimationTargetContext<Element>): Animation => {
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
