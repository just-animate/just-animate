import {ElementSource} from './IElementProvider';
import {IAnimationTiming} from './IAnimationTiming';
import {IIndexed} from './IIndexed';
import {IAnimator} from './IAnimator';
import {IKeyframe} from './IKeyframe';

export interface ISequenceEvent {
    el: ElementSource;
    name?: string;
    command?: string;
    timings?: IAnimationTiming;
    keyframes?: IIndexed<IKeyframe>;
    _animator?: IAnimator;
}