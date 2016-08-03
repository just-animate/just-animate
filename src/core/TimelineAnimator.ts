import {each, map} from '../helpers/lists';
import {isDefined} from '../helpers/type';
import {queryElements} from '../helpers/elements';
import {createDispatcher, IDispatcher} from './Dispatcher';
import {createKeyframeAnimation} from './KeyframeAnimation';
import {createMultiAnimator}from './Animator';
import {ITimeLoop} from './TimeLoop';


// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = 1.0 / 30;

const timelineAnimatorPrototype = {
    __: undefined as ITimelineContext,

    duration(): number {
        return this.__._duration;
    },
    iterationStart(): number {
        return this.__._iterationStart;
    },
    iterations(): number {
        return this.__._iterations;
    },
    totalDuration(): number {
        return this.__._totalDuration;
    },
    endTime(): number {
        return this.__._endTime;
    },
    startTime(): number {
        return this.__._startTime;
    },
    currentTime(value?: number): number | ja.IAnimator {
        if (!isDefined(value)) {
            return this.__._currentTime;
        }
        this.__._currentTime = value;
        return this;
    },
    playbackRate(value?: number): number | ja.IAnimator {
        if (!isDefined(value)) {
            return this.__._playbackRate;
        }
        this.__._playbackRate = value;
        return this;
    },
    playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | ja.IAnimator {
        if (!isDefined(value)) {
            return this.__._playState;
        }
        this.__._playState = value;
        this.__._dispatcher.trigger('set', ['playbackState', value]);
        return this;
    },
    on(eventName: string, listener: Function): ja.IAnimator {
        this.__._dispatcher.on(eventName, listener);
        return this;
    },
    off(eventName: string, listener: Function): ja.IAnimator {
        this.__._dispatcher.off(eventName, listener);
        return this;
    },
    finish(): ja.IAnimator {
        this.__._isFinished = true;
        return this;
    },
    play(): ja.IAnimator {
        this.__._playbackRate = 1;
        this.__._isPaused = false;

        if (!this.__._isInEffect) {
            if (this.__._playbackRate < 0) {
                this.__._currentTime = this.__._duration;
            } else {
                this.__._currentTime = 0;
            }
            window.requestAnimationFrame(_tick.bind(undefined, this.__));
        }

        return this;
    },
    pause(): ja.IAnimator {
        if (this.__._isInEffect) {
            this.__._isPaused = true;
        }
        return this;
    },
    reverse(): ja.IAnimator {
        this.__._playbackRate = -1;
        this.__._isPaused = false;

        if (!this.__._isInEffect) {
            if (this.__._currentTime <= 0) {
                this.__._currentTime = this.__._duration;
            }
            window.requestAnimationFrame(_tick.bind(undefined, this.__));
        }
        return this;
    },
    cancel(): ja.IAnimator {
        this.__._playbackRate = 0;
        this.__._isCanceled = true;
        return this;
    }
};

interface ITimelineContext {
    _currentTime: number;
    _dispatcher: IDispatcher;
    _duration: number;    
    _endTime: number;
    _events: TimelineEvent[];
    _isCanceled: boolean;
    _isFinished: boolean;
    _isInEffect: boolean;
    _isPaused: boolean;
    _iterationStart: number;    
    _iterations: number;
    _lastTick: number;
    _playState: ja.AnimationPlaybackState;    
    _playbackRate: number;    
    _startTime: number;
    _timeLoop: ITimeLoop;
    _totalDuration: number;
}

export function createTimelineAnimator(options: ja.ITimelineOptions, timeloop: ITimeLoop): ja.IAnimator {
    const self = Object.create(timelineAnimatorPrototype) as ja.IAnimator & { __: ITimelineContext};

    const duration = options.duration;
    if (!isDefined(duration)) {
        throw 'Duration is required';
    }

    self.__ = {
        _currentTime: 0,
        _dispatcher: createDispatcher(),
        _duration: options.duration,
        _endTime: undefined,
        _events: map(options.events, (evt: ja.ITimelineEvent) => new TimelineEvent(timeloop, duration, evt)),
        _isCanceled: undefined,
        _isFinished: undefined,        
        _isInEffect: undefined,   
        _isPaused: undefined,        
        _iterationStart: 0,
        _iterations: 1,
        _lastTick: undefined,
        _playState: undefined,        
        _playbackRate: 0,
        _startTime: 0,
        _timeLoop: timeloop,
        _totalDuration: options.duration
    }; 

    if (options.autoplay) {
        self.play();
    }

    return self;
}


function _tick(self: ITimelineContext): void {
    // handle cancelation and finishing early
    if (self._isCanceled) {
        _triggerCancel(self);
        return;
    }
    if (self._isFinished) {
        _triggerFinish(self);
        return;
    }
    if (self._isPaused) {
        _triggerPause(self);
        return;
    }
    if (!self._isInEffect) {
        self._isInEffect = true;
    }

    // calculate currentTime from delta
    const thisTick = performance.now();
    const lastTick = self._lastTick;
    if (lastTick !== undefined) {
        const delta = (thisTick - lastTick) * self._playbackRate;
        self._currentTime += delta;
    }
    self._lastTick = thisTick;

    // check if animation has finished
    if (self._currentTime > self._duration || self._currentTime < 0) {
        _triggerFinish(self);
        return;
    }

    // start animations if should be active and currently aren't       
    each(self._events, (evt: TimelineEvent) => {
        const startTimeMs = self._playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
        const endTimeMs = self._playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
        const shouldBeActive = startTimeMs <= self._currentTime && self._currentTime < endTimeMs;

        if (!shouldBeActive) {
            evt.isInEffect = false;
            return;
        }

        const animator = evt.animator();

        animator.playbackRate(self._playbackRate);
        evt.isInEffect = true;
        animator.play();
    });

    window.requestAnimationFrame(_tick.bind(undefined, self));
}
function _triggerFinish(self: ITimelineContext): void {
    _reset(self);
    each(self._events, (evt: TimelineEvent) => evt.animator().finish());
    self._dispatcher.trigger('finish');
}
function _triggerCancel(self: ITimelineContext): void {
    _reset(self);
    each(self._events, (evt: TimelineEvent) => evt.animator().cancel());
    self._dispatcher.trigger('cancel');
}
function _triggerPause(self: ITimelineContext): void {
    self._isPaused = true;
    self._isInEffect = false;
    self._lastTick = undefined;
    self._playbackRate = 0;
    each(self._events, (evt: TimelineEvent) => {
        evt.isInEffect = false;
        evt.animator().pause();
    });
}
function _reset(self: ITimelineContext): void {
    self._currentTime = 0;
    self._lastTick = undefined;
    self._isCanceled = false;
    self._isFinished = false;
    self._isPaused = false;
    self._isInEffect = false;

    each(self._events, (evt: TimelineEvent) => {
        evt.isInEffect = false;
    });
}


class TimelineEvent {
    public offset: number;
    public el: ja.ElementSource;
    public timings: ja.IAnimationEffectTiming;
    public keyframes: ja.IKeyframeOptions[];
    public endTimeMs: number;
    public isClipped: boolean;
    public startTimeMs: number;
    public isInEffect: boolean;
    private _animator: ja.IAnimator;
    private _timeLoop: ITimeLoop;

    public animator(): ja.IAnimator {
        if (!this._animator) {
            const elements = queryElements(this.el);
            const effects = map(elements, (e: any) => createKeyframeAnimation(e, this.keyframes, this.timings));
            this._animator = createMultiAnimator(effects, this._timeLoop);
            this._animator.pause();
        }
        return this._animator;
    }

    constructor(timeloop: ITimeLoop, timelineDuration: number, evt: ja.ITimelineEvent) {
        const keyframes = evt.keyframes;
        const timings = evt.timings;
        const el = evt.el;

        // calculate endtime
        const startTime = timelineDuration * evt.offset;
        let endTime = startTime + timings.duration;
        const isClipped = endTime > timelineDuration;

        // if end of animation is clipped, set endTime to duration            
        if (isClipped) {
            endTime = timelineDuration;
        }

        this.el = el;
        this.isClipped = isClipped;
        this.isInEffect = false;
        this.endTimeMs = endTime;
        this.keyframes = keyframes;
        this.offset = evt.offset;
        this.startTimeMs = startTime;
        this.timings = timings;
        this._timeLoop = timeloop;
    }
}
