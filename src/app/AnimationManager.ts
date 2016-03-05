import {ElementSource, IAnimation, IAnimationManager,  
    IAnimationOptions, IAnimationSequenceStep, 
    IAnimationTiming, IElementProvider, IIndexed, IKeyframe} from './types';
import {extend, isArray, isFunction, isJQuery, isString, each, multiapply, toArray, map} from './helpers';
import {AnimationRelay} from './AnimationRelay';
import {AnimationSequence} from './AnimationSequence';

function getElements(source: ElementSource): Element[] {
    if (!source) {
        throw Error('Cannot find elements.  Source is undefined');
    }
    if (source instanceof Element) {
        return [source];
    }
    if (isString(source)) {
        return toArray(document.querySelectorAll(source as string));
    }
    if (isArray(source) || isJQuery(source)) {
        const elements = [];
        each(source as any[], (i: any) => {
            elements.push.apply(elements, getElements(i));
        });
        return elements;
    }
    if (isFunction(source)) {
        const provider = source as IElementProvider;
        const result = provider();
        return getElements(result);
    }
    return [];
}

export class AnimationManager implements IAnimationManager {
    private _definitions: {[key: string]: IAnimationOptions};
    private _timings: IAnimationTiming;

    constructor() {
        this._definitions = {};
        this._timings = {
            duration: 1000,
            fill: 'both'
        };
    }

    public animate(keyframesOrName: string|IIndexed<IKeyframe>, el: ElementSource, timings?: IAnimationTiming): IAnimation {
        if (typeof keyframesOrName === 'undefined') {
            return;
        }

        let keyframes;
        if (isString(keyframesOrName)) {
            const definition = this._definitions[keyframesOrName as string];
            keyframes = definition.keyframes;
            timings = extend({}, definition.timings, timings);
        } else {
            keyframes = keyframesOrName;
        }
        
        const elements = getElements(el);
        const players = multiapply(elements, 'animate', [keyframes, timings]) as IAnimation[];

        return new AnimationRelay(players);

    }
    public configure(timings?: IAnimationTiming): IAnimationManager {
        extend(this._timings, timings);
        return this;
    }
    public register(name: string, animationOptions: IAnimationOptions): IAnimationManager {
        this._definitions[name] = animationOptions;

        const self = this;
        self[name] = (el: ElementSource, timings: IAnimationTiming) => {
            return self.animate(name, el, timings);
        };
        return self;
    }
    public sequence(steps: IAnimationSequenceStep[]): IAnimation {
        const animationSteps = map(steps, (step: IAnimationSequenceStep) => {
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
                el: step.el,
                keyframes: definition.keyframes,
                timings: timings
            };
        }) as IAnimationSequenceStep[];
        
        return new AnimationSequence(this, animationSteps);
    }
}