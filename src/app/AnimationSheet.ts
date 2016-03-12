import {IAnimation, IAnimationSheetOptions, IConsumer, ICallbackHandler} from './types';

export class AnimationSheet implements IAnimation {
    _options: IAnimationSheetOptions;    
    constructor(options: IAnimationSheetOptions) {
        this._options = options;
    }
    public finish(fn?: ICallbackHandler): IAnimation {
        return this;
    }
    public play(fn?: ICallbackHandler): IAnimation {
        return this;
    }
    public pause(fn?: ICallbackHandler): IAnimation {
        return this;
    }
    public reverse(fn?: ICallbackHandler): IAnimation {
        return this;
    }
    public cancel(fn?: ICallbackHandler): IAnimation {
        return this;
    }
    onfinish: IConsumer<AnimationEvent>;
}