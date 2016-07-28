import {extend} from '../helpers/objects';
import {map} from '../helpers/lists';
import {isDefined} from '../helpers/type';
import {Dispatcher} from './Dispatcher';

/**
 * (description)
 * 
 * @export
 * @class SequenceAnimator
 * @implements {ja.IAnimator}
 */
export class SequenceAnimator implements ja.IAnimator {
    public playbackRate: number;

    private _currentIndex: number;
    private _duration: number;    
    private _manager: ja.IAnimationManager;
    private _steps: IInnerSequenceEvent[];
    private _dispatcher: Dispatcher = new Dispatcher();

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
    get duration(): number {
        return this._duration;
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
            } as IInnerSequenceEvent;
        });

        this._currentIndex = -1;
        this._manager = manager;
        this._steps = steps;
        this._duration = this._steps.reduce((c: number, n: IInnerSequenceEvent) => c + (n.timings.duration || 0), 0);

        if (options.autoplay === true) {
            this.play();
        }
    }

    public addEventListener(eventName: string, listener: Function): void {
        this._dispatcher.on(eventName, listener);
    }

    public removeEventListener(eventName: string, listener: Function): void {
       this._dispatcher.off(eventName, listener);
    }

    public finish(): void {
        this._currentIndex = -1;

        for (let x = 0; x < this._steps.length; x++) {
            const step = this._steps[x];
            if (isDefined(step.animator)) {
                step.animator.cancel();
            }
        }
    }
    public play(): void {
        this.playbackRate = 1;
        this._playThisStep();
    }
    public pause(): void {
        // ignore pause if not relevant
        if (!this._isInEffect()) {
            return;
        }
        const animator = this._getAnimator();
        animator.pause();
    }
    public reverse(): void {
        this.playbackRate = -1;
        this._playThisStep();
    }
    public cancel(): void {
        this.playbackRate = undefined;
        this._currentIndex = -1;
        
        for (let x = 0; x < this._steps.length; x++) {
            const step = this._steps[x];
            if (isDefined(step.animator)) {
                step.animator.cancel();
            }
        }
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
    private _playNextStep(): void {
        if (this.playbackRate === -1) {
            this._currentIndex--;
        } else {
            this._currentIndex++;
        }
        if (this._isInEffect()) {
            this._playThisStep();
        } else {
            this._dispatcher.trigger('finish');
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
        const self = this;

        function onFinish(): void {
            self._playNextStep();
            animator.removeEventListener('finish', onFinish);
        }

        animator.addEventListener('finish', onFinish);
        animator.play();
    }
}

interface IInnerSequenceEvent {
    el: ja.ElementSource;
    name?: string;
    command?: string;
    timings?: ja.IAnimationEffectTiming;
    keyframes?: ja.IKeyframeOptions[];
    animator?: ja.IAnimator;
}
