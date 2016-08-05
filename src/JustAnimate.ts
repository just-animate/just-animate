import {each, map} from './helpers/lists';
import {createTimelineAnimator} from './core/TimelineAnimator';
import {createLoop, ITimeLoop} from './core/TimeLoop';
import {createMultiAnimator} from './core/Animator';
import {easings} from './easings';
import {pipe} from './helpers/functions';
import {extend} from './helpers/objects';
import {isString} from './helpers/type';
import {normalizeProperties, normalizeKeyframes, spaceKeyframes} from './helpers/keyframes';
import {queryElements} from './helpers/elements';
import {createKeyframeAnimation} from './core/KeyframeAnimation';

const globalAnimations: ja.IMap<ja.IAnimationOptions> = {};

export function JustAnimate(): ja.IAnimationManager {
    let self = this;
    self = self instanceof JustAnimate ? self : Object.create(JustAnimate.prototype);
    self._registry = {};
    self._timeLoop = createLoop();
    return self;
}
 
(JustAnimate as any).inject = inject;

JustAnimate.prototype = {
    _registry: undefined as { [key: string]: ja.IEffectOptions },
    _timeLoop: undefined as ITimeLoop,
    animate(keyframesOrName: string | ja.IKeyframeOptions[], targets: ja.ElementSource, timings?: ja.IAnimationEffectTiming): ja.IAnimator {
        const a = resolveArguments(this, keyframesOrName, timings);
        const elements = queryElements(targets);
        const effects =  map(elements, (e: any) => createKeyframeAnimation(e, a.keyframes, a.timings));
        const animator = createMultiAnimator(effects, this._timeLoop);
        animator.play();

        return animator;
    },
    animateSequence(options: ja.ISequenceOptions): ja.IAnimator {
        let offset = 0;

        const effectOptions = map(options.steps, (step: ja.ISequenceEvent) => {
            const a = resolveArguments(this, step.name || step.keyframes, step.timings) as ja.IEffectOptions&{targets: ja.ElementSource};
            const startDelay = a.timings.delay || 0;
            const endDelay = a.timings.endDelay || 0;
            const duration = a.timings.duration || 0;
            a.timings.delay = offset + startDelay;
            a.targets = step.el;
            offset += startDelay + duration + endDelay;
            return a;
        });

        each(effectOptions, (e:ja.IEffectOptions&{targets: ja.ElementSource}) => {
            e.timings.endDelay = offset - ((e.timings.delay || 0) + e.timings.duration + (e.timings.endDelay || 0));
        });

        const effects: ja.IAnimator[] = [];
        each(effectOptions, (a: ja.IEffectOptions & { targets: ja.ElementSource }) => {
             const elements = queryElements(a.targets);
             const animations =  map(elements, (e: Element) => createKeyframeAnimation(e, a.keyframes, a.timings));
             
             if (animations.length === 1) {
                 effects.push(animations[0]);
             } else if (animations.length > 1) {
                 effects.push(createMultiAnimator(animations, this._timeLoop));
             }
        });

        const animator = createMultiAnimator(effects, this._timeLoop);
        if (options.autoplay) {
            animator.play();
        }
        return animator;
    },
    animateTimeline(options: ja.ITimelineOptions): ja.IAnimator {
        options.events.forEach(e => {
            const a = resolveArguments(this, e.name || e.keyframes, e.timings) as ja.IEffectOptions & { targets: ja.ElementSource };
            e.keyframes = a.keyframes;
            e.timings = a.timings;
        });

        return createTimelineAnimator(options, this._timeLoop);
    },
    findAnimation(name: string): ja.IEffectOptions {
        return this._registry[name] || globalAnimations[name] || undefined;
    },
    register(animationOptions: ja.IAnimationOptions): void {        
        this._registry[animationOptions.name] = animationOptions;
    },
    inject: inject
};

function inject(animations: ja.IAnimationOptions[]): void {
    each(animations, (a: ja.IAnimationOptions) => globalAnimations[a.name] = a);
}

function resolveArguments(ctx: ja.IAnimationManager, keyframesOrName: string|ja.IKeyframeOptions[],  timings: ja.IAnimationEffectTiming): ja.IEffectOptions {

    let keyframes: ja.IKeyframeOptions[];
    if (isString(keyframesOrName)) {
        // if keyframes is a string, lookup keyframes from registry
        const definition = ctx.findAnimation(keyframesOrName as string);
        keyframes = pipe(map(definition.keyframes, normalizeProperties), spaceKeyframes, normalizeKeyframes);

        // use registered timings as default, then load timings from params           
        timings = extend({}, definition.timings, timings);
    } else {
        // otherwise, translate keyframe properties
        keyframes = pipe(map(keyframesOrName as ja.IKeyframeOptions[], normalizeProperties), spaceKeyframes, normalizeKeyframes);
    }

    if (timings && timings.easing) {
        // if timings contains an easing property, 
        const easing = easings[timings.easing];
        if (easing) {
            timings.easing = easing;
        }
    }

    return {
        keyframes: keyframes,
        timings: timings
    };
}
