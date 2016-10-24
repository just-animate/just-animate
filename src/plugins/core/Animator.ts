import { chain, maxBy } from '../../common/lists';
import { deepCopyObject, inherit, resolve } from '../../common/objects';
import { isArray, isDefined, isNumber } from '../../common/type';
import { inRange } from '../../common/math';
import { invalidArg } from '../../common/errors';
import { duration, finish, cancel, pause } from '../../common/resources';
import { Dispatcher, IDispatcher } from './Dispatcher';
import { MixinService } from './MixinService';
import { ITimeLoop } from './TimeLoop';
import { getEasingFunction, getEasingString } from './easings';
import { parseUnit, createUnitResolver, getCanonicalTime } from '../../common/units';
import { queryElements } from '../../common/elements';

// todo: remove these imports as soon as possible

// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = 1.0 / 30;
const unitOut = {
    unit: undefined as string,
    value: undefined as number
};

export class Animator implements ja.IAnimator {
    private _currentIteration: number;
    private _currentTime: number;
    private _context: ja.IAnimationTimeContext;
    private _direction: ja.AnimationDirection;
    private _dispatcher: IDispatcher;
    private _duration: number;
    private _events: ja.ITimelineEvent[];
    private _playState: ja.AnimationPlaybackState;
    private _playbackRate: number;
    private _resolver: MixinService;
    private _timeLoop: ITimeLoop;
    private _totalIterations: number;
    private _plugins: ja.IPlugin[];

    constructor(resolver: MixinService, timeloop: ITimeLoop, plugins: ja.IPlugin[]) {
        const self = this;
        if (!isDefined(duration)) {
            throw invalidArg(duration);
        }

        self._context = {} as ja.IAnimationTimeContext;
        self._duration = 0;
        self._currentTime = undefined;
        self._currentIteration = undefined;
        self._playState = 'idle';
        self._playbackRate = 1;
        self._events = [];
        self._resolver = resolver;
        self._timeLoop = timeloop;
        self._plugins = plugins;
        self._dispatcher = Dispatcher();
        self._onTick = self._onTick.bind(self);
        self.on(finish, self._onFinish);
        self.on(cancel, self._onCancel);
        self.on(pause, self._onPause);

        // autoplay    
        self.play();

        return self;
    }

    public animate(options: ja.IAnimationOptions | ja.IAnimationOptions[]): ja.IAnimator {
        const self = this;
        if (isArray(options)) {
            for (let e of options as ja.IAnimationOptions[]) {
                self._addEvent(e);
            }
        } else {
            self._addEvent(options as ja.IAnimationOptions);
        }
        self._recalculate();
        return self;
    }
    public cancel(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger(cancel, [self]);
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
            return self._currentTime;
        }
        self._currentTime = value;
        return self;
    }
    public finish(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger(finish, [self]);
        return self;
    }
    public playbackRate(): number;
    public playbackRate(value: number): ja.IAnimator;
    public playbackRate(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._playbackRate;
        }
        self._playbackRate = value;
        return self;
    }
    public playState(): ja.AnimationPlaybackState;
    public playState(value: ja.AnimationPlaybackState): ja.IAnimator;
    public playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._playState;
        }
        self._playState = value;
        self._dispatcher.trigger('set', ['playbackState', value]);
        return self;
    }
    public off(eventName: string, listener: Function): ja.IAnimator {
        const self = this;
        self._dispatcher.off(eventName, listener);
        return self;
    }
    public on(eventName: string, listener: Function): ja.IAnimator {
        const self = this;
        self._dispatcher.on(eventName, listener);
        return self;
    }
    public pause(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger(pause, [self]);
        return self;
    }

    public play(): ja.IAnimator;
    public play(iterations: number): ja.IAnimator;
    public play(options: ja.IPlayOptions): ja.IAnimator;
    public play(options?: number | ja.IPlayOptions): ja.IAnimator {     
        const self = this;

        let totalIterations: number;
        let direction: ja.AnimationDirection;
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
            self._timeLoop.on(self._onTick);
        }
        return self;
    }
    public reverse(): ja.IAnimator {
        const self = this;
        self._playbackRate *= -1;
        return self;
    }

    private _recalculate(): void {
        const self = this;
        self._duration =  maxBy(self._events, (e: ja.ITimelineEvent) => e.startTimeMs + e.animator.totalDuration);
    }

    private _addEvent(options: ja.IAnimationOptions): void {
        const self = this;

        // resolve mixin properties     
        let event: ja.IAnimationOptions;
        if (options.mixins) {
            const mixinTarget = chain(options.mixins)
                .map((mixin: string) => {
                    const def = self._resolver.findAnimation(mixin);
                    if (!isDefined(def)) {
                        throw invalidArg('mixin');
                    }
                    return def;
                })
                .reduce((c: ja.IAnimationMixin, n: ja.IAnimationMixin) => deepCopyObject(n, c));

            event = inherit(options, mixinTarget);
        } else {
            event = options;
        }

        // set from and to relative to existing duration    
        parseUnit(event.from || 0, unitOut);
        event.from = (unitOut.value * (unitOut.unit === 's' ? 1000 : 1)) + self._duration;

        parseUnit(event.to || 0, unitOut);
        event.to = (unitOut.value * (unitOut.unit === 's' ? 1000 : 1)) + self._duration;

        // set easing to linear by default     
        const easingFn = getEasingFunction(event.easing);
        event.easing = getEasingString(event.easing);
        
        const delay = event.delay;
        const endDelay = event.endDelay;

        const targets = queryElements(event.targets) as HTMLElement[];
        const targetLength = targets.length;
        for (let i = 0, len = targetLength; i < len; i++) {
            const target = targets[i];          
            
            const ctx = {
                index: i,
                options: event,
                target: target,
                targets: targets
            };
            
            const delayUnit = createUnitResolver(resolve(delay, ctx) || 0)(i);
            const endDelayUnit = createUnitResolver(resolve(endDelay, ctx) || 0)(i);
            event.delay = getCanonicalTime(delayUnit) as number;
            event.endDelay = getCanonicalTime(endDelayUnit) as number;

            for (let plugin of self._plugins) {
                if (plugin.canHandle(event)) {
                    const animator = plugin.handle(ctx);

                    self._events.push({
                        animator: animator,
                        easingFn: easingFn,
                        endTimeMs: event.from + animator.totalDuration,
                        index: i,
                        startTimeMs: event.from,
                        target: target,
                        targets: targets
                    });
                }
            }
        }
    }
    private _onCancel(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._currentIteration = undefined;
        self._playState = 'idle';
        for (let evt of self._events) {
            evt.animator.playState('idle');
        }
    }
    private _onFinish(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._currentTime = undefined;
        self._currentIteration = undefined;        
        self._playState = 'finished';
        for (let evt of self._events) {
            evt.animator.playState('finished');
        }
    }
    private _onPause(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._playState = 'paused';
        for (let evt of self._events) {
            evt.animator.playState('paused');
        }
    }
    private _onTick(delta: number, runningTime: number): void {
        const self = this;
        const dispatcher = self._dispatcher;
        const playState = self._playState;
        const context = self._context;

        // canceled
        if (playState === 'idle') {
            dispatcher.trigger(cancel, [self]);
            return;
        }
        // finished
        if (playState === 'finished') {
            dispatcher.trigger(finish, [self]);
            return;
        }
        // paused
        if (playState === 'paused') {
            dispatcher.trigger(pause, [self]);
            return;
        }
        // running/pending

        // calculate running range
        const duration1 = self._duration;
        const totalIterations = self._totalIterations;
        
        let playbackRate = self._playbackRate;
        let isReversed = playbackRate < 0;
        let startTime = isReversed ? duration1 : 0;
        let endTime = isReversed ? 0 : duration1;
     
        if (self._playState === 'pending') {
            const currentTime2 = self._currentTime;
            const currentIteration = self._currentIteration;
            self._currentTime = currentTime2 === undefined || currentTime2 === endTime ? startTime : currentTime2;
            self._currentIteration = currentIteration === undefined || currentIteration === totalIterations ? 0 : currentIteration;
            self._playState = 'running';
        } 
        
        // calculate currentTime from delta
        let currentTime = self._currentTime + delta * playbackRate;
        let currentIteration = self._currentIteration;

        let isLastFrame = false;        
        // check if animation has finished
        if (!inRange(currentTime, startTime, endTime)) {
            isLastFrame = true;
            if (self._direction === 'alternate') {
                playbackRate = self._playbackRate * -1;
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
            context.playbackRate = playbackRate;
            context.iterations = currentIteration;            
            context.offset = undefined;
            context.computedOffset = undefined;
            context.target = undefined;
            context.targets = undefined;
            context.index = undefined;
            self._dispatcher.trigger('iteration', [context]);
        }

        self._currentIteration = currentIteration;        
        self._currentTime = currentTime;

        if (totalIterations === currentIteration) {
            dispatcher.trigger('finish', [self]);
            return;
        }

        // start animations if should be active and currently aren't   
        for (let evt of self._events) {
            const startTimeMs = playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            const endTimeMs = playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            const shouldBeActive = startTimeMs <= currentTime && currentTime <= endTimeMs;
            const animator = evt.animator;

            if (!shouldBeActive) {
                continue;
            }   
            
            const controllerState = animator.playState();
            
            // cancel animation if there was a fatal error
            if (controllerState === 'fatal') {
                dispatcher.trigger(cancel, [self]);
                return;
            }

            if (isLastFrame) {
                animator.restart();
            }

            if (controllerState !== 'running' || isLastFrame) {
                animator.playbackRate(playbackRate);
                animator.playState('running');
            }

            animator.playbackRate(playbackRate);
            
            self._dispatcher.trigger('update', () => {
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
                context.target = evt.target;
                context.targets = evt.targets;
                context.index = evt.index;
                return [context];
            });
        }
    }
}


interface IAnimationContext {
    _currentIteration: number;
    _currentTime: number;
    _events: ja.ITimelineEvent[];
    _onTick: { (delta: number, runningTime: number): void; };
    _playState: ja.AnimationPlaybackState;
    _timeLoop: ITimeLoop;
}
