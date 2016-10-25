import { KeyframeAnimator } from '../waapi/KeyframeAnimator';
import { initAnimator } from './KeyframeTransformers';
import { isElement } from '../../common/type';

export class KeyframePlugin implements ja.IPlugin<Element> {
    public canHandle(ctx: ja.AnimationTargetContext<Element>): boolean {
        return !!(ctx.options!.css) && isElement(ctx.target!);
    }

    public handle(timings: ja.IAnimationTiming, ctx: ja.AnimationTargetContext<Element>): ja.IAnimationController {
        const animator = new KeyframeAnimator(() => initAnimator(timings, ctx));
        animator.totalDuration = timings.totalTime;
        return animator;
    }
}
