import {easings} from '../easings';
import {head, multiapply, each, extend, isArray, isFunction, isString, toArray, max} from './helpers';

export class ElementAnimator implements just.IAnimator {
    public duration: number;
    public onfinish: just.IConsumer<just.IAnimator>;
    public oncancel: just.IConsumer<just.IAnimator>;
    
    private _animators: just.IAnimator[];

    public get playbackRate(): number {
        const first = head(this._animators);
        return first ? first.playbackRate : 0;
    }
    public set playbackRate(val: number) {
        each(this._animators, (a: just.IAnimator) => a.playbackRate = val);
    }    

    constructor(manager: just.IAnimationManager, keyframesOrName: string | just.IIndexed<just.IKeyframe>, 
                el: just.ElementSource, timings?: just.IAnimationEffectTiming) {
        if (!keyframesOrName) {
            return;
        }
        
        let keyframes;
        if (isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            const definition = manager.findAnimation(keyframesOrName as string);
            keyframes = definition.keyframes;

            // use registered timings as default, then load timings from params           
            timings = extend({}, definition.timings, timings);
        } else {
            // otherwise, keyframes are actually keyframes
            keyframes = keyframesOrName;
        }

        if (timings && timings.easing) {
            // if timings contains an easing property, 
            const easing = easings[timings.easing];
            if (easing) {
                timings.easing = easing;
            }
        }

        // add duration to object    
        this.duration = timings.duration;        

        // get list of elements to animate
        const elements = getElements(el);

        // call .animate on all elements and get a list of their players        
        this._animators = multiapply(elements, 'animate', [keyframes, timings]) as just.IAnimator[];

        // hookup finish event for when it happens naturally    
        if (this._animators.length > 0) {
            // todo: try to find a better way than just listening to one of them
            this._animators[0].onfinish = () => {
                this.finish();
            };
        }        
    }

    get currentTime(): number {
        return max(this._animators, 'currentTime') || 0;
    }
    set currentTime(elapsed: number) {
        each(this._animators, (a: just.IAnimator) => a.currentTime = elapsed);
    }

    public finish(fn?: just.ICallbackHandler): just.IAnimator {
        multiapply(this._animators, 'finish', [], fn);
        if (this.playbackRate < 0) {
            each(this._animators, (a: just.IAnimator) => a.currentTime = 0);
        } else {
            each(this._animators, (a: just.IAnimator) => a.currentTime = this.duration);
        }
        if (isFunction(this.onfinish)) {
            this.onfinish(this);
        }
        return this;
    }
    public play(fn?: just.ICallbackHandler): just.IAnimator {
        multiapply(this._animators, 'play', [], fn);
        return this;
    }
    public pause(fn?: just.ICallbackHandler): just.IAnimator {
        multiapply(this._animators, 'pause', [], fn);
        return this;
    }
    public reverse(fn?: just.ICallbackHandler): just.IAnimator {
        multiapply(this._animators, 'reverse', [], fn);
        return this;
    }
    public cancel(fn?: just.ICallbackHandler): just.IAnimator {
        multiapply(this._animators, 'cancel', [], fn);
        each(this._animators, (a: just.IAnimator) => a.currentTime = 0);
        if (isFunction(this.oncancel)) {
            this.oncancel(this);
        }
        return this;
    }
}

function getElements(source: just.ElementSource): Element[] {
    if (!source) {
        throw Error('source is undefined');
    }
    if (isString(source)) {
        // if query selector, search for elements 
        const nodeResults = document.querySelectorAll(source as string);
        return toArray(nodeResults);
    }
    if (source instanceof Element) {
        // if a single element, wrap in array 
        return [source];
    }
    if (isFunction(source)) {
        // if function, call it and call this function
        const provider = source as just.IElementProvider;
        const result = provider();
        return getElements(result);
    }
    if (isArray(source)) {
        // if array or jQuery object, flatten to an array
        const elements = [];
        each(source as just.IIndexed<any>, (i: any) => {
            // recursively call this function in case of nested elements
            const innerElements = getElements(i);
            elements.push.apply(elements, innerElements);
        });
        return elements;
    }

    // otherwise return empty    
    return [];
}
