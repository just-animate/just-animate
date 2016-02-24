import {IAnimation, ICallbackHandler} from './interfaces'
import {multiapply} from './helpers';

export class AnimationRelay implements IAnimation {
    animations: IAnimation[];
    constructor(animations: IAnimation[]) {
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
}