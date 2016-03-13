import {ICallbackHandler} from './ICallbackHandler';
import {IConsumer} from './IConsumer';

export interface IAnimation {
    onfinish?: IConsumer<AnimationEvent>;
    finish(fn?: ICallbackHandler): IAnimation;
    play(fn?: ICallbackHandler): IAnimation;
    pause(fn?: ICallbackHandler): IAnimation;
    reverse(fn?: ICallbackHandler): IAnimation;
    cancel(fn?: ICallbackHandler): IAnimation;
}
