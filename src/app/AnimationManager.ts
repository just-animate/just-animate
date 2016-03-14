import {ElementSource} from '../interfaces/IElementProvider';
import {IAnimation} from '../interfaces/IAnimation';
import {IAnimationManager} from '../interfaces/IAnimationManager';
import {IAnimationOptions} from '../interfaces/IAnimationOptions';
import {IAnimationSheetOptions} from '../interfaces/IAnimationSheetOptions';
import {ISequenceEvent} from '../interfaces/ISequenceEvent';
import {IAnimationSheetEvent} from '../interfaces/IAnimationSheetEvent';
import {ISequenceOptions} from '../interfaces/ISequenceOptions';
import {IAnimationTiming} from '../interfaces/IAnimationTiming';
import {IElementProvider} from '../interfaces/IElementProvider';
import {IIndexed} from '../interfaces/IIndexed';
import {IKeyframe} from '../interfaces/IKeyframe';
import {IMap} from '../interfaces/IMap';

import {extend, isArray, isFunction, isString, each, multiapply, toArray, map} from './helpers';
import {ElementAnimator} from './ElementAnimator';
import {SequenceAnimator} from './SequenceAnimator';
import {TimelineAnimator} from './TimelineAnimator';

export class AnimationManager implements IAnimationManager {
    private _registry: { [key: string]: IAnimationOptions };
    private _timings: IAnimationTiming;
    private _easings: IMap<string>;

    constructor() {
        this._registry = {};
        this._easings = {};
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
    }

    public animate(keyframesOrName: string | IIndexed<IKeyframe>, el: ElementSource, timings?: IAnimationTiming): IAnimation {
        return new ElementAnimator(this, keyframesOrName, el, timings);
    }
    public animateSequence(options: ISequenceOptions): IAnimation {
        return new SequenceAnimator(this, options);
    }
    public animateSheet(options: IAnimationSheetOptions): IAnimation {
        return new TimelineAnimator(this, options);
    }
    public configure(timings?: IAnimationTiming, easings?: IMap<string>): IAnimationManager {
        if (timings) {
            extend(this._timings, timings);
        }
        if (easings) {
            extend(this._easings, easings);
        }
        return this;
    }
    public findAnimation(name: string): IAnimationOptions {
        return this._registry[name] || undefined;
    }
    public findEasing(name: string): string {
        return this._easings[name] || undefined;
    }
    public register(name: string, animationOptions: IAnimationOptions): IAnimationManager {
        this._registry[name] = animationOptions;

        const self = this;
        self[name] = (el: ElementSource, timings: IAnimationTiming) => {
            return self.animate(name, el, timings);
        };
        return self;
    }
}