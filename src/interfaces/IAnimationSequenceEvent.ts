import {ElementSource} from './IElementProvider';
import {IAnimationTiming} from './IAnimationTiming';
import {IIndexed} from './IIndexed';
import {IAnimation} from './IAnimation';
import {IKeyframe} from './IKeyframe';

export interface IAnimationSequenceEvent {
    el: ElementSource;
    name?: string;
    command?: string;
    timings?: IAnimationTiming;
    keyframes?: IIndexed<IKeyframe>;
    _animator?: IAnimation;
}