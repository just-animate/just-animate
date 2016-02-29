import {IAnimation, ICallbackHandler, IConsumer} from './types'
import {multiapply, each, first, isArray} from './helpers';

export class AnimationRelay implements IAnimation {
    animations: IAnimation[];
    constructor(animations: IAnimation[]) {
        if (!isArray(animations)) {
            throw Error('AnimationRelay requires an array of animations');
        }
        this.animations = animations;
    } 
    finish(fn?: ICallbackHandler) {
        multiapply(this.animations, 'finish', [], fn);
        return this;
    }
    play(fn?: ICallbackHandler) {
        multiapply(this.animations, 'play', [], fn);
        return this;
    }
    pause(fn?: ICallbackHandler) {
        multiapply(this.animations, 'pause', [], fn);
        return this;
    }
    reverse(fn?: ICallbackHandler) {
        multiapply(this.animations, 'reverse', [], fn);
        return this;
    }
    cancel(fn?: ICallbackHandler) {
        multiapply(this.animations, 'cancel', [], fn);
        return this;
    }
    get onfinish() {
        if (this.animations.length === 0) {
            return undefined;
        }
        return this.animations[0].onfinish;
    }
    set onfinish(val: IConsumer<AnimationEvent>) {
        each(this.animations, a => { a.onfinish = val; });
    }
}