import {extend, isFunction, map, noop} from './utils';

/**
 * (description)
 * 
 * @export
 * @class SequenceAnimator
 * @implements {ja.IAnimator}
 */
export class SequenceAnimator implements ja.IAnimator {
  
    /**
     * (description)
     * 
     * @type {number}
     */
    public playbackRate: number;
    /**
     * (description)
     * 
     * @type {ja.IConsumer<ja.IAnimator>}
     */
    public onfinish: ja.IConsumer<ja.IAnimator>;
    /**
     * (description)
     * 
     * @type {ja.IConsumer<ja.IAnimator>}
     */
    public oncancel: ja.IConsumer<ja.IAnimator>;   

    private _currentIndex: number;
    private _errorCallback: ja.ICallbackHandler;
    private _manager: ja.IAnimationManager;
    private _steps: IInnerSequenceEvent[];

    /**
     * (description)
     * 
     * @readonly
     * @type {number}
     */
    get currentTime(): number {
        const currentIndex = this._currentIndex;
        const len = this._steps.length;
        if (currentIndex === -1 || currentIndex === len) {
            return 0;
        }        
        
        const isReversed = this.playbackRate === -1;

        let beforeTime = 0;
        let afterTime = 0;
        let currentTime: number;

        for (let i = 0; i < len; i++) {
            const step = this._steps[i];
            if (i < currentIndex) {
                beforeTime += step.timings.duration;
                continue;
            }
            if (i > currentIndex) {
                afterTime += step.timings.duration;
                continue;
            }
            if (isReversed) {
                currentTime = this.duration - step.animator.currentTime;
                continue;
            }
            currentTime = step.animator.currentTime;
        }

        return currentTime + (isReversed ? afterTime : beforeTime);
    }    

    /**
     * (description)
     * 
     * @readonly
     * @type {number}
     */
    get duration(): number {
        return this._steps.reduce((c: number, n: IInnerSequenceEvent) => c + (n.timings.duration || 0), 0);
    }

    /**
     * Creates an instance of SequenceAnimator.
     * 
     * @param {ja.IAnimationManager} manager (description)
     * @param {ja.ISequenceOptions} options (description)
     */
    constructor(manager: ja.IAnimationManager, options: ja.ISequenceOptions) {
        /**
         * (description)
         * 
         * @param {ja.ISequenceEvent} step (description)
         * @returns (description)
         */
        const steps: IInnerSequenceEvent[] = map(options.steps, (step: ja.ISequenceEvent) => {
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
                timings: definition.timings
            };
        });

        this.onfinish = noop;
        this._currentIndex = -1;
        this._manager = manager;
        this._steps = steps;

        if (options.autoplay === true) {
            this.play();
        }        
    }
    
    /**
     * (description)
     * 
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    public finish(fn?: ja.ICallbackHandler): ja.IAnimator {
        this._errorCallback = fn;
        this._currentIndex = -1;
        
        for (let x = 0; x < this._steps.length; x++) {
            const step = this._steps[x];
            if (step.animator !== undefined) {
                step.animator.cancel(fn);
            }
        }
        if (isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    }
    /**
     * (description)
     * 
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    public play(fn?: ja.ICallbackHandler): ja.IAnimator {
        this._errorCallback = fn;
        this.playbackRate = 1;
        this._playThisStep();
        return this;
    }
    /**
     * (description)
     * 
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    public pause(fn?: ja.ICallbackHandler): ja.IAnimator {
        this._errorCallback = fn;
        // ignore pause if not relevant
        if (!this._isInEffect()) {
            return this;
        }
        const animator = this._getAnimator();
        animator.pause(fn);
        return this;
    }
    /**
     * (description)
     * 
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    public reverse(fn?: ja.ICallbackHandler): ja.IAnimator {
        this._errorCallback = fn;
        this.playbackRate = -1;
        this._playThisStep();
        return this;
    }
    /**
     * (description)
     * 
     * @param {ja.ICallbackHandler} [fn] (description)
     * @returns {ja.IAnimator} (description)
     */
    public cancel(fn?: ja.ICallbackHandler): ja.IAnimator {
        this._errorCallback = fn;
        this.playbackRate = undefined;
        this._currentIndex = -1;
        for (let x = 0; x < this._steps.length; x++) {
            const step = this._steps[x];
            if (step.animator !== undefined) {
                step.animator.cancel(fn);
            }
        }
        if (isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    }
    
    private _isInEffect(): boolean {
        return this._currentIndex > -1 && this._currentIndex < this._steps.length;
    }

    private _getAnimator(): ja.IAnimator {
        const it = this._steps[this._currentIndex];
        if (it.animator) {
            return it.animator;
        }
        it.animator = this._manager.animate(it.keyframes, it.el, it.timings);
        return it.animator;
    }

    private _playNextStep(evt: ja.IAnimator): void {
        if (this.playbackRate === -1) {
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
            if (this.playbackRate === -1) {
                this._currentIndex = this._steps.length - 1;
            } else {
                this._currentIndex = 0;
            }
        }
        const animator = this._getAnimator();

        animator.onfinish = (evt: ja.IAnimator) => {
            this._playNextStep(evt);
        };
        
        animator.play(this._errorCallback);
    }
}

interface IInnerSequenceEvent {
    el: ja.ElementSource;
    name?: string;
    command?: string;
    timings?: ja.IAnimationEffectTiming;
    keyframes?: ja.IIndexed<ja.IKeyframe>;
    animator?: ja.IAnimator;
}
