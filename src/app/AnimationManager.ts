import {ElementSource, IAnimation, IAnimationManager,
    IAnimationOptions, IAnimationSheetOptions, IAnimationSequenceEvent, IAnimationSheetEvent, IAnimationSequenceOptions,
    IAnimationTiming, IElementProvider, IIndexed, IKeyframe, IMap} from './types';
import {extend, isArray, isFunction, isJQuery, isString, each, multiapply, toArray, map} from './helpers';
import {AnimationRelay} from './AnimationRelay';
import {AnimationSequence} from './AnimationSequence';
import {AnimationSheet} from './AnimationSheet';

function getElements(source: ElementSource): Element[] {
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
    if (isArray(source) || isJQuery(source)) {
        // if array or jQuery object, flatten to an array
        const elements = [];
        each(source as IIndexed<any>, (i: any) => {
            // recursively call this function in case of nested elements
            const innerElements = getElements(i);
            elements.push.apply(elements, innerElements);
        });
        return elements;
    }
    if (isFunction(source)) {
        // if function, call it and call this function
        const provider = source as IElementProvider;
        const result = provider();
        return getElements(result);
    }

    // otherwise return empty    
    return [];
}

export class AnimationManager implements IAnimationManager {
    private _registry: { [key: string]: IAnimationOptions };
    private _timings: IAnimationTiming;
    private _easings: IMap<string>;

    constructor() {
        this._registry = {};
        this._easings = {};
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
    }

    public animate(keyframesOrName: string | IIndexed<IKeyframe>, el: ElementSource, timings?: IAnimationTiming): IAnimation {
        if (!keyframesOrName) {
            return;
        }
        
        let keyframes;
        if (isString(keyframesOrName)) {
            // if keyframes is a string, lookup keyframes from registry
            const definition = this._registry[keyframesOrName as string];
            keyframes = definition.keyframes;

            // use registered timings as default, then load timings from params           
            timings = extend({}, definition.timings, timings);
        } else {
            // otherwise, keyframes are actually keyframes
            keyframes = keyframesOrName;
        }

        if (timings && timings.easing) {
            // if timings contains an easing property, 
            const easing = this._easings[timings.easing];
            if (easing) {
                timings.easing = easing;
            }
        }

        // get list of elements to animate
        const elements = getElements(el);

        // call .animate on all elements and get a list of their players        
        const players = multiapply(elements, 'animate', [keyframes, timings]) as IAnimation[];

        // return an animation relay for all players       
        return new AnimationRelay(players);
    }
    public animateSequence(options: IAnimationSequenceOptions): IAnimation {
        const animationSteps = map(options.steps, (step: IAnimationSequenceEvent) => {
            if (step.command || !step.name) {
                return step;
            }

            const definition = this._registry[step.name];
            let timings = extend({}, definition.timings);
            if (step.timings) {
                timings = extend(timings, step.timings);
            }
            return {
                el: step.el,
                keyframes: definition.keyframes,
                timings: timings
            };
        }) as IAnimationSequenceEvent[];

        const sequence = new AnimationSequence(this, animationSteps);
        if (options.autoplay === true) {
            sequence.play();
        }
        return sequence;        
    }
    public animateSheet(options: IAnimationSheetOptions): IAnimation {
        const sheetDuration = options.duration;
        if (sheetDuration === undefined) {
            throw Error('Duration is required');
        }

        const animationEvents = map(options.events, (evt: IAnimationSheetEvent) => {
            let keyframes: IIndexed<IKeyframe>;
            let timings: IAnimationTiming;
            let el: ElementSource;
            
            if (evt.name) {
                const definition = this._registry[evt.name];
                let timings2 = extend({}, definition.timings);
                if (evt.timings) {
                    timings = extend(timings, evt.timings);
                }
                keyframes = definition.keyframes;
                timings = timings2;
                el = evt.el;
            } else {
                keyframes = evt.keyframes;
                timings = evt.timings;
                el = evt.el;
            }

            // calculate endtime
            const startTime = sheetDuration * evt.offset;
            let endTime = startTime + timings.duration;
            const isClipped = endTime > sheetDuration;

            // if end of animation is clipped, set endTime to duration            
            if (isClipped) {
                endTime = sheetDuration;
            }

            return {
                keyframes: keyframes,
                timings: timings,
                el: el,
                offset: evt.offset,
                _isClipped: isClipped,
                _startTimeMs: startTime,
                _endTimeMs: endTime
            };
        }) as IAnimationSheetEvent[];
        
        const sheet = new AnimationSheet({
            autoplay: options.autoplay,
            duration: options.duration,
            events: animationEvents
        });
        return sheet;
    }
    public configure(timings?: IAnimationTiming, easings?: IMap<string>): IAnimationManager {
        if (timings) {
            extend(this._timings, timings);
        }
        if (easings) {
            extend(this._easings, easings);
        }
        return this;
    }
    public register(name: string, animationOptions: IAnimationOptions): IAnimationManager {
        this._registry[name] = animationOptions;

        const self = this;
        self[name] = (el: ElementSource, timings: IAnimationTiming) => {
            return self.animate(name, el, timings);
        };
        return self;
    }
}