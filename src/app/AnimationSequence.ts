import {IAnimation, IAnimationSequenceStep, ICallbackHandler, IConsumer} from './types';
import {AnimationManager} from './Animationmanager';
import {noop} from './helpers';

export class AnimationSequence implements IAnimation {
    private currentIndex: number;
    private manager: AnimationManager;
    private steps: IAnimationSequenceStep[];
    private isReversed = false;
    private errorCallback: ICallbackHandler;
    
    onfinish: IConsumer<AnimationEvent>;
    
    constructor(manager: AnimationManager, steps: IAnimationSequenceStep[]) {
        this.manager = manager;
        this.steps = steps;
        this.currentIndex = -1;
        this.onfinish = noop;
    } 
    
    private isActive() {
        return this.currentIndex > -1 && this.currentIndex < this.steps.length;
    }
    private getAnimator() {
        const it = this.steps[this.currentIndex];
        if (it._animator) {
            return it._animator;
        }
        it._animator = this.manager.animate(it.keyframes, it.el, it.timings)
        return it._animator;
    }
    private playNextStep(evt: AnimationEvent) {
        if (this.isReversed) {
            this.currentIndex--;
        } else {
            this.currentIndex++;
        }
        if (this.isActive()) {
            this.playThisStep();
        } else {
            this.onfinish(evt);
        }
    }
    private playThisStep() {
        if (!this.isActive()) {
            this.currentIndex = this.isReversed ? this.steps.length - 1 : 0;
        }
        const animator = this.getAnimator();
        animator.onfinish = evt => {
            this.playNextStep(evt);
        };
        
        animator.play(this.errorCallback);
    }
    finish(fn?: ICallbackHandler) {
        this.currentIndex = this.isReversed ? this.steps.length : -1;
        
        for (let x = 0; x < this.steps.length; x++) {
            const step = this.steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        this.onfinish(undefined);
        return this;
    }
    play(fn?: ICallbackHandler) {
        this.isReversed = false;
        this.playThisStep();
        return this;
    }
    pause(fn?: ICallbackHandler) {
        // ignore pause if not relevant
        if (!this.isActive()) {
            return this;
        }
        const animator = this.getAnimator();
        animator.pause(fn);
        return this;
    }
    reverse(fn?: ICallbackHandler) {
        this.isReversed = true;
        this.playThisStep();
        return this;
    }
    cancel(fn?: ICallbackHandler) {
        this.isReversed = false;
        this.currentIndex = -1;
        for (let x = 0; x < this.steps.length; x++) {
            const step = this.steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        return this;
    }
}