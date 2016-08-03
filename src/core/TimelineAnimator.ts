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

export class TimelineAnimator implements ja.IAnimator {
    private _timeLoop: ITimeLoop;
    private _duration: number;
    private _playbackRate: number;
    private _currentTime: number;
    private _events: TimelineEvent[];
    private _isInEffect: boolean;
    private _isFinished: boolean;
    private _isCanceled: boolean;
    private _isPaused: boolean;
    private _lastTick: number;
    private _playState: ja.AnimationPlaybackState;
    private _iterationStart: number;    
    private _iterations: number;    
    private _totalDuration: number;    
    private _endTime: number;    
    private _startTime: number;
    private _dispatcher: IDispatcher;

    public duration(): number {
        return this._duration;
    }    
    public iterationStart(): number {
        return this._iterationStart;
    }
    public iterations(): number {
        return this._iterations;
    }
    public totalDuration(): number {
        return this._totalDuration;
    }
    public endTime(): number {
        return this._endTime;
    }
    public startTime(): number {
        return this._startTime;
    }
    
    public currentTime(): number;    
    public currentTime(value: number): ja.IAnimator;    
    public currentTime(value?: number): number | ja.IAnimator {
        if (!isDefined(value)) {
            return this._currentTime;
        }
        this._currentTime = value;
        return this;
    }

    public playbackRate(): number;    
    public playbackRate(value: number): ja.IAnimator;       
    public playbackRate(value?: number): number|ja.IAnimator {
        if (!isDefined(value)) {
            return this._playbackRate;
        }  
        this._playbackRate = value;
        return this;
    }

    public playState(): ja.AnimationPlaybackState;
    public playState(value: ja.AnimationPlaybackState): ja.IAnimator;
    public playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | ja.IAnimator {
        if (!isDefined(value)) {
            return this._playState;
        }
        this._playState = value;
        this._dispatcher.trigger('set', ['playbackState', value]);
        return this;
    }

    /**
     * Creates an instance of TimelineAnimator.
     * 
     * @param {ja.IAnimationManager} manager (description)
     * @param {ja.ITimelineOptions} options (description)
     */
    constructor(options: ja.ITimelineOptions, timeloop: ITimeLoop) {
        const duration = options.duration;
        if (duration === undefined) {
            throw 'Duration is required';
        }

        this._timeLoop = timeloop;        
        this._dispatcher = createDispatcher();        
        this._playbackRate = 0;
        this._duration = options.duration;
        this._currentTime = 0;
        this._events = map(options.events, (evt: ja.ITimelineEvent) => new TimelineEvent(timeloop, duration, evt));
        this._isPaused = false;

        // ensure context of tick is this instance        
        this._tick = this._tick.bind(this);

        if (options.autoplay) {
            this.play();
        }
    }

    public on(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.on(eventName, listener);
        return this;
    }

    public off(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.off(eventName, listener);
        return this;
    }

    public finish(): ja.IAnimator {
        this._isFinished = true;
        return this;
    }
    public play(): ja.IAnimator {
        this._playbackRate = 1;
        this._isPaused = false;

        if (!this._isInEffect) {
            if (this._playbackRate < 0) {
                this._currentTime = this._duration;
            } else {
                this._currentTime = 0;
            }
            window.requestAnimationFrame(this._tick);
        }
        
        return this;
    }
    public pause(): ja.IAnimator {
        if (this._isInEffect) {
            this._isPaused = true;
        }
        return this;
    }
    public reverse(): ja.IAnimator {
        this._playbackRate = -1;
        this._isPaused = false;

        if (!this._isInEffect) {
            if (this._currentTime <= 0) {
                this._currentTime = this._duration;
            }
            window.requestAnimationFrame(this._tick);
        }
        return this;
    }
    public cancel(): ja.IAnimator {
        this._playbackRate = 0;
        this._isCanceled = true;
        return this;
    }

    private _tick(): void {
        // handle cancelation and finishing early
        if (this._isCanceled) {
            this._triggerCancel();
            return;
        }
        if (this._isFinished) {
            this._triggerFinish();
            return;
        }
        if (this._isPaused) {
            this._triggerPause();
            return;
        }
        if (!this._isInEffect) {
            this._isInEffect = true;
        }

        // calculate currentTime from delta
        const thisTick = performance.now();
        const lastTick = this._lastTick;
        if (lastTick !== undefined) {
            const delta = (thisTick - lastTick) * this._playbackRate;
            this._currentTime += delta;
        }
        this._lastTick = thisTick;

        // check if animation has finished
        if (this._currentTime > this._duration || this._currentTime < 0) {
            this._triggerFinish();
            return;
        }

        // start animations if should be active and currently aren't       
        each(this._events, (evt: TimelineEvent) => {
            const startTimeMs = this._playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            const endTimeMs = this._playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            const shouldBeActive = startTimeMs <= this._currentTime && this._currentTime < endTimeMs;

            if (!shouldBeActive) {
                evt.isInEffect = false;
                return;
            }

            const animator = evt.animator();

            animator.playbackRate(this._playbackRate);
            evt.isInEffect = true;
            animator.play();
        });

        window.requestAnimationFrame(this._tick);
    }
    private _triggerFinish(): void {
        this._reset();
        each(this._events, (evt: TimelineEvent) => evt.animator().finish());
        this._dispatcher.trigger('finish');        
    }
    private _triggerCancel(): void {
        this._reset();
        each(this._events, (evt: TimelineEvent) => evt.animator().cancel());
        this._dispatcher.trigger('cancel');
    }
    private _triggerPause(): void {
        this._isPaused = true;
        this._isInEffect = false;
        this._lastTick = undefined;
        this._playbackRate = 0;
        each(this._events, (evt: TimelineEvent) => {
            evt.isInEffect = false;
            evt.animator().pause();
        });
    }
    private _reset(): void {
        this._currentTime = 0;
        this._lastTick = undefined;
        this._isCanceled = false;
        this._isFinished = false;
        this._isPaused = false;
        this._isInEffect = false;
        each(this._events, (evt: TimelineEvent) => {
            evt.isInEffect = false;
        });
    }
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
            const effects =  map(elements, (e: any) => createKeyframeAnimation(e, this.keyframes, this.timings));
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
