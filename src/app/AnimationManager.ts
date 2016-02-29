declare const jQuery;

import {extend, isArray, isFunction, each, multiapply, toArray, map} from './helpers';
import * as types from './types';
import {AnimationRelay} from './AnimationRelay';
import {AnimationSequence} from './AnimationSequence';

function getElements(source: types.ElementSource): Element[] {
    if (!source) {
        throw Error("Cannot find elements.  Source is undefined");
    }
    if (source instanceof Element) {
        return [source];
    }
    if (typeof source === 'string') {
        return toArray(document.querySelectorAll(source));
    }
    if (isArray(source) || (typeof jQuery === 'function' && source instanceof jQuery)) {
        const elements = [];
        each(source as any[], i => {
            elements.push.apply(elements, getElements(i));
        });
        return elements;
    }
    if (isFunction(source)) {
        const provider = source as types.IElementProvider;
        const result = provider();
        return getElements(result);
    }
    return [];
}

export class AnimationManager {
    private _definitions: types.IAnimationOptionsMap;
    private _timings: types.IAnimationTiming;

    constructor() {
        this._definitions = {};
        this._timings = {
            duration: 1000,
            fill: "both"
        };
    }

    animate(name: string, el: string, timings?: types.IAnimationTiming): types.IAnimation;    
    animate(name: string, el: Element, timings?: types.IAnimationTiming): types.IAnimation;    
    animate(name: string, el: types.jQuery, timings?: types.IAnimationTiming): types.IAnimation;    
    animate(name: string, el: types.IElementProvider, timings?: types.IAnimationTiming): types.IAnimation;
    animate(name: string, el: types.ElementSource[], timings?: types.IAnimationTiming): types.IAnimation; 
    animate(keyframes: types.IKeyframe[], el: string, timings?: types.IAnimationTiming): types.IAnimation;    
    animate(keyframes: types.IKeyframe[], el: Element, timings?: types.IAnimationTiming): types.IAnimation;    
    animate(keyframes: types.IKeyframe[], el: types.jQuery, timings?: types.IAnimationTiming): types.IAnimation;    
    animate(keyframes: types.IKeyframe[], el: types.IElementProvider, timings?: types.IAnimationTiming): types.IAnimation;
    animate(keyframes: types.IKeyframe[], el: types.ElementSource[], timings?: types.IAnimationTiming): types.IAnimation;  
    animate(keyframesOrName: string|types.IKeyframe[], el: types.ElementSource, timings?: types.IAnimationTiming): types.IAnimation {
        if (typeof keyframesOrName === 'undefined') {
            return;
        }

        let keyframes;
        if (isArray(keyframesOrName)) {
            keyframes = keyframesOrName;
        } else {
            const definition = this._definitions[keyframesOrName as string];
            keyframes = definition.keyframes
            timings = extend({}, definition.timings, timings);
        }
        
        const elements = getElements(el);
        const players = multiapply(elements, 'animate', [keyframes, timings]) as types.IAnimation[];

        return new AnimationRelay(players);

    }
    configure(timings?: types.IAnimationTiming) {
        extend(this._timings, timings);
    }
    register(name: string, animationOptions: types.IAnimationOptions) {
        this._definitions[name] = animationOptions;

        const self = this;
        self[name] = (el, timings) => {
            return self.animate(name, el, timings);
        };
        return self;
    }
    sequence(steps: types.IAnimationSequenceStep[]) : types.IAnimation {
        const animationSteps = map(steps, step => {
            if (step.command) {
                return step;
            }
            if (!step.name) {
                return step;
            }

            const definition = this._definitions[step.name];
            let timings = extend({}, definition.timings);
            if (step.timings) {
                timings = extend(timings, step.timings);
            }
            return {
                keyframes: definition.keyframes,
                timings: timings,
                el: step.el
            };
        }) as types.IAnimationSequenceStep[];
        
        return new AnimationSequence(this, animationSteps);
    }
}