import {each, head, maxBy} from '../helpers/lists';
import {isDefined} from '../helpers/type';
import {createDispatcher} from './Dispatcher';
import {ITimeLoop} from './TimeLoop';

import {
    finish,
    call,
    cancel,
    play,
    pause,
    reverse,
    running,
    pending
} from '../helpers/resources';


const multiAnimatorProtoType = {
    currentTime(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._currentTime;
        }
        self._currentTime = value;
        self._dispatcher.trigger(call, ['currentTime', value]);
        return self;
    },    
    playbackRate(value?: number): number | ja.IAnimator {
        const self = this;
        if (!isDefined(value)) {
            return self._currentTime;
        }
        self._playbackRate = value;
        self._dispatcher.trigger(call, ['playbackRate', value]);        
        return self;
    },
    playState(): ja.AnimationPlaybackState {
        return this._playState;
    },
    duration(): number {
        return this._duration;
    },
    iterationStart(): number {
        return 0;
    },
    iterations(): number {
        return 1;
    },
    endTime(): number {
        return this._duration;
    },
    startTime(): number {
        return 0;
    },
    totalDuration(): number {
        return this._duration;
    },
    on(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.on(eventName, listener);
        return this;
    },
    off(eventName: string, listener: Function): ja.IAnimator {
        this._dispatcher.off(eventName, listener);
        return this;        
    },
    cancel(): ja.IAnimator {
        const self = this;
        self._dispatcher.trigger(call, [cancel]);
        self.currentTime(0);
        self._dispatcher.trigger(cancel);
        return self;        
    },
    finish(): ja.IAnimator {
        const self = this;        
        self._dispatcher.trigger(call, [finish]);
        self.currentTime(self._playbackRate < 0 ? 0 : self._duration);
        self._dispatcher.trigger(finish);
        return self;        
    },

    play(): ja.IAnimator {
        const self = this;     
        self._dispatcher.trigger(call, [play]);
        self._dispatcher.trigger(play);
        self._timeLoop.on(self._tick);
        return self;        
    },
    pause(): ja.IAnimator {
        const self = this;    
        self._dispatcher.trigger(call, [pause]);
        self._dispatcher.trigger(pause);
        return self;        
    },
    reverse(): ja.IAnimator {
        const self = this;   
        self._dispatcher.trigger(call, [reverse]);
        self._dispatcher.trigger(reverse);
        return self;        
    },
    _tick(): void {
        const self = this;
        const firstEffect = head(self._effects) as ja.IAnimator;

        self._dispatcher.trigger('update', [self.currentTime]);
        self._currentTime = firstEffect.currentTime();
        self._playbackRate = firstEffect.playbackRate();
        self._playState = firstEffect.playState();
 
        if (self._playState !== running && self._playState !== pending) {
            self._timeLoop.off(self._tick);
        }        
    }
};

export function createMultiAnimator(effects: ja.IAnimator[], timeLoop: ITimeLoop): ja.IAnimator {
    const self = Object.create(multiAnimatorProtoType) as ja.IAnimator|any;
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
    return self;
}
