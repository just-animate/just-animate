import {IIndexed} from './IIndexed';
import {IKeyframe} from './IKeyframe';
import {ElementSource} from './IElementProvider';
import {IAnimationTiming} from './IAnimationTiming';
import {IAnimation} from './IAnimation';
import {ISequenceOptions} from './ISequenceOptions';
import {IAnimationOptions} from './IAnimationOptions';

export interface IAnimationManager {
    animate(keyframesOrName: string | IIndexed<IKeyframe>, el: ElementSource, timings?: IAnimationTiming): IAnimation;
    animateSequence(options: ISequenceOptions): IAnimation;
    configure(timings?: IAnimationTiming): IAnimationManager;
    findAnimation(name: string): IAnimationOptions;
    findEasing(name: string): string;
    register(name: string, animationOptions: IAnimationOptions): IAnimationManager;
}