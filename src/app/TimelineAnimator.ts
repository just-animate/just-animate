import {IAnimator} from '../interfaces/IAnimator';
import {IAnimationManager} from '../interfaces/IAnimationManager';
import {ITimelineEvent} from '../interfaces/ITimelineEvent';
import {ITimelineOptions} from '../interfaces/ITimelineOptions';
import {IAnimationEffectTiming} from '../interfaces/IAnimationEffectTiming';
import {IConsumer} from '../interfaces/IConsumer';
import {ICallbackHandler} from '../interfaces/ICallbackHandler';
import {ElementSource} from '../interfaces/IElementProvider';
import {IIndexed} from '../interfaces/IIndexed';
import {IKeyframe} from '../interfaces/IKeyframe';
import {clamp, each, extend, isFunction, map} from './helpers';

// FIXME!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = 1.0 / 30;

export class TimelineAnimator implements IAnimator {
    public onfinish: IConsumer<IAnimator>;
    public oncancel: IConsumer<IAnimator>;

    // TODO: implement    
    public currentTime: number;
    public duration: number;
    public playbackRate: number;

    private _events: TimelineEvent[];
    private _isInEffect: boolean;
    private _isFinished: boolean;
    private _isCanceled: boolean;
    private _isPaused: boolean;
    private _lastTick: number;
    private _tickOffset: number;
    private _manager: IAnimationManager;

    constructor(manager: IAnimationManager, options: ITimelineOptions) {
        const duration = options.duration;
        if (duration === undefined) {
            throw Error('Duration is required');
        }
        this.playbackRate = 0;
        this.duration = options.duration;
        this.currentTime = 0;
        this._events = map(options.events, evt => new TimelineEvent(manager, duration, evt));
        this._isPaused = false;
        this._manager = manager;

        // ensure context of tick is this instance        
        this._tick = this._tick.bind(this);

        if (options.autoplay) {
            this.play();
        }
    }
    private _tick() {
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
            const delta = (thisTick - lastTick) * this.playbackRate;
            this.currentTime += delta;
        }
        this._lastTick = thisTick;

        // check if animation has finished
        if (this.currentTime > this.duration || this.currentTime < 0) {
            this._triggerFinish();
            return;
        }

        // start animations if should be active and currently aren't        
        each(this._events, evt => {
            const startTimeMs = this.playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
            const endTimeMs = this.playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
            const shouldBeActive = startTimeMs <= this.currentTime && this.currentTime < endTimeMs;

            if (!shouldBeActive) {
                evt.isInEffect = false;
                return;
            }

            evt.animator.playbackRate = this.playbackRate;
            evt.isInEffect = true;
            evt.animator.play();
        });

        window.requestAnimationFrame(this._tick);
    }
    private _triggerFinish() {
        this._reset();
        each(this._events, evt => evt.animator.finish());
        if (isFunction(this.onfinish)) {
            this.onfinish(this);
        }
    }
    private _triggerCancel() {
        this._reset();
        each(this._events, evt => evt.animator.cancel());
        if (isFunction(this.oncancel)) {
            this.oncancel(this);
        }
    }
    private _triggerPause() {
        this._isPaused = true;
        this._isInEffect = false;
        this._lastTick = undefined;
        this.playbackRate = 0;
        each(this._events, evt => {
            evt.isInEffect = false;
            evt.animator.pause();
        });
    }
    private _reset() {
        this.currentTime = 0;
        this._lastTick = undefined;
        this._isCanceled = false;
        this._isFinished = false;
        this._isPaused = false;
        this._isInEffect = false;
        each(this._events, evt => {
            evt.isInEffect = false;
        });
    }

    public finish(fn?: ICallbackHandler): IAnimator {
        this._isFinished = true;
        return this;
    }
    public play(fn?: ICallbackHandler): IAnimator {
        this.playbackRate = 1;
        this._isPaused = false;

        if (this._isInEffect) {
            return this;
        }
        if (this.playbackRate < 0) {
            this.currentTime = this.duration;
        } else {
            this.currentTime = 0;
        }
        window.requestAnimationFrame(this._tick);
        return this;
    }
    public pause(fn?: ICallbackHandler): IAnimator {
        if (this._isInEffect) {
            this._isPaused = true;
        }
        return this;
    }
    public reverse(fn?: ICallbackHandler): IAnimator {
        this.playbackRate = -1;
        this._isPaused = false;

        if (this._isInEffect) {
            return this;
        }

        if (this.currentTime <= 0) {
            this.currentTime = this.duration;
        }
        window.requestAnimationFrame(this._tick);
        return this;
    }
    public cancel(fn?: ICallbackHandler): IAnimator {
        this.playbackRate = 0;
        this._isCanceled = true;
        return this;
    }
}

class TimelineEvent {
    private _animator: IAnimator;
    private _manager: IAnimationManager;
    offset: number;
    el: ElementSource;
    timings: IAnimationEffectTiming;
    keyframes: IIndexed<IKeyframe>;
    endTimeMs: number;
    isClipped: boolean;
    startTimeMs: number;
    isInEffect: boolean;

    get animator(): IAnimator {
        if (this._animator === undefined) {
            this._animator = this._manager.animate(this.keyframes, this.el, this.timings);
            this._animator.pause();
        }
        return this._animator;
    }    

    constructor(manager: IAnimationManager, timelineDuration: number, evt: ITimelineEvent) {
        let keyframes: IIndexed<IKeyframe>;
        let timings: IAnimationEffectTiming;
        let el: ElementSource;

        if (evt.name) {
            const definition = manager.findAnimation(evt.name);
            let timings2 = extend({}, definition.timings);
            if (evt.timings) {
                timings = extend(timings2, evt.timings);
            }
            keyframes = definition.keyframes;
            timings = timings2;
            el = evt.el;
        } else {
            keyframes = evt.keyframes;
            timings = evt.timings;
            el = evt.el;
        }

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
        this._manager = manager;
    }    
}