import {
    chain,
    createUnitResolver,
    deepCopyObject,
    getCanonicalTime,
    getTargets,
    inherit,
    inRange,
    invalidArg,
    isArray,
    isDefined,
    isFunction,
    isNumber,
    maxBy,
    parseUnit,
    resolve
} from '../../common';
import { dispatcher, IDispatcher } from './dispatcher';
import { getEasingFunction, getEasingString } from './easings';
import { IMixinService } from './mixins';
import { ITimeloop } from './TimeLoop';


const noop = function (): void { /* no operation */ };

// todo: remove these imports as soon as possible

// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = (1.0 / 60) + 7;

const resolveMixins = (options: ja.AnimationOptions, context: AnimationContext): ja.AnimationOptions => {
    // resolve mixin properties     
    if (!options.mixins) {
        return options;
    }

    const mixinTarget = chain(options.mixins)
        .map((mixin: string) => {
            const def = context.resolver.get(mixin);
            if (!isDefined(def)) {
                throw invalidArg('mixin');
            }
            return def;
        })
        .reduce((c: ja.AnimationMixin, n: ja.AnimationMixin) => deepCopyObject(n, c));

    return inherit(options, mixinTarget);
};

const addEvent = (options: ja.AnimationOptions, context: AnimationContext): void => {
    const event = resolveMixins(options, context);

    // set from and to relative to existing duration    
    event.from = getCanonicalTime(parseUnit(event.from || 0)) + context.duration;
    event.to = getCanonicalTime(parseUnit(event.to || 0)) + context.duration;

    // set easing to linear by default     
    const easingFn = getEasingFunction(event.easing as string);
    event.easing = getEasingString(event.easing as string);

    const delay = event.delay || 0;
    const endDelay = event.endDelay || 0;
    const plugins = context.plugins;

    const targets = getTargets(event.targets!) as HTMLElement[];
    const targetLength = targets.length;

    for (let i = 0, len = targetLength; i < len; i++) {
        const target = targets[i];

        const ctx = {
            index: i,
            options: event,
            target: target,
            targets: targets
        } as ja.AnimationTimeContext;

        // fire create function if provided (allows for modifying the target prior to animating)
        if (event.on && isFunction(event.on.create)) {
            event.on.create!(ctx);
        }

        const playFunction = event.on && isFunction(event.on.play) ? event.on.play as ja.AnimationEventListener : noop;
        const pauseFunction = event.on && isFunction(event.on.pause) ? event.on.pause as ja.AnimationEventListener : noop;
        const cancelFunction = event.on && isFunction(event.on.cancel) ? event.on.cancel as ja.AnimationEventListener : noop;
        const finishFunction = event.on && isFunction(event.on.finish) ? event.on.finish as ja.AnimationEventListener : noop;
        const updateFunction = event.on && isFunction(event.on.update) ? event.on.update as ja.AnimationEventListener : noop;

        const delayUnit = createUnitResolver(resolve(delay, ctx) || 0)(i);
        event.delay = getCanonicalTime(delayUnit) as number;

        const endDelayUnit = createUnitResolver(resolve(endDelay, ctx) || 0)(i);
        event.endDelay = getCanonicalTime(endDelayUnit) as number;

        const iterations = resolve(options.iterations as number, ctx) || 1;
        const iterationStart = resolve(options.iterationStart as number, ctx) || 0;
        const direction = resolve(options.direction as string, ctx) || undefined;
        const duration = (options.to as number) - (options.from as number);
        const fill = resolve(options.fill as string, ctx) || 'none';
        const totalTime = event.delay + ((iterations || 1) * duration) + event.endDelay;

        // note: don't unwrap easings so we don't break this later with custom easings
        const easing = getEasingString(options.easing as string);

        const timings: ja.AnimationTiming = {
            delay: event.delay,
            endDelay: event.endDelay,
            duration,
            iterations,
            iterationStart,
            fill,
            direction,
            easing,
            totalTime
        };
        for (let j = 0, len = plugins.length; j < len; j++) {
            const plugin = plugins[j];
            if (!plugin.canHandle(ctx)) {
                continue;
            }
            const a = plugin.handle(timings, ctx);

            context.events.push({
                animator: a,
                cancel: cancelFunction,
                easingFn: easingFn,
                endTimeMs: event.from + a.totalDuration,
                finish: finishFunction,
                index: i,
                pause: pauseFunction,
                play: playFunction,
                startTimeMs: event.from,
                target: target,
                targets: targets,
                update: updateFunction
            });
        }
    }
};

const onCancel = (context: AnimationContext): void => {
    context.timeLoop.off(context.onTick);
    context.currentTime = 0;
    context.currentIteration = undefined;
    context.playState = 'idle';
    const aCtx = context.context;

    for (const evt of context.events) {
        evt.animator.playState('idle');
    }
    for (const evt of context.events) {
        aCtx.target = evt.target;
        aCtx.targets = evt.targets;
        aCtx.index = evt.index;
        evt.cancel(aCtx);
    }
};

const onFinish = (context: AnimationContext): void => {
    context.timeLoop.off(context.onTick);
    context.currentTime = undefined;
    context.currentIteration = undefined;
    context.playState = 'finished';
    const aCtx = context.context;

    for (const evt of context.events) {
        evt.animator.playState('finished');
    }
    for (const evt of context.events) {
        aCtx.target = evt.target;
        aCtx.targets = evt.targets;
        aCtx.index = evt.index;
        evt.finish(aCtx);
    }
};

const onPause = (context: AnimationContext): void => {
    context.timeLoop.off(context.onTick);
    context.playState = 'paused';
    const aCtx = context.context;

    for (const evt of context.events) {
        evt.animator.playState('paused');
    }
    for (const evt of context.events) {
        aCtx.target = evt.target;
        aCtx.targets = evt.targets;
        aCtx.index = evt.index;
        evt.pause(aCtx);
    }
};

const recalculate = (ctx: AnimationContext): void => {
    ctx.duration = maxBy(ctx.events, (e: TimelineEvent) => e.startTimeMs + e.animator.totalDuration);
};


const tick = (ctx: AnimationContext, delta: number, runningTime: number): void => {
    const dispatcher = ctx.dispatcher;
    const playState = ctx.playState;
    const context = ctx.context;

    // canceled
    if (playState === 'idle') {
        dispatcher.trigger('cancel', context);
        return;
    }
    // finished
    if (playState === 'finished') {
        dispatcher.trigger('finish', context);
        return;
    }
    // paused
    if (playState === 'paused') {
        dispatcher.trigger('pause', context);
        return;
    }
    // running/pending

    // calculate running range
    const duration1 = ctx.duration;
    const totalIterations = ctx.totalIterations;

    let playbackRate = ctx.playbackRate as number;
    let isReversed = playbackRate < 0;
    let startTime = isReversed ? duration1 : 0;
    let endTime = isReversed ? 0 : duration1;

    if (ctx.playState === 'pending') {
        const currentTime2 = ctx.currentTime;
        const currentIteration = ctx.currentIteration;
        ctx.currentTime = currentTime2 === undefined || currentTime2 === endTime ? startTime : currentTime2;
        ctx.currentIteration = currentIteration === undefined || currentIteration === totalIterations ? 0 : currentIteration;
        ctx.playState = 'running';
    }

    // calculate currentTime from delta
    let currentTime = ctx.currentTime + delta * playbackRate;
    let currentIteration = ctx.currentIteration;

    let isLastFrame = false;
    // check if animation has finished
    if (!inRange(currentTime, startTime, endTime)) {
        isLastFrame = true;
        if (ctx.direction === 'alternate') {
            playbackRate = ctx.playbackRate * -1;
            ctx.playbackRate = playbackRate;

            isReversed = playbackRate < 0;
            startTime = isReversed ? duration1 : 0;
            endTime = isReversed ? 0 : duration1;
        }

        currentIteration++;
        currentTime = startTime;

        context.currentTime = currentTime;
        context.delta = delta;
        context.duration = endTime - startTime;
        context.playbackRate = playbackRate as number;
        context.iterations = currentIteration;
        context.offset = undefined;
        context.computedOffset = undefined;
        context.target = undefined;
        context.targets = undefined;
        context.index = undefined;
        ctx.dispatcher.trigger('iteration', context);
    }

    ctx.currentIteration = currentIteration;
    ctx.currentTime = currentTime;

    dispatcher.trigger('update', context);

    if (totalIterations === currentIteration) {
        dispatcher.trigger('finish', context);
        return;
    }

    // start animations if should be active and currently aren't  
    for (let i = 0, len = ctx.events.length; i < len; i++) {
        const evt = ctx.events[i];
        const startTimeMs = playbackRate >= 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
        const endTimeMs = playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
        const shouldBeActive = startTimeMs <= currentTime && currentTime <= endTimeMs;
        const a = evt.animator;

        if (!shouldBeActive) {
            continue;
        }

        const controllerState = a.playState();

        // cancel animation if there was a fatal error
        if (controllerState === 'fatal') {
            dispatcher.trigger('cancel', context);
            return;
        }

        if (isLastFrame) {
            a.restart();
        }

        let playedThisFrame = false;
        if (controllerState !== 'running' || isLastFrame) {
            a.playbackRate(playbackRate);
            a.playState('running');
            playedThisFrame = true;
        }

        a.playbackRate(playbackRate);

        const shouldTriggerPlay = evt.play !== noop && playedThisFrame;
        const shouldTriggerUpdate = evt.update !== noop;

        if (shouldTriggerPlay || shouldTriggerUpdate) {
            context.target = evt.target;
            context.targets = evt.targets;
            context.index = evt.index;
            context.currentTime = undefined;
            context.delta = undefined;
            context.duration = undefined;
            context.offset = undefined;
            context.playbackRate = undefined;
            context.iterations = undefined;
            context.computedOffset = undefined;
        }

        if (shouldTriggerPlay) {
            evt.play(context);
        }

        if (shouldTriggerUpdate) {
            const relativeDuration = evt.endTimeMs - evt.startTimeMs;
            const relativeCurrentTime = currentTime - evt.startTimeMs;
            const timeOffset = relativeCurrentTime / relativeDuration;
            // set context object values for this update cycle            
            context.currentTime = relativeCurrentTime;
            context.delta = delta;
            context.duration = relativeDuration;
            context.offset = timeOffset;
            context.playbackRate = playbackRate;
            context.iterations = currentIteration;
            context.computedOffset = evt.easingFn(timeOffset);

            evt.update(context);
        }
    }
};

export const animator = (resolver: IMixinService, timeloop: ITimeloop, plugins: ja.IPlugin<{}>[]): ja.IAnimator => {
    const ctx: AnimationContext = {
        currentIteration: undefined,
        currentTime: undefined,
        direction: undefined,
        dispatcher: dispatcher(),
        duration: 0,
        events: [],
        playState: 'idle',
        playbackRate: 1,
        totalIterations: 0,
        resolver: resolver,
        timeLoop: timeloop,
        context: {} as ja.AnimationTimeContext,
        plugins: plugins,
        onTick(delta: number, runningTime: number): void {
            tick(ctx, delta, runningTime);
        }
    };

    const self: ja.IAnimator = {
        animate(options: ja.AnimationOptions | ja.AnimationOptions[]): ja.IAnimator {
            if (isArray(options)) {
                for (const e of options as ja.AnimationOptions[]) {
                    addEvent(e, ctx);
                }
            } else {
                addEvent(options as ja.AnimationOptions, ctx);
            }
            recalculate(ctx);
            return self;
        },
        cancel(): ja.IAnimator {
            ctx.dispatcher.trigger('cancel', ctx.context);
            return self;
        },
        duration(): number {
            return ctx.duration;
        },
        currentTime(value?: number): number | ja.IAnimator {
            if (!isDefined(value)) {
                return ctx.currentTime as number;
            }
            ctx.currentTime = value;
            return self;
        },
        finish(): ja.IAnimator {
            ctx.dispatcher.trigger('finish', ctx.context);
            return self;
        },
        playbackRate(value?: number): number | ja.IAnimator {
            if (!isDefined(value)) {
                return ctx.playbackRate as number;
            }
            ctx.playbackRate = value;
            return self;
        },
        playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | ja.IAnimator {
            if (!isDefined(value)) {
                return ctx.playState as ja.AnimationPlaybackState;
            }
            ctx.playState = value;
            return self;
        },
        off(event: string | ja.AnimationEvent, listener: ja.AnimationEventListener | undefined = undefined): ja.IAnimator {
            if (typeof event === 'string' && listener !== undefined) {
                ctx.dispatcher.off(event, listener);
            } else {
                const eventConfig = event as ja.AnimationEvent;
                for (const eventName in eventConfig) {
                    const listener1 = eventConfig[eventName];
                    if (listener1) {
                        ctx.dispatcher.off(eventName, listener1);
                    }
                }
            }
            return self;
        },
        on(event: ja.AnimationEventType | ja.AnimationEvent, listener: ja.AnimationEventListener | undefined = undefined): ja.IAnimator {
            if (typeof event === 'string' && listener !== undefined) {
                ctx.dispatcher.on(event, listener);
            } else {
                const eventConfig = event as ja.AnimationEvent;
                for (const eventName in eventConfig) {
                    const listener1 = eventConfig[eventName];
                    if (listener1) {
                        ctx.dispatcher.on(eventName as ja.AnimationEventType, listener1);
                    }
                }
            }
            return self;
        },
        pause(): ja.IAnimator {
            ctx.dispatcher.trigger('pause', ctx.context);
            return self;
        },
        play(options?: number | ja.IPlayOptions): ja.IAnimator {
            let totalIterations: number = 0;
            let direction: ja.AnimationDirection = 'normal';
            if (options) {
                if (!isNumber(options)) {
                    const playOptions = options as ja.IPlayOptions;
                    if (playOptions.iterations) {
                        totalIterations = playOptions.iterations;
                    }
                    if (playOptions.direction) {
                        direction = playOptions.direction;
                    }
                } else {
                    totalIterations = options as number;
                }
            }

            if (!totalIterations) {
                totalIterations = 1;
            }
            if (!direction) {
                direction = 'normal';
            }

            ctx.totalIterations = totalIterations;
            ctx.direction = direction;

            if (!(ctx.playState === 'running' || ctx.playState === 'pending')) {
                ctx.playState = 'pending';
                ctx.timeLoop.on(ctx.onTick);
                ctx.dispatcher.trigger('play', ctx.context);
            }
            return self;
        },
        reverse(): ja.IAnimator {
            ctx.playbackRate *= -1;
            return self;
        }
    };

    self.on('finish', () => onFinish(ctx));
    self.on('cancel', () => onCancel(ctx));
    self.on('pause', () => onPause(ctx));

    // autoplay    
    self.play();

    return self;
};

type TimelineEvent = {
    animator: ja.IAnimationController;
    cancel: ja.AnimationEventListener;
    easingFn: ja.Func<number>;
    endTimeMs: number;
    finish: ja.AnimationEventListener;
    index: number;
    pause: ja.AnimationEventListener;
    play: ja.AnimationEventListener;
    startTimeMs: number;
    target: any;
    targets: any[];
    update: ja.AnimationEventListener;
};

type AnimationContext = {
    currentIteration: number | undefined;
    currentTime: number | undefined;
    context: ja.AnimationTimeContext;
    direction: ja.AnimationDirection | undefined;
    dispatcher: IDispatcher<ja.AnimationTimeContext, ja.AnimationEventType>;
    duration: number;
    events: TimelineEvent[];
    playState: ja.AnimationPlaybackState | undefined;
    playbackRate: number | undefined;
    plugins: ja.IPlugin<any>[];
    resolver: IMixinService;
    timeLoop: ITimeloop;
    totalIterations: number;
    onTick(delta: number, runningTime: number): void;
};
