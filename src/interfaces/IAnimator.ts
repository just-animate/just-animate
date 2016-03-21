import {ICallbackHandler} from './ICallbackHandler';
import {IConsumer} from './IConsumer';

export interface IAnimator {
    //effect?: any;
    //timeline?: any;
    currentTime: number;
    duration: number;
    //startTime: number;
    playbackRate: number;

    onfinish?: IConsumer<IAnimator>;
    oncancel?: IConsumer<IAnimator>;

    finish(fn?: ICallbackHandler): IAnimator;
    play(fn?: ICallbackHandler): IAnimator;
    pause(fn?: ICallbackHandler): IAnimator;
    reverse(fn?: ICallbackHandler): IAnimator;
    cancel(fn?: ICallbackHandler): IAnimator;
}