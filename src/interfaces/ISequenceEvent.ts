import {ElementSource} from './IElementProvider';
import {IAnimationEffectTiming} from './IAnimationEffectTiming';
import {IIndexed} from './IIndexed';
import {IAnimator} from './IAnimator';
import {IKeyframe} from './IKeyframe';

export interface ISequenceEvent {
    el: ElementSource;
    name?: string;
    command?: string;
    timings?: IAnimationEffectTiming;
    keyframes?: IIndexed<IKeyframe>;
}