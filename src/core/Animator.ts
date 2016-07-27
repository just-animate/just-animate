import {head, each} from '../helpers/lists';
import {Dispatcher} from './Dispatcher';

export class Animator implements ja.IAnimator {
    private _effects: ja.IAnimator[] = undefined;
    private _dispatcher: Dispatcher = new Dispatcher();

    public get duration(): number {
        const first = head(this._effects);
        return first ? first.duration : undefined;
    }
    public set duration(val: number) {
        each(this._effects, (a: ja.IAnimator) => a.duration = val);
    }
    public get currentTime(): number {
        const first = head(this._effects);
        return first ? first.currentTime : undefined;
    }
    public set currentTime(val: number) {
        each(this._effects, (a: ja.IAnimator) => a.currentTime = val);
    }
    public get playbackRate(): number {
        const first = head(this._effects);
        return first ? first.playbackRate : undefined;
    }
    public set playbackRate(val: number) {
        each(this._effects, (a: ja.IAnimator) => a.playbackRate = val);
    }

    constructor(effects: any[]) {
        this._effects = effects;
    }

    public addEventListener(eventName: string, listener: Function): void {
        this._dispatcher.on(eventName, listener);
    }

    public removeEventListener(eventName: string, listener: Function): void {
       this._dispatcher.off(eventName, listener);
    }

    /**
     * (description)
     * 
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    public cancel(): void {
        each(this._effects, (a: ja.IAnimator) => {
            a.cancel();
            a.currentTime = 0;
        });
        this._dispatcher.trigger('cancel');
    }

    /**
     * (description)
     * 
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    public finish(): void {
        const newTime = this.playbackRate < 0 ? 0 : this.duration;
        each(this._effects, (e: ja.IAnimator) => {
            e.finish();
            e.currentTime = newTime;
        });
        this._dispatcher.trigger('finish');
    }

    /**
     * (description)
     * 
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    public play(): void {
        each(this._effects, (e: ja.IAnimator) => e.play());
    }

    /**
     * (description)
     * 
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    public pause(): void {
        each(this._effects, (e: ja.IAnimator) => e.pause());
    }

    /**
     * (description)
     * 
     * @param {ICallbackHandler} [fn] (description)
     * @returns {IAnimator} (description)
     */
    public reverse(): void {
        each(this._effects, (e: ja.IAnimator) => e.reverse());
    }
}
