import {each, map, pushAll, maxBy} from '../../common/lists';
import {inherit} from '../../common/objects';
import {isArray, isDefined, isString} from '../../common/type';
import {inRange} from '../../common/math';
import {invalidArg} from '../../common/errors';
import {duration, finish, cancel, pause, nil} from '../../common/resources';

import {Dispatcher, IDispatcher} from './Dispatcher';
import {MixinService} from './MixinService';
import {ITimeLoop} from './TimeLoop';
import {getEasingString} from './easings';
import {fromTime, Unit} from '../../common/units';

// todo: remove these imports as soon as possible

// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = 1.0 / 30;
const unitOut = Unit();

export class Animator implements ja.IAnimator {
    private _currentTime: number;
    private _context: ja.IAnimationTimeContext;
    private _dispatcher: IDispatcher;
    private _duration: number;
    private _events: ja.ITimelineEvent[];
    private _playState: ja.AnimationPlaybackState;
    private _playbackRate: number;
    private _resolver: MixinService;
    private _timeLoop: ITimeLoop;
    private _plugins: ja.IPlugin[];

    constructor(resolver: MixinService, timeloop: ITimeLoop, plugins: ja.IPlugin[]) {
        const self = this;
        if (!isDefined(duration)) {
            throw invalidArg(duration);
        }

        self._context = {} as ja.IAnimationTimeContext;        
        self._duration = 0;
        self._currentTime = nil;
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
            each(options as ja.IAnimationOptions[], (e: ja.IAnimationOptions) => self._addEvent(e));
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
    public play(): ja.IAnimator {
        const self = this;
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
        const endsAt = maxBy(self._events, (e: ja.ITimelineEvent) => e.startTimeMs + e.animator.totalDuration);
        self._duration = endsAt;
    }

    private _resolveMixin(mixin: string, event: ja.IAnimationOptions): void {
        const self = this;
        const def = self._resolver.findAnimation(mixin);
        if (!isDefined(def)) {
            throw invalidArg('mixin');
        }
        inherit(event, def);
    }

    private _addEvent(event: ja.IAnimationOptions): void {
        const self = this;

        // resolve mixin properties        
        if (event.mixins) {
            if (!isString(event.mixins)) {
                each(event.mixins as string[], (mixin: string) => {
                    self._resolveMixin(mixin as string, event);
                });
            } else {
                self._resolveMixin(event.mixins as string, event);                
            }
        }

        // set from and to relative to existing duration    
        fromTime(event.from || 0, unitOut);
        event.from = unitOut.value + this._duration;

        fromTime(event.to || 0, unitOut);
        event.to = unitOut.value + this._duration;

        // set easing to linear by default      
        event.easing = getEasingString(event.easing);

        each(this._plugins, (plugin: ja.IPlugin) => {
            if (plugin.canHandle(event)) {
                const animators = plugin.handle(event);
                const events = map(animators, (animator: ja.IAnimationController) => {
                    return {
                        animator: animator,
                        endTimeMs: event.from + animator.totalDuration,
                        startTimeMs: event.from
                    };
                });
                pushAll(self._events, events);
            }
        });
    }
    private _onCancel(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'idle';
        each(self._events, (evt: ja.ITimelineEvent) => { evt.animator.playState('idle'); });
    }
    private _onFinish(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'finished';
        each(self._events, (evt: ja.ITimelineEvent) => { evt.animator.playState('finished'); });
    }
    private _onPause(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._playState = 'paused';
        each(self._events, (evt: ja.ITimelineEvent) => { evt.animator.playState('paused'); });
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
        const playbackRate = self._playbackRate;
        const isReversed = playbackRate < 0;

        // calculate running range
        const duration1 = self._duration;
        const startTime = isReversed ? duration1 : 0;
        const endTime = isReversed ? 0 : duration1;

        if (self._playState === 'pending') {
            const currentTime = self._currentTime;
            self._currentTime = currentTime === nil || currentTime === endTime ? startTime : currentTime;
            self._playState = 'running';
        }

        // calculate currentTime from delta
        const currentTime = self._currentTime + delta * playbackRate;
        self._currentTime = currentTime;

        // check if animation has finished
        if (!inRange(currentTime, startTime, endTime)) {
            dispatcher.trigger(finish, [self]);
            return;
        }

        // start animations if should be active and currently aren't   
        const events = self._events;
        const eventLength = events.length;
        for (let i = 0; i < eventLength; i++) {
            const evt = events[i];
            const startTimeMs = playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            const endTimeMs = playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            const shouldBeActive = startTimeMs <= currentTime && currentTime <= endTimeMs;

            if (shouldBeActive) {
                const animator = evt.animator;
                if (animator.playState() !== 'running') {
                    animator.playbackRate(playbackRate);
                    animator.playState('running');
                }
                animator.playbackRate(playbackRate);
                if (animator.onupdate) {
                    // calculate relative timing properties
                    const relativeDuration = evt.endTimeMs - evt.startTimeMs;
                    const relativeCurrentTime = currentTime - evt.startTimeMs;
                    const offset = relativeCurrentTime / relativeDuration;

                    // set context object values for this update cycle            
                    context.currentTime = relativeCurrentTime;
                    context.delta = delta;
                    context.duration = relativeDuration;
                    context.offset = offset;
                    context.playbackRate = playbackRate;
                    animator.onupdate(context);
                }
            }
        }
    }
}


interface IAnimationContext {
    _currentTime: number;
    _dispatcher: IDispatcher;
    _duration: number;
    _events: ja.ITimelineEvent[];
    _onTick: { (delta: number, runningTime: number): void; };
    _playState: ja.AnimationPlaybackState;
    _playbackRate: number;
    _resolver: MixinService;
    _timeLoop: ITimeLoop;
}


