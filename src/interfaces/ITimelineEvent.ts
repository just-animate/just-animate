import {ElementSource} from './IElementProvider';
import {IAnimationTiming} from './IAnimationTiming';
import {IKeyframe} from './IKeyframe';
import {IAnimator} from './IAnimator';
import {IIndexed} from './IIndexed';

export interface ITimelineEvent {
    offset: number;
    el: ElementSource;
    name?: string;
    timings?: IAnimationTiming;
    keyframes?: IIndexed<IKeyframe>;
    _animator?: IAnimator;
    _startTimeMs?: number;
    _endTimeMs?: number;
    _isClipped?: boolean;
}