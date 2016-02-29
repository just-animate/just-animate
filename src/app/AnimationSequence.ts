import {IAnimation, IAnimationSequenceStep, ICallbackHandler} from './types';
import {AnimationManager} from './Animationmanager';

export class AnimationSequence implements IAnimation {
    private currentIndex: number;
    private manager: AnimationManager;
    private steps: IAnimationSequenceStep[];
    private isReversed = false;
    private errorCallback: ICallbackHandler;
    
    constructor(manager: AnimationManager, steps: IAnimationSequenceStep[]) {
        this.manager = manager;
        this.steps = steps;
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
        // TODO: figure out behavior for finish
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
        // TODO: figure out behavior for cancel
        return this;
    }
}