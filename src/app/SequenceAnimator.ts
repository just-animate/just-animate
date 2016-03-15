import {IAnimator} from '../interfaces/IAnimator';
import {IAnimationManager} from '../interfaces/IAnimationManager';
import {ISequenceEvent} from '../interfaces/ISequenceEvent';
import {ISequenceOptions} from '../interfaces/ISequenceOptions';
import {ICallbackHandler} from '../interfaces/ICallbackHandler';
import {IConsumer} from '../interfaces/IConsumer';
import {extend, map, noop} from './helpers';

export class SequenceAnimator implements IAnimator {
    public onfinish: IConsumer<AnimationEvent>;
    private _currentIndex: number;
    private _isReversed: boolean;
    private _errorCallback: ICallbackHandler;
    private _manager: IAnimationManager;
    private _steps: ISequenceEvent[];

    constructor(manager: IAnimationManager, options: ISequenceOptions) {
        const steps: ISequenceEvent[] = map(options.steps, (step: ISequenceEvent) => {
            if (step.command || !step.name) {
                return step;
            }

            const definition = manager.findAnimation(step.name);
            let timings = extend({}, definition.timings);
            if (step.timings) {
                timings = extend(timings, step.timings);
            }
            return {
                el: step.el,
                keyframes: definition.keyframes,
                timings: timings
            };
        });

        this.onfinish = noop;
        this._currentIndex = -1;
        this._isReversed = false;
        this._manager = manager;
        this._steps = steps;

        if (options.autoplay === true) {
            this.play();
        }        
    }
    
    public finish(fn?: ICallbackHandler): IAnimator {
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
    public play(fn?: ICallbackHandler): IAnimator {
        this._errorCallback = fn;
        this._isReversed = false;
        this._playThisStep();
        return this;
    }
    public pause(fn?: ICallbackHandler): IAnimator {
        this._errorCallback = fn;
        // ignore pause if not relevant
        if (!this._isInEffect()) {
            return this;
        }
        const animator = this._getAnimator();
        animator.pause(fn);
        return this;
    }
    public reverse(fn?: ICallbackHandler): IAnimator {
        this._errorCallback = fn;
        this._isReversed = true;
        this._playThisStep();
        return this;
    }
    public cancel(fn?: ICallbackHandler): IAnimator {
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
    private _getAnimator(): IAnimator {
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