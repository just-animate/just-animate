import {ElementSource} from './IElementProvider';
import {IAnimationTiming} from './IAnimationTiming';
import {IKeyframe} from './IKeyframe';
import {IAnimation} from './IAnimation';
import {IIndexed} from './IIndexed';

export interface IAnimationSheetEvent {
    offset: number;
    el: ElementSource;
    name?: string;
    timings?: IAnimationTiming;
    keyframes?: IIndexed<IKeyframe>;
    _animator?: IAnimation;
    _startTimeMs?: number;
    _endTimeMs?: number;
    _isClipped?: boolean;
}