import {IAnimation, IAnimationManager, IAnimationSequenceEvent, ICallbackHandler, IConsumer} from './types';
import {noop} from './helpers';

export class AnimationSequence implements IAnimation {
    public onfinish: IConsumer<AnimationEvent>;
    private _currentIndex: number;
    private _isReversed: boolean;
    private _errorCallback: ICallbackHandler;
    private _manager: IAnimationManager;
    private _steps: IAnimationSequenceEvent[];

    constructor(manager: IAnimationManager, steps: IAnimationSequenceEvent[]) {
        this.onfinish = noop;
        this._currentIndex = -1;
        this._isReversed = false;
        this._manager = manager;
        this._steps = steps;
    }
    
    public finish(fn?: ICallbackHandler): IAnimation {
        this._errorCallback = fn;
        this._currentIndex = this._isReversed ? this._steps.length : -1;
        
        for (let x = 0; x < this._steps.length; x++) {
            const step = this._steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        this.onfinish(undefined);
        return this;
    }
    public play(fn?: ICallbackHandler): IAnimation {
        this._errorCallback = fn;
        this._isReversed = false;
        this._playThisStep();
        return this;
    }
    public pause(fn?: ICallbackHandler): IAnimation {
        this._errorCallback = fn;
        // ignore pause if not relevant
        if (!this._isInEffect()) {
            return this;
        }
        const animator = this._getAnimator();
        animator.pause(fn);
        return this;
    }
    public reverse(fn?: ICallbackHandler): IAnimation {
        this._errorCallback = fn;
        this._isReversed = true;
        this._playThisStep();
        return this;
    }
    public cancel(fn?: ICallbackHandler): IAnimation {
        this._errorCallback = fn;
        this._isReversed = false;
        this._currentIndex = -1;
        for (let x = 0; x < this._steps.length; x++) {
            const step = this._steps[x];
            if (step._animator !== undefined) {
                step._animator.cancel(fn);
            }
        }
        return this;
    }
    private _isInEffect(): boolean {
        return this._currentIndex > -1 && this._currentIndex < this._steps.length;
    }
    private _getAnimator(): IAnimation {
        const it = this._steps[this._currentIndex];
        if (it._animator) {
            return it._animator;
        }
        it._animator = this._manager.animate(it.keyframes, it.el, it.timings);
        return it._animator;
    }
    private _playNextStep(evt: AnimationEvent): void {
        if (this._isReversed) {
            this._currentIndex--;
        } else {
            this._currentIndex++;
        }
        if (this._isInEffect()) {
            this._playThisStep();
        } else {
            this.onfinish(evt);
        }
    }
    private _playThisStep(): void {
        if (!this._isInEffect()) {
            this._currentIndex = this._isReversed ? this._steps.length - 1 : 0;
        }
        const animator = this._getAnimator();
        animator.onfinish = (evt: AnimationEvent) => {
            this._playNextStep(evt);
        };
        
        animator.play(this._errorCallback);
    }
}