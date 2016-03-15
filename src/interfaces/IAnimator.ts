import {ICallbackHandler} from './ICallbackHandler';
import {IConsumer} from './IConsumer';

export interface IAnimator {
    onfinish?: IConsumer<AnimationEvent>;
    finish(fn?: ICallbackHandler): IAnimator;
    play(fn?: ICallbackHandler): IAnimator;
    pause(fn?: ICallbackHandler): IAnimator;
    reverse(fn?: ICallbackHandler): IAnimator;
    cancel(fn?: ICallbackHandler): IAnimator;
}
