import {each, head, maxBy} from '../helpers/lists';
import {isDefined} from '../helpers/type';
import {createDispatcher, IDispatcher} from './Dispatcher';
import {ITimeLoop} from './TimeLoop';

const call = 'call';
const finish = 'finish';
const cancel = 'cancel';
const play = 'play';
const pause = 'pause';
const reverse = 'reverse';
const running = 'running';
const pending = 'pending';

export class Animator implements ja.IAnimator {
    private _effects: ja.IAnimator[];
    private _dispatcher: IDispatcher;
    private _timeLoop: ITimeLoop;

    private _currentTime: number;
    private _duration: number;
    private _playbackRate: number;
    private _playState: ja.AnimationPlaybackState;

    public currentTime(): number;    
    public currentTime(value: number): ja.IAnimator;    
    public currentTime(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._currentTime;
        }
        self._currentTime = value;
        self._dispatcher.trigger(call, ['currentTime', value]);
        return self;
    }

    public playbackRate(): number;    
    public playbackRate(value: number): ja.IAnimator;       
    public playbackRate(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._currentTime;
        }
        self._playbackRate = value;
        self._dispatcher.trigger(call, ['playbackRate', value]);        
        return self;
    }

    public playState(): ja.AnimationPlaybackState {
        return this._playState;
    }
    public duration(): number {
        return this._duration;
    }
    public iterationStart(): number {
        return 0;
    }
    public iterations(): number {
        return 1;
    }
    public endTime(): number {
        return this._duration;
    }
    public startTime(): number {
        return 0;
    }
    public totalDuration(): number {
        return this._duration;
    }

    constructor(effects: ja.IAnimator[], timeLoop: ITimeLoop) {
        const self = this;
        effects = effects || [];

        const dispatcher = createDispatcher();
        const firstEffect = head(effects);

        if (firstEffect) {
            firstEffect.on(finish, () => {
                self._dispatcher.trigger(finish);
                self._timeLoop.off(self._tick);
            });
        }

        each(effects, (effect: ja.IAnimator) => {
            dispatcher.on(call, (functionName: string, arg1: string|number) => { effect[functionName](arg1); });
        });

        self._duration = maxBy(effects, (e: ja.IAnimator) => e.totalDuration());
        self._tick = self._tick.bind(self);
        self._dispatcher = dispatcher;
        self._timeLoop = timeLoop;
        self._effects = effects;
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
        const self = this;
        self._dispatcher.trigger(call, [cancel]);
        self.currentTime(0);
        self._dispatcher.trigger(cancel);
        return self;        
    }

    public finish(): ja.IAnimator {
        const self = this;        
        self._dispatcher.trigger(call, [finish]);
        self.currentTime(self._playbackRate < 0 ? 0 : self._duration);
        self._dispatcher.trigger(finish);
        return self;        
    }

    public play(): ja.IAnimator {
        const self = this;     
        self._dispatcher.trigger(call, [play]);
        self._dispatcher.trigger(play);
        self._timeLoop.on(self._tick);
        return self;        
    }

    public pause(): ja.IAnimator {
        const self = this;    
        self._dispatcher.trigger(call, [pause]);
        self._dispatcher.trigger(pause);
        return self;        
    }

    public reverse(): ja.IAnimator {
        const self = this;   
        self._dispatcher.trigger(call, [reverse]);
        self._dispatcher.trigger(reverse);
        return self;        
    }

    private _tick(): void {
        const self = this;
        const firstEffect = head(self._effects);

        self._dispatcher.trigger('update', [self.currentTime]);
        self._currentTime = firstEffect.currentTime();
        self._playbackRate = firstEffect.playbackRate();
        self._playState = firstEffect.playState();
 
        if (self._playState !== running && self._playState !== pending) {
            self._timeLoop.off(self._tick);
        }        
    }
}



