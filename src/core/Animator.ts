import {each, map, pushAll, maxBy} from '../helpers/lists';
import {expand, inherit} from '../helpers/objects';
import {isArray, isDefined, isFunction} from '../helpers/type';
import {inRange} from '../helpers/math';
import {queryElements} from '../helpers/elements';
import {Dispatcher, IDispatcher} from './Dispatcher';
import {KeyframeAnimation} from './KeyframeAnimation';
import {ITimeLoop} from './TimeLoop';
import {invalidArg} from '../helpers/errors';
import {pipe} from '../helpers/functions';
import {duration, finish, cancel, pause} from '../helpers/resources';
import {nothing} from '../helpers/resources';
import {easings} from './easings';
import {normalizeProperties, normalizeKeyframes, spaceKeyframes} from '../helpers/keyframes';

// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = 1.0 / 30;


export function Animator(resolver: ja.IAnimationResolver, timeloop: ITimeLoop): ja.IAnimator {
    const self = this instanceof Animator ? this : Object.create(Animator.prototype);
    if (!isDefined(duration)) {
        throw invalidArg(duration);
    }

    self._duration = 0;
    self._totalDuration = 0;
    self._currentTime = nothing;
    self._iterationStart = 0;
    self._iterations = 1;
    self._lastTick = nothing;
    self._playState = 'idle';
    self._playbackRate = 1;
    self._startTime = 0;
    self._events = [];
    self._resolver = resolver;
    self._timeLoop = timeloop;
    self._dispatcher = Dispatcher();
    self._onTick = self._onTick.bind(self);
    self.on(finish, self._onFinish);
    self.on(cancel, self._onCancel);
    self.on(pause, self._onPause);

    return self;
}

Animator.prototype = {
    _currentTime: nothing as number,
    _dispatcher: nothing as IDispatcher,
    _duration: nothing as number,
    _endTime: nothing as number,
    _events: nothing as ITimelineEvent[],
    _iterationStart: nothing as number,
    _iterations: nothing as number,
    _lastTick: nothing as number,
    _playState: nothing as ja.AnimationPlaybackState,
    _playbackRate: nothing as number,
    _resolver: nothing as ja.IAnimationResolver,
    _startTime: nothing as number,
    _timeLoop: nothing as ITimeLoop,
    _totalDuration: nothing as number,

    animate(options: ja.IAnimationOptions | ja.IAnimationOptions[]): ja.IAnimator {
        const self = this;
        if (isArray(options)) {
            each(options as ja.IAnimationOptions[], (e: ja.IAnimationOptions) => self._addEvent(e));
        } else {
            self._addEvent(options as ja.IAnimationOptions);
        }
        self._recalculate();
        return self;
    },
    duration(): number {
        return this._duration;
    },
    iterationStart(): number {
        return this._iterationStart;
    },
    iterations(): number {
        return this._iterations;
    },
    totalDuration(): number {
        return this._totalDuration;
    },
    endTime(): number {
        return this._endTime;
    },
    startTime(): number {
        return this._startTime;
    },
    currentTime(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._currentTime;
        }
        self._currentTime = value;
        return self;
    },
    playbackRate(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._playbackRate;
        }
        self._playbackRate = value;
        return self;
    },
    playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._playState;
        }
        self._playState = value;
        self._dispatcher.trigger('set', ['playbackState', value]);
        return self;
    },
    on(eventName: string, listener: Function): ja.IAnimator {
        const self = this;
        self._dispatcher.on(eventName, listener);
        return self;
    },
    off(eventName: string, listener: Function): ja.IAnimator {
        const self = this;
        self._dispatcher.off(eventName, listener);
        return self;
    },
    finish(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger(finish, [self]);
        return self;
    },
    play(): ja.IAnimator {
        const self = this;
        if (self._playState !== 'running' || self._playState !== 'pending') {
            self._playState = 'pending';
            self._timeLoop.on(self._onTick);
        }
        return self;
    },
    pause(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger(pause, [self]);
        return self;
    },
    reverse(): ja.IAnimator {
        const self = this;
        self._playbackRate *= -1;
        return self;
    },
    cancel(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger(cancel, [self]);
        return self;
    },
    _recalculate(): void {
        const self = this;
        const endsAt = maxBy(self._events, (e: ITimelineEvent) => e.endTimeMs);

        self._endTime = endsAt;
        self._duration = endsAt;
        self._totalDuration = endsAt;
    },
    _addEvent(event: ja.IAnimationOptions): void {
        const self = this;
        const targets = queryElements(event.targets);

        if (event.name) {
            const def = self._resolver.findAnimation(event.name);
            if (!isDefined(def)) {
                throw invalidArg('name');
            }
            inherit(event, def);
        }

        event.from = (event.from || 0) + this._duration;
        event.to = (event.to || 0) + this._duration;

        if (!event.easing) {
            event.easing = 'linear';
        } else {
            event.easing = easings[event.easing] || event.easing;
        }

        if (event.keyframes) {
            const animators = map(targets, (e: Element) => {
                const expanded = map(event.keyframes, expand as ja.IMapper<ja.ICssKeyframeOptions, ja.ICssKeyframeOptions>);
                const normalized = map(expanded, normalizeProperties);
                const keyframes = pipe(normalized, spaceKeyframes, normalizeKeyframes);
                return {
                    animator: KeyframeAnimation(e, keyframes, event),
                    endTimeMs: event.to,
                    startTimeMs: event.from
                };
            });
            pushAll(self._events, animators);
        }
    },
    _onCancel(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'idle';
        self._lastTick = nothing;
        each(self._events, (evt: ITimelineEvent) => { evt.animator.cancel(); });
    },
    _onFinish(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._currentTime = 0;
        self._playState = 'finished';
        self._lastTick = nothing;
        each(self._events, (evt: ITimelineEvent) => { evt.animator.finish(); });
    },
    _onPause(self: ja.IAnimator & IAnimationContext): void {
        self._timeLoop.off(self._onTick);
        self._playState = 'paused';
        self._lastTick = nothing;
        each(self._events, (evt: ITimelineEvent) => { evt.animator.pause(); });
    },
    _onTick(delta2: number, runningTime2: number): void {
        const self = this;
        const dispatcher = self._dispatcher;
        const playState = self._playState;

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
            self._currentTime = currentTime === nothing || currentTime === endTime ? startTime : currentTime;
            self._playState = 'running';
        }

        // calculate currentTime from delta
        const thisTick = performance.now();
        const lastTick = self._lastTick;
        if (lastTick !== nothing) {
            const delta = (thisTick - lastTick) * playbackRate;
            self._currentTime += delta;
        }
        self._lastTick = thisTick;

        const currentTime = self._currentTime;

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
            const shouldBeActive = startTimeMs <= currentTime && currentTime < endTimeMs;

            if (shouldBeActive) {
                const animator = evt.animator;
                animator.playbackRate(playbackRate);
                animator.play();
            }
        }
    }
} as IAnimationContext;


interface IAnimationContext {
    _currentTime: number;
    _dispatcher: IDispatcher;
    _duration: number;
    _endTime: number;
    _events: ITimelineEvent[];
    _onTick: {(delta: number, runningTime: number): void};
    _iterationStart: number;
    _iterations: number;
    _lastTick: number;
    _playState: ja.AnimationPlaybackState;
    _playbackRate: number;
    _resolver: ja.IAnimationResolver;
    _startTime: number;
    _timeLoop: ITimeLoop;
    _totalDuration: number;
}

interface ITimelineEvent {
    startTimeMs: number;
    endTimeMs: number;
    animator: ja.IAnimator;
}
