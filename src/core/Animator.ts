import {each, head, maxBy} from '../helpers/lists';
import {Dispatcher} from './Dispatcher';
import {ITimeLoop} from './TimeLoop';

const call = 'call';
const set = 'set';
const finish = 'finish';
const cancel = 'cancel';
const play = 'play';
const pause = 'pause';
const reverse = 'reverse';
const running = 'running';
const pending = 'pending';

export class Animator implements ja.IAnimator {
    private _effects: ja.IAnimator[];
    private _dispatcher: Dispatcher;
    private _timeLoop: ITimeLoop;

    private _currentTime: number;
    private _duration: number;
    private _playbackRate: number;
    private _playState: ja.AnimationPlaybackState;

    public get currentTime(): number {
        return this._currentTime;
    }
    public set currentTime(value: number) {
        this._currentTime = value;
        this._dispatcher.trigger(set, ['currentTime', value]);
    }

    public get playbackRate(): number {
        return this._playbackRate;
    }
    public set playbackRate(value: number) {
        this._playbackRate = value;
        this._dispatcher.trigger(set, ['playbackRate', value]);        
    }

    public get playState(): ja.AnimationPlaybackState {
        return this._playState;
    }
    public get duration(): number {
        return this._duration;
    }
    public get iterationStart(): number {
        return 0;
    }
    public get iterations(): number {
        return 1;
    }
    public get endTime(): number {
        return this._duration;
    }
    public get startTime(): number {
        return 0;
    }
    public get totalDuration(): number {
        return this._duration;
    }

    constructor(effects: ja.IAnimator[], timeLoop: ITimeLoop) {
        effects = effects || [];

        const dispatcher = new Dispatcher();
        const firstEffect = head(effects);

        if (firstEffect) {
            firstEffect.on(finish, () => {
                this._dispatcher.trigger(finish);
                this._timeLoop.off(this._tick);
            });
        }

        each(effects, (effect: ja.IAnimator) => {
            dispatcher.on(set, (propName: string, propValue: any) => { effect[propName] = propValue; });
            dispatcher.on(call, (functionName: string) => { effect[functionName](); });
        });

        this._duration = maxBy(effects, (e: ja.IAnimator) => e.totalDuration);
        this._tick = this._tick.bind(this);
        this._dispatcher = dispatcher;
        this._timeLoop = timeLoop;
        this._effects = effects;
    }

    public on(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.on(eventName, listener);
        return this;
    }

    public off(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.off(eventName, listener);
        return this;        
    }

    public cancel(): ja.IAnimator {
        this._dispatcher.trigger(call, [cancel]);
        this.currentTime = 0;
        this._dispatcher.trigger(cancel);
        return this;        
    }

    public finish(): ja.IAnimator {
        this._dispatcher.trigger(call, [finish]);
        this.currentTime = this.playbackRate < 0 ? 0 : this.duration;
        this._dispatcher.trigger(finish);
        return this;        
    }

    public play(): ja.IAnimator {
        this._dispatcher.trigger(call, [play]);
        this._dispatcher.trigger(play);
        this._timeLoop.on(this._tick);
        return this;        
    }

    public pause(): ja.IAnimator {
        this._dispatcher.trigger(call, [pause]);
        this._dispatcher.trigger(pause);
        return this;        
    }

    public reverse(): ja.IAnimator {
        this._dispatcher.trigger(call, [reverse]);
        this._dispatcher.trigger(reverse);
        return this;        
    }

    private _tick(): void {
        this._dispatcher.trigger('update', [this.currentTime]);

        const firstEffect = head(this._effects);

        this._currentTime = firstEffect.currentTime;
        this._playbackRate = firstEffect.playbackRate;
        this._playState = firstEffect.playState;

        if (this._playState !== running && this._playState !== pending) {
            this._timeLoop.off(this._tick);
        }        
    }
}



