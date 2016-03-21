import {IKeyframe} from './IKeyframe';
import {IIndexed} from './IIndexed';
import {IAnimationEffectTiming} from './IAnimationEffectTiming';

export interface IKeyframeOptions {
    keyframes: IIndexed<IKeyframe>;
    timings?: IAnimationEffectTiming;
}
