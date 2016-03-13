import {IKeyframe} from './IKeyframe';
import {IIndexed} from './IIndexed';
import {IAnimationTiming} from './IAnimationTiming';

export interface IAnimationOptions {
    keyframes: IIndexed<IKeyframe>;
    timings?: IAnimationTiming;
}
