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
import {each, extend, isFunction, map} from './helpers';

export class TimelineAnimator implements IAnimator {
    public onfinish: IConsumer<IAnimator>;
    public oncancel: IConsumer<IAnimator>;

    // TODO: implement    
    public currentTime: number;
    public duration: number;
    public playbackRate: number;
    
    private _events: IInnerTimelineEvent[];
    private _isInEffect: boolean;
    private _isFinished: boolean;
    private _isCanceled: boolean;
    private _isPaused: boolean;
    private _lastTick: number;
    private _manager: IAnimationManager;

    constructor(manager: IAnimationManager, options: ITimelineOptions) {
        const sheetDuration = options.duration;
        if (sheetDuration === undefined) {
            throw Error('Duration is required');
        }

        const animationEvents = map(options.events, (evt: ITimelineEvent) => {
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
            const startTime = sheetDuration * evt.offset;
            let endTime = startTime + timings.duration;
            const isClipped = endTime > sheetDuration;

            // if end of animation is clipped, set endTime to duration            
            if (isClipped) {
                endTime = sheetDuration;
            }

            return {
                el: el,
                isClipped: isClipped,
                isInEffect: false,
                endTimeMs: endTime,
                keyframes: keyframes,
                offset: evt.offset,
                startTimeMs: startTime,
                timings: timings,
            };
        }) as IInnerTimelineEvent[];

        this.duration = options.duration;
        this.currentTime = 0;
        this._events = animationEvents;
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
        }
        if (this._isFinished) {
            this._triggerFinish();
        }
        if (this._isPaused) {
            this._isPaused = false;
            return;
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
            if (evt.isInEffect) {
                return;
            }

            const shouldBeActive = evt.startTimeMs <= this.currentTime && evt.endTimeMs <= this.currentTime;
            if (!shouldBeActive) {
                return;
            }

            // initialize animator if it doesn't exist            
            if (evt.animator === undefined) {
                evt.animator = this._manager.animate(evt.keyframes, evt.el, evt.timings);
            }
            if (this.playbackRate === -1) {
                evt.animator.reverse();
            } else {
                evt.animator.play();
            }            
        });
                    
        window.requestAnimationFrame(this._tick);
    }
    private _triggerFinish() {
        this._reset();
        each(this._events, evt => {
            if (evt.animator !== undefined) {
                evt.animator.finish();
            }
        });
        if (isFunction(this.onfinish)) {
            this.onfinish(this);
        }
    }
    private _triggerCancel() {
        this._reset();
        each(this._events, evt => {
            if (evt.animator !== undefined) {
                evt.animator.cancel();
            }
        });
        if (isFunction(this.oncancel)) {
            this.oncancel(this);
        }
    }
    private _reset() {
        this.currentTime = 0;
        this._isCanceled = false;
        this._isFinished = false;
        this._isPaused = false;
    }

    public finish(fn?: ICallbackHandler): IAnimator {
        if (this.playbackRate !== undefined) {
            this.playbackRate = undefined;
            this._isFinished = true;
        }
        return this;
    }
    public play(fn?: ICallbackHandler): IAnimator {
        if (this.playbackRate === undefined || this.playbackRate === 0) {
            this.playbackRate = 1;
            this._tick();
            return this;
        }
        if (this.playbackRate === -1) {
            this.playbackRate = 1;
            return this;
        } 
        return this;
    }
    public pause(fn?: ICallbackHandler): IAnimator {
        if (this.playbackRate !== undefined && this.playbackRate !== 0) {
            this.playbackRate = 0;
        }
        return this;
    }
    public reverse(fn?: ICallbackHandler): IAnimator {
        if (this.playbackRate === undefined || this.playbackRate === 0) {
            this.playbackRate = -1;
            this._tick();
            return this;
        }
        if (this.playbackRate === 1) {
            this.playbackRate = -1;
            return this;
        } 
        return this;
    }
    public cancel(fn?: ICallbackHandler): IAnimator {
        if (this.playbackRate !== undefined) {
            this.playbackRate = undefined;
            this._isCanceled = true;
        }
        return this;
    }
}

interface IInnerTimelineEvent {
    offset: number;
    el: ElementSource;
    name?: string;
    timings?: IAnimationEffectTiming;
    keyframes?: IIndexed<IKeyframe>;
    animator?: IAnimator;
    endTimeMs?: number;
    isClipped?: boolean;
    isInEffect: boolean;
    startTimeMs?: number;
}