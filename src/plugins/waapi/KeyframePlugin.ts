import { KeyframeAnimator } from '../waapi/KeyframeAnimator';
import { createUnitResolver, getCanonicalTime } from '../../common/units';
import { getEasingString } from '../core/easings';
import { resolve } from '../../common/objects';
import { initAnimator } from './KeyframeTransformers';

export class KeyframePlugin implements ja.IPlugin {
    public canHandle(options: ja.IAnimationOptions): boolean {
        return !!(options.css);
    }

    public handle(ctx: ja.CreateAnimationContext<HTMLElement>): ja.IAnimationController {
        const options = ctx.options;
        const delay = getCanonicalTime(createUnitResolver(resolve(options.delay, ctx) || 0)(ctx.index)) as number;
        const endDelay = getCanonicalTime(createUnitResolver(resolve(options.endDelay, ctx) || 0)(ctx.index)) as number;

        const iterations = resolve(options.iterations, ctx) || 1;
        const iterationStart = resolve(options.iterationStart, ctx) || 0;
        const direction = resolve(options.direction, ctx) || undefined;
        const duration = options.to - options.from;
        const fill = resolve(options.fill, ctx) || 'none';
        const totalTime = delay + ((iterations || 1) * duration) + endDelay;

        // note: don't unwrap easings so we don't break this later with custom easings
        const easing = getEasingString(options.easing);

        const timings = {
            delay,
            endDelay,
            duration,
            iterations,
            iterationStart,
            fill,
            direction,
            easing
        };

        const animator = new KeyframeAnimator(() => initAnimator(timings, ctx));
        animator.totalDuration = totalTime;
        return animator;
    }
}
