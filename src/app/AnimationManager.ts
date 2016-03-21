import {ElementSource} from '../interfaces/IElementProvider';
import {IAnimator} from '../interfaces/IAnimator';
import {IAnimationManager} from '../interfaces/IAnimationManager';
import {IKeyframeOptions} from '../interfaces/IKeyframeOptions';
import {ITimelineOptions} from '../interfaces/ITimelineOptions';
import {ISequenceEvent} from '../interfaces/ISequenceEvent';
import {ITimelineEvent} from '../interfaces/ITimelineEvent';
import {ISequenceOptions} from '../interfaces/ISequenceOptions';
import {IAnimationEffectTiming} from '../interfaces/IAnimationEffectTiming';
import {IElementProvider} from '../interfaces/IElementProvider';
import {IIndexed} from '../interfaces/IIndexed';
import {IKeyframe} from '../interfaces/IKeyframe';
import {IMap} from '../interfaces/IMap';

import {extend, isArray, isFunction, isString, each, multiapply, toArray, map} from './helpers';
import {ElementAnimator} from './ElementAnimator';
import {SequenceAnimator} from './SequenceAnimator';
import {TimelineAnimator} from './TimelineAnimator';

export class AnimationManager implements IAnimationManager {
    private _registry: { [key: string]: IKeyframeOptions };
    private _timings: IAnimationEffectTiming;
    private _easings: IMap<string>;

    constructor() {
        this._registry = {};
        this._easings = {};
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
    }

    public animate(keyframesOrName: string | IIndexed<IKeyframe>, el: ElementSource, timings?: IAnimationEffectTiming): IAnimator {
        return new ElementAnimator(this, keyframesOrName, el, timings);
    }
    public animateSequence(options: ISequenceOptions): IAnimator {
        return new SequenceAnimator(this, options);
    }
    public animateTimeline(options: ITimelineOptions): IAnimator {
        return new TimelineAnimator(this, options);
    }
    public configure(timings?: IAnimationEffectTiming, easings?: IMap<string>): IAnimationManager {
        if (timings) {
            extend(this._timings, timings);
        }
        if (easings) {
            extend(this._easings, easings);
        }
        return this;
    }
    public findAnimation(name: string): IKeyframeOptions {
        return this._registry[name] || undefined;
    }
    public findEasing(name: string): string {
        return this._easings[name] || undefined;
    }
    public register(name: string, animationOptions: IKeyframeOptions): IAnimationManager {
        this._registry[name] = animationOptions;

        const self = this;
        self[name] = (el: ElementSource, timings: IAnimationEffectTiming) => {
            return self.animate(name, el, timings);
        };
        return self;
    }
}