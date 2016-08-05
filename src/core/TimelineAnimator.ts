import {each, map} from '../helpers/lists';
import {isDefined} from '../helpers/type';
import {queryElements} from '../helpers/elements';
import {createDispatcher, IDispatcher} from './Dispatcher';
import {createKeyframeAnimation} from './KeyframeAnimation';
import {createMultiAnimator}from './Animator';
import {ITimeLoop} from './TimeLoop';
import {invalidArg} from '../helpers/errors';
import {duration, finish, cancel} from '../helpers/resources';


// fixme!: this controls the amount of time left before the timeline gives up 
// on individual animation and calls finish.  If an animation plays after its time, it looks
// like it restarts and that causes jank
const animationPadding = 1.0 / 30;

const timelineAnimatorPrototype = {
    _: undefined as ITimelineContext,

    duration(): number {
        return this._.duration;
    },
    iterationStart(): number {
        return this._.iterationStart;
    },
    iterations(): number {
        return this._.iterations;
    },
    totalDuration(): number {
        return this._.totalDuration;
    },
    endTime(): number {
        return this._.endTime;
    },
    startTime(): number {
        return this._.startTime;
    },
    currentTime(value?: number): number | ja.IAnimator {
        if (!isDefined(value)) {
            return this._.currentTime;
        }
        this._.currentTime = value;
        return this;
    },
    playbackRate(value?: number): number | ja.IAnimator {
        if (!isDefined(value)) {
            return this._.playbackRate;
        }
        this._.playbackRate = value;
        return this;
    },
    playState(value?: ja.AnimationPlaybackState): ja.AnimationPlaybackState | ja.IAnimator {
        if (!isDefined(value)) {
            return this._.playState;
        }
        this._.playState = value;
        this._.dispatcher.trigger('set', ['playbackState', value]);
        return this;
    },
    on(eventName: string, listener: Function): ja.IAnimator {
        this._.dispatcher.on(eventName, listener);
        return this;
    },
    off(eventName: string, listener: Function): ja.IAnimator {
        this._.dispatcher.off(eventName, listener);
        return this;
    },
    finish(): ja.IAnimator {
        this._.isFinished = true;
        return this;
    },
    play(): ja.IAnimator {
        this._.playbackRate = 1;
        this._.isPaused = false;

        if (!this._.isInEffect) {
            if (this._.playbackRate < 0) {
                this._.currentTime = this._.duration;
            } else {
                this._.currentTime = 0;
            }
            window.requestAnimationFrame(tick.bind(undefined, this._));
        }

        return this;
    },
    pause(): ja.IAnimator {
        if (this._.isInEffect) {
            this._.isPaused = true;
        }
        return this;
    },
    reverse(): ja.IAnimator {
        this._.playbackRate = -1;
        this._.isPaused = false;

        if (!this._.isInEffect) {
            if (this._.currentTime <= 0) {
                this._.currentTime = this._.duration;
            }
            window.requestAnimationFrame(tick.bind(undefined, this._));
        }
        return this;
    },
    cancel(): ja.IAnimator {
        this._.playbackRate = 0;
        this._.isCanceled = true;
        return this;
    }
};

interface ITimelineContext {
    currentTime: number;
    dispatcher: IDispatcher;
    duration: number;    
    endTime: number;
    events: ITimelineEvent[];
    isCanceled: boolean;
    isFinished: boolean;
    isInEffect: boolean;
    isPaused: boolean;
    iterationStart: number;    
    iterations: number;
    lastTick: number;
    playState: ja.AnimationPlaybackState;    
    playbackRate: number;    
    startTime: number;
    timeLoop: ITimeLoop;
    totalDuration: number;
}

export function createTimelineAnimator(options: ja.ITimelineOptions, timeloop: ITimeLoop): ja.IAnimator {
    const self = Object.create(timelineAnimatorPrototype) as ja.IAnimator & { _: ITimelineContext};

    const duration1 = options.duration;
    if (!isDefined(duration)) {
        throw invalidArg(duration);
    }

    self._ = {
        currentTime: 0,
        dispatcher: createDispatcher(),
        duration: options.duration,
        endTime: undefined,
        events: map(options.events, (evt: ja.ITimelineEvent) => createEvent(timeloop, duration1, evt)),
        isCanceled: undefined,
        isFinished: undefined,        
        isInEffect: undefined,   
        isPaused: undefined,        
        iterationStart: 0,
        iterations: 1,
        lastTick: undefined,
        playState: undefined,        
        playbackRate: 0,
        startTime: 0,
        timeLoop: timeloop,
        totalDuration: options.duration
    }; 

    if (options.autoplay) {
        self.play();
    }

    return self;
}


function tick(self: ITimelineContext): void {
    // handle cancelation and finishing early
    if (self.isCanceled) {
        triggerCancel(self);
        return;
    }
    if (self.isFinished) {
        triggerFinish(self);
        return;
    }
    if (self.isPaused) {
        triggerPause(self);
        return;
    }
    if (!self.isInEffect) {
        self.isInEffect = true;
    }

    // calculate currentTime from delta
    const thisTick = performance.now();
    const lastTick = self.lastTick;
    if (lastTick !== undefined) {
        const delta = (thisTick - lastTick) * self.playbackRate;
        self.currentTime += delta;
    }
    self.lastTick = thisTick;

    // check if animation has finished
    if (self.currentTime > self.duration || self.currentTime < 0) {
        triggerFinish(self);
        return;
    }

    // start animations if should be active and currently aren't   
    const playbackRate = self.playbackRate;    
    each(self.events, (evt: ITimelineEvent) => {
        const startTimeMs = playbackRate < 0 ? evt.startTimeMs : evt.startTimeMs + animationPadding;
        const endTimeMs = self.playbackRate >= 0 ? evt.endTimeMs : evt.endTimeMs - animationPadding;
        const shouldBeActive = startTimeMs <= self.currentTime && self.currentTime < endTimeMs;

        if (!shouldBeActive) {
            return;
        }

        const animator = evt.animator();

        animator.playbackRate(self.playbackRate);
        animator.play();
    });

    window.requestAnimationFrame(tick.bind(undefined, self));
}
function triggerFinish(self: ITimelineContext): void {
    reset(self);
    each(self.events, (evt: ITimelineEvent) => evt.animator().finish());
    self.dispatcher.trigger(finish);
}
function triggerCancel(self: ITimelineContext): void {
    reset(self);
    each(self.events, (evt: ITimelineEvent) => evt.animator().cancel());
    self.dispatcher.trigger(cancel);
}
function triggerPause(self: ITimelineContext): void {
    self.isPaused = true;
    self.isInEffect = false;
    self.lastTick = undefined;
    self.playbackRate = 0;
    each(self.events, (evt: ITimelineEvent) => {
        evt.animator().pause();
    });
}
function reset(self: ITimelineContext): void {
    self.currentTime = 0;
    self.lastTick = undefined;
    self.isCanceled = false;
    self.isFinished = false;
    self.isPaused = false;
    self.isInEffect = false;
}

function createEvent(timeloop: ITimeLoop, timelineDuration: number, evt: ja.ITimelineEvent) {
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

    return {
        _animator: undefined as ja.IAnimator,
        _timeLoop: timeloop,
        animator: animator,
        el: el,
        endTimeMs: endTime,        
        isClipped: isClipped,
        keyframes: keyframes,
        offset: evt.offset,
        startTimeMs: startTime,
        timings: timings
    };
}

function animator(): ja.IAnimator {
    if (!this._animator) {
        const elements = queryElements(this.el);
        const effects = map(elements, (e: any) => createKeyframeAnimation(e, this.keyframes, this.timings));
        this._animator = createMultiAnimator(effects, this._timeLoop);
        this._animator.pause();
    }
    return this._animator;
}

interface ITimelineEvent {
    startTimeMs: number;
    endTimeMs: number;
    animator(): ja.IAnimator;
}
