import { KeyframeAnimator } from './animator/KeyframeAnimator';
import { isArray, isElement } from '../../common/type'; 
import { Animation, EffectTiming, Keyframe } from './waapi';
import * as transform from './transform/index';


export class KeyframePlugin implements ja.IPlugin<Element> {
    public canHandle(ctx: ja.AnimationTargetContext<Element>): boolean {
        return !!(ctx.options!.css) && isElement(ctx.target!);
    }
    
    public handle(timings: ja.AnimationTiming, ctx: ja.AnimationTargetContext<Element>): ja.IAnimationController {
        const animator = new KeyframeAnimator(() => initAnimator(timings, ctx));
        animator.totalDuration = timings.totalTime;
        return animator;
    }
}


export function initAnimator(timings: EffectTiming, ctx: ja.AnimationTargetContext<Element>): Animation {
    // process css as either keyframes or calculate what those keyframes should be   
    const options = ctx.options!;
    const target = ctx.target as HTMLElement;
    const css = options.css;

    let sourceKeyframes: ja.CssKeyframeOptions[];
    if (isArray(css)) {
        // if an array, no processing has to occur
        sourceKeyframes = css as ja.CssKeyframeOptions[];
        transform.expandOffsets(sourceKeyframes);
    } else {
        sourceKeyframes = [];
        transform.propsToKeyframes(css as ja.CssPropertyOptions, sourceKeyframes, ctx);
    }

    const targetKeyframes: Keyframe[] = [];

    transform.resolvePropertiesInKeyframes(sourceKeyframes, targetKeyframes, ctx);

    if (options.isTransition === true) {
        transform.addTransition(targetKeyframes, target);
    }

    transform.spaceKeyframes(targetKeyframes);
    transform.arrangeKeyframes(targetKeyframes);

    // sort by offset (should have all offsets assigned)
    targetKeyframes.sort(transform.keyframeOffsetComparer);    

    transform.fixPartialKeyframes(targetKeyframes);

    const animator = target['animate'](targetKeyframes, timings);
    animator.cancel();
    return animator;
}
