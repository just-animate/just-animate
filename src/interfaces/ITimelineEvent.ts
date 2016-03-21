import {ElementSource} from './IElementProvider';
import {IAnimationEffectTiming} from './IAnimationEffectTiming';
import {IKeyframe} from './IKeyframe';
import {IAnimator} from './IAnimator';
import {IIndexed} from './IIndexed';

export interface ITimelineEvent {
    offset: number;
    el: ElementSource;
    name?: string;
    timings?: IAnimationEffectTiming;
    keyframes?: IIndexed<IKeyframe>;
}