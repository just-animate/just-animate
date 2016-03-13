import {IIndexed} from './IIndexed';
import {IKeyframe} from './IKeyframe';
import {ElementSource} from './IElementProvider';
import {IAnimationTiming} from './IAnimationTiming';
import {IAnimation} from './IAnimation';
import {IAnimationSequenceOptions} from './IAnimationSequenceOptions';
import {IAnimationOptions} from './IAnimationOptions';

export interface IAnimationManager {
    animate(keyframesOrName: string | IIndexed<IKeyframe>, el: ElementSource, timings?: IAnimationTiming): IAnimation;
    animateSequence(options: IAnimationSequenceOptions): IAnimation;
    configure(timings?: IAnimationTiming): IAnimationManager;
    register(name: string, animationOptions: IAnimationOptions): IAnimationManager;
}