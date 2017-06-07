import { css, cssFunction } from 'just-curves';
import {
    _,
    createUnitResolver,
    getCanonicalTime,
    getTargets,
    inRange,
    isArray,
    isDefined,
    isFunction,
    isNumber,
    maxBy,
    parseUnit,
    resolve,
    toCamelCase
} from '../utils';

import { keyframePlugin, timeloop, dispatcher, IDispatcher } from '.';

const noop = (): void => { /* no operation */ };

// todo: remove these imports as soon as possible

// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = (1.0 / 60) + 7;


const tick = (self: AnimationContext, delta: number): void => {
    const dispatcher = self._dispatcher;
    const playState = self._playState;
    const context = self._context;

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
    const duration1 = self._duration;
    const totalIterations = self._totalIterations;

    let playbackRate = self._playbackRate as number;
    let isReversed = playbackRate < 0;
    let startTime = isReversed ? duration1 : 0;
    let endTime = isReversed ? 0 : duration1;

    if (self._playState === 'pending') {
        const currentTime2 = self._currentTime;
        const currentIteration = self._currentIteration;
        self._currentTime = currentTime2 === _ || currentTime2 === endTime ? startTime : currentTime2;
        self._currentIteration = currentIteration === _ || currentIteration === totalIterations ? 0 : currentIteration;
        self._playState = 'running';
    }

    // calculate currentTime from delta
    let currentTime = self._currentTime + delta * playbackRate;
    let currentIteration = self._currentIteration || 0;

    let isLastFrame = false;
    // check if animation has finished
    if (!inRange(currentTime, startTime, endTime)) {
        isLastFrame = true;
        if (self._direction === 'alternate') {
            playbackRate = (self._playbackRate || 0) * -1;
            self._playbackRate = playbackRate;

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
        context.offset = _;
        context.computedOffset = _;
        context.target = _;
        context.targets = _;
        context.index = _;
        self._dispatcher.trigger('iteration', context);
    }

    self._currentIteration = currentIteration;
    self._currentTime = currentTime;

    dispatcher.trigger('update', context);

    if (totalIterations === currentIteration) {
        dispatcher.trigger('finish', context);
        return;
    }

    // start animations if should be active and currently aren't   
    for (const evt of self._events) {
        const startTimeMs = playbackRate >= 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
        const endTimeMs = playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
        const shouldBeActive = startTimeMs <= currentTime && currentTime <= endTimeMs;
        const animator = evt.animator;

        if (!shouldBeActive) {
            continue;
        }

        const controllerState = animator.playState();

        // cancel animation if there was a fatal error
        if (controllerState === 'fatal') {
            dispatcher.trigger('cancel', context);
            return;
        }

        if (isLastFrame) {
            animator.restart();
        }

        let playedThisFrame = false;
        if (controllerState !== 'running' || isLastFrame) {
            animator.playbackRate(playbackRate);
            animator.playState('running');
            playedThisFrame = true;
        }

        animator.playbackRate(playbackRate);

        const shouldTriggerPlay = evt.play !== noop && playedThisFrame;
        const shouldTriggerUpdate = evt.update !== noop;

        if (shouldTriggerPlay || shouldTriggerUpdate) {
            context.target = evt.target;
            context.targets = evt.targets;
            context.index = evt.index;
            context.currentTime = _;
            context.delta = _;
            context.duration = _;
            context.offset = _;
            context.playbackRate = _;
            context.iterations = _;
            context.computedOffset = _;
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

export class Animator implements ja.IAnimator {
    private _currentIteration: number;
    private _currentTime: number;
    private _context: ja.AnimationTimeContext;
    private _direction: ja.AnimationDirection;
    private _dispatcher: IDispatcher<ja.AnimationTimeContext>;
    private _duration: number;
    private _events: TimelineEvent[];
    private _playState: ja.AnimationPlaybackState;
    private _playbackRate: number;
    private _totalIterations: number;
    private _onTick: { (delta: number, runningTime: number): void };

    constructor() {
        const self = this;
        self._context = {} as ja.AnimationTimeContext;
        self._duration = 0;
        self._currentTime = _;
        self._currentIteration = _;
        self._playState = 'idle';
        self._playbackRate = 1;
        self._events = [];
        self._dispatcher = dispatcher();
        self._onTick = (delta: number): void => tick(self as any as AnimationContext, delta);

        self.on('finish', () => self._onFinish());
        self.on('cancel', () => self._onCancel());
        self.on('pause', () => self._onPause());

        // autoplay    
        self.play();

        return self;
    }

    public animate(options: ja.AnimationOptions | ja.AnimationOptions[]): ja.IAnimator {
        const self = this;
        if (isArray(options)) {
            for (const e of options as ja.AnimationOptions[]) {
                self._addEvent(e);
            }
        } else {
            self._addEvent(options as ja.AnimationOptions);
        }
        self._recalculate();
        return self;
    }
    public cancel(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger('cancel', self._context);
        return self;
    }
    public duration(): number {
        return this._duration;
    }
    public currentTime(): number;
    public currentTime(value: number): ja.IAnimator;
    public currentTime(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._currentTime as number;
        }
        self._currentTime = value;
        return self;
    }
    public finish(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger('finish', self._context);
        return self;
    }
    public playbackRate(): number;
    public playbackRate(value: number): ja.IAnimator;
    public playbackRate(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._playbackRate as number;
        }
        self._playbackRate = value;
        return self;
    }
    public playState(): ja.AnimationPlaybackState;
    public playState(value: ja.AnimationPlaybackState): ja.IAnimator;
    public playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._playState as ja.AnimationPlaybackState;
        }
        self._playState = value;
        return self;
    }

    public off(eventConfig: ja.AnimationEvent): ja.IAnimator;

    public off(eventName: string, listener: ja.AnimationEventListener): ja.IAnimator;
    public off(event: string | ja.AnimationEvent, listener: ja.AnimationEventListener = _): ja.IAnimator {
        const self = this;
        if (typeof event === 'string' && listener !== _) {
            self._dispatcher.off(event, listener);
        } else {
            const eventConfig = event as ja.AnimationEvent;
            for (const eventName in eventConfig) {
                const listener1 = eventConfig[eventName];
                if (listener1) {
                    self._dispatcher.off(eventName, listener1);
                }
            }
        }
        return self;
    }

    public on(eventConfig: ja.AnimationEvent): ja.IAnimator;

    public on(eventName: ja.AnimationEventType, listener: ja.AnimationEventListener): ja.IAnimator;
    public on(event: ja.AnimationEventType | ja.AnimationEvent, listener: ja.AnimationEventListener = _): ja.IAnimator {
        const self = this;
        if (typeof event === 'string' && listener !== _) {
            self._dispatcher.on(event, listener);
        } else {
            const eventConfig = event as ja.AnimationEvent;
            for (const eventName in eventConfig) {
                const listener1 = eventConfig[eventName];
                if (listener1) {
                    self._dispatcher.on(eventName as ja.AnimationEventType, listener1);
                }
            }
        }
        return self;
    }
    public pause(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger('pause', self._context);
        return self;
    }

    public play(): ja.IAnimator;
    public play(iterations: number): ja.IAnimator;
    public play(options: ja.IPlayOptions): ja.IAnimator;
    public play(options?: number | ja.IPlayOptions): ja.IAnimator {
        const self = this;

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

        self._totalIterations = totalIterations;
        self._direction = direction;

        if (!(self._playState === 'running' || self._playState === 'pending')) {
            self._playState = 'pending';
            timeloop.on(self._onTick);
            self._dispatcher.trigger('play', self._context);
        }
        return self;
    }
    public reverse(): ja.IAnimator {
        const self = this;
        self._playbackRate = (self._playbackRate || 0) * -1;
        return self;
    }

    private _recalculate(): void {
        const self = this;
        self._duration = maxBy(self._events, (e: TimelineEvent) => e.startTimeMs + e.animator.totalDuration);
    }

    private _addEvent(event: ja.AnimationOptions): void {
        const self = this;

        // set from and to relative to existing duration    
        event.from = getCanonicalTime(parseUnit(event.from || 0)) + self._duration;
        event.to = getCanonicalTime(parseUnit(event.to || 0)) + self._duration;

        // set easing to linear by default     
        const easingFn = cssFunction(event.easing || css.ease);
        event.easing = css[toCamelCase(event.easing)] || event.easing || css.ease;

        const delay = event.delay || 0;
        const endDelay = event.endDelay || 0;

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

            const iterations = resolve(event.iterations as number, ctx) || 1;
            const iterationStart = resolve(event.iterationStart as number, ctx) || 0;
            const direction = resolve(event.direction as string, ctx) || _;
            const duration = +event.to - +event.from;
            const fill = resolve(event.fill as string, ctx) || 'none';
            const totalTime = event.delay + ((iterations || 1) * duration) + event.endDelay;

            // note: don't unwrap easings so we don't break this later with custom easings
            const easing = css[toCamelCase(event.easing)] || event.easing || css.ease;

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

            const animator = keyframePlugin.handle(timings, ctx);

            self._events.push({
                animator: animator,
                cancel: cancelFunction,
                easingFn: easingFn,
                endTimeMs: event.from + animator.totalDuration,
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
    private _onCancel(): void {
        const self = this;
        const context = self._context;

        timeloop.off(self._onTick);
        self._currentTime = 0;
        self._currentIteration = _;
        self._playState = 'idle';
        for (const evt of self._events) {
            evt.animator.playState('idle');
        }
        for (const evt of self._events) {
            context.target = evt.target;
            context.targets = evt.targets;
            context.index = evt.index;
            evt.cancel(self._context);
        }
    }
    private _onFinish(): void {
        const self = this;
        const context = self._context;
        timeloop.off(self._onTick);
        self._currentTime = _;
        self._currentIteration = _;
        self._playState = 'finished';
        for (const evt of self._events) {
            evt.animator.playState('finished');
        }
        for (const evt of self._events) {
            context.target = evt.target;
            context.targets = evt.targets;
            context.index = evt.index;
            evt.finish(self._context);
        }
    }
    private _onPause(): void {
        const self = this;
        const context = self._context;
        timeloop.off(self._onTick);
        self._playState = 'paused';
        for (const evt of self._events) {
            evt.animator.playState('paused');
        }
        for (const evt of self._events) {
            context.target = evt.target;
            context.targets = evt.targets;
            context.index = evt.index;
            evt.pause(self._context);
        }
    }

}

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
    _currentIteration: number;
    _currentTime: number;
    _context: ja.AnimationTimeContext;
    _direction: ja.AnimationDirection;
    _dispatcher: IDispatcher<ja.AnimationTimeContext>;
    _duration: number;
    _events: TimelineEvent[];
    _playState: ja.AnimationPlaybackState;
    _playbackRate: number;
    _totalIterations: number;
};

