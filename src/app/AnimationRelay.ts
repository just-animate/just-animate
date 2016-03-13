import {IAnimation} from '../interfaces/IAnimation';
import {ICallbackHandler} from '../interfaces/ICallbackHandler';
import {IConsumer} from '../interfaces/IConsumer';

import {multiapply, each, isArray, noop} from './helpers';

export class AnimationRelay implements IAnimation {
    private _animations: IAnimation[];
    constructor(animations: IAnimation[]) {
        if (!isArray(animations)) {
            throw Error('AnimationRelay requires an array of animations');
        }
        this._animations = animations;
    } 
    public finish(fn?: ICallbackHandler): IAnimation {
        multiapply(this._animations, 'finish', [], fn);
        return this;
    }
    public play(fn?: ICallbackHandler): IAnimation {
        multiapply(this._animations, 'play', [], fn);
        return this;
    }
    public pause(fn?: ICallbackHandler): IAnimation {
        multiapply(this._animations, 'pause', [], fn);
        return this;
    }
    public reverse(fn?: ICallbackHandler): IAnimation {
        multiapply(this._animations, 'reverse', [], fn);
        return this;
    }
    public cancel(fn?: ICallbackHandler): IAnimation {
        multiapply(this._animations, 'cancel', [], fn);
        return this;
    }
    get onfinish(): IConsumer<AnimationEvent> {
        if (this._animations.length === 0) {
            return undefined;
        }
        return this._animations[0].onfinish as IConsumer<AnimationEvent> || noop;
    }
    set onfinish(val: IConsumer<AnimationEvent>) {
        each(this._animations, (a: IAnimation) => { a.onfinish = val; });
    }
}