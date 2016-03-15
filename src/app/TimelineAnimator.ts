import {IAnimator} from '../interfaces/IAnimator';
import {IAnimationManager} from '../interfaces/IAnimationManager';
import {ITimelineEvent} from '../interfaces/ITimelineEvent';
import {ITimelineOptions} from '../interfaces/ITimelineOptions';
import {IAnimationTiming} from '../interfaces/IAnimationTiming';
import {IConsumer} from '../interfaces/IConsumer';
import {ICallbackHandler} from '../interfaces/ICallbackHandler';
import {ElementSource} from '../interfaces/IElementProvider';
import {IIndexed} from '../interfaces/IIndexed';
import {IKeyframe} from '../interfaces/IKeyframe';
import {extend, map} from './helpers';

export class TimelineAnimator implements IAnimator {
    _duration: number;
    _events: ITimelineEvent[];

    constructor(manager: IAnimationManager, options: ITimelineOptions) {
        const sheetDuration = options.duration;
        if (sheetDuration === undefined) {
            throw Error('Duration is required');
        }

        const animationEvents = map(options.events, (evt: ITimelineEvent) => {
            let keyframes: IIndexed<IKeyframe>;
            let timings: IAnimationTiming;
            let el: ElementSource;
            
            if (evt.name) {
                const definition = manager.findAnimation(evt.name);
                let timings2 = extend({}, definition.timings);
                if (evt.timings) {
                    timings = extend(timings, evt.timings);
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
                keyframes: keyframes,
                timings: timings,
                el: el,
                offset: evt.offset,
                _isClipped: isClipped,
                _startTimeMs: startTime,
                _endTimeMs: endTime
            };
        }) as ITimelineEvent[];

        this._duration = options.duration;
        this._events = animationEvents;

        if (options.autoplay) {
            this.play();
        }        
    }
    public finish(fn?: ICallbackHandler): IAnimator {
        return this;
    }
    public play(fn?: ICallbackHandler): IAnimator {
        return this;
    }
    public pause(fn?: ICallbackHandler): IAnimator {
        return this;
    }
    public reverse(fn?: ICallbackHandler): IAnimator {
        return this;
    }
    public cancel(fn?: ICallbackHandler): IAnimator {
        return this;
    }
    onfinish: IConsumer<AnimationEvent>;
}