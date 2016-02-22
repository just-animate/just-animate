import {extend} from './helpers';

export interface IAnimationTiming {
    duration?: number;
    fill?: string;
    iterations?: number;
}

export interface IKeyframe {

}

interface IKeyframeGroup {
    keyframes: IKeyframe[];
    timings?: IAnimationTiming;
}

interface IKeyframeGroupDict {
    [name: string]: IKeyframeGroup
}

interface IAnimationManager {
    animate(name: string, el: Element, timing?: IAnimationTiming);
}

export class AnimationManager {
    private _definitions: IKeyframeGroupDict;
    private _timings: IAnimationTiming;

    constructor() {
        this._definitions = {};
        this._timings = {
            "duration": 1000,
            "fill": "both"
        };
    }
    animate(name: string, el: Element, timings?: IAnimationTiming) {
        //var promise = Promise();
            
        if (typeof name === 'undefined') {
            //promise.reject("Just.animate() requires an animation name as the first argument")
            return //promise;
        }

        var definition = this._definitions[name];
        if (typeof definition === 'undefined') {
            //promise.reject("animation \"" + name + "\" was not found")
            return //promise;
        }

        var timings2 = extend({}, definition.timings);
        if (timings) {
            timings2 = extend(timings2, timings);
        }

        var keyframes = definition.keyframes;
        var player = el['animate'](keyframes, timings2)

        player.onfinish = function() {
            //promise.resolve();
        };

        return //promise;
    }
    configure(timings?: IAnimationTiming) {
        extend(this._timings, timings);
    }
    register(name: string, keyframes: IKeyframe[], timings?: IAnimationTiming) {
        var definition = {
            keyframes: keyframes,
            timings: timings
        };
        this._definitions[name] = definition;

        var self = this;
        this[name] = function(el, timings) {
            return self.animate(name, el, timings);
        };
        return this;
    }
}