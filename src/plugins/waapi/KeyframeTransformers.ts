import {isDefined, isNumber, isString, isArray} from '../../common/type';
import {toCamelCase} from '../../common/strings';
import {invalidArg} from '../../common/errors';
import {easings} from '../../common/easings';
import {each, head, tail} from '../../common/lists';
import {listProps, unwrap} from '../../common/objects';
import {KeyframeAnimator} from '../waapi/KeyframeAnimator';

import {
    animate,
    easingString,
    nada,
    nil,
    offsetString,
    scale3d,
    scale,
    scaleX,
    scaleY,
    scaleZ,
    skew,
    skewX,
    skewY,
    rotate3d,
    rotate,
    rotateX,
    rotateY,
    rotateZ,
    translate,
    translate3d,
    x,
    y,
    z,
    translateY,
    translateX,
    translateZ,
    transform
} from '../../common/resources';

const global = window;

const transitionAliases = {
    rotate: transform,
    rotate3d: transform,    
    rotateX: transform,
    rotateY: transform,
    rotateZ: transform,
    scale: transform,    
    scale3d: transform,
    scaleX: transform,
    scaleY: transform,
    scaleZ: transform,
    skew: transform,
    skewX: transform,
    skewY: transform,
    translate: transform,
    translate3d: transform,
    translateX: transform,
    translateY: transform,    
    translateZ: transform,
    x: transform,
    y: transform,
    z: transform
};

export function createAnimator(target: HTMLElement, options: ja.IAnimationOptions): ja.IAnimationController {
    const delay = unwrap(options.delay) || 0;
    const endDelay = unwrap(options.endDelay) || 0;
    const iterations = unwrap(options.iterations) || 1;
    const iterationStart = unwrap(options.iterationStart) || 0;
    const direction = unwrap(options.direction) || nil;
    const duration = options.to - options.from;
    const fill = unwrap(options.fill) || 'none';
    const totalTime = delay + ((iterations || 1) * duration) + endDelay;

    // note: don't unwrap easings so we don't break this later with custom easings
    const easing = options.easing || 'linear';

    const timings = {
        delay,
        endDelay,
        duration,
        iterations,
        iterationStart,
        fill,
        direction,
        easing
    };

    const animator = new KeyframeAnimator(initAnimator.bind(nada, target, timings, options));
    animator.totalDuration = totalTime;
    return animator;
}

function initAnimator(target: HTMLElement, timings: waapi.IEffectTiming, options: ja.IAnimationOptions): waapi.IAnimation {

    // process css as either keyframes or calculate what those keyframes should be   
    const css = options.css;
    let sourceKeyframes: ja.ICssKeyframeOptions[];
    if (isArray(css)) {
        // if an array, no processing has to occur
        sourceKeyframes = css as ja.ICssKeyframeOptions[];
        expandOffsets(sourceKeyframes);
    } else {
        sourceKeyframes = [];
        propsToKeyframes(css as ja.ICssPropertyOptions, sourceKeyframes);
    }

    const targetKeyframes: waapi.IKeyframe[] = [];
    
    unwrapPropertiesInKeyframes(sourceKeyframes, targetKeyframes);
    spaceKeyframes(targetKeyframes);
    
    if (options.isTransition === true) {
        addTransition(targetKeyframes, target);
    } else {
        fixPartialKeyframes(targetKeyframes);
    }

    const animator = target[animate](targetKeyframes, timings);
    animator.cancel();
    return animator;
}


function addTransition(keyframes: waapi.IKeyframe[], target: HTMLElement): void {
    // detect properties to transition
    const properties = listProps(keyframes);

    // get or create the first frame
    let firstFrame = head(keyframes, (t: ja.ICssKeyframeOptions) => t.offset === 0) as waapi.IKeyframe;
    if (!firstFrame) {
        firstFrame = { offset: 0 };
        keyframes.splice(0, 0, firstFrame);
    }

    // copy properties from the dom to the animation
    // todo: check how to do this in IE8, or not?
    const style = global.getComputedStyle(target);

    each(properties, (property: string) => {
        // skip offset property
        if (property === offsetString) {
            return;
        }
    
        const alias = transitionAliases[property] || property;
        const val = style[alias];
        if (isDefined(val)) {
            firstFrame[alias] = val;
        }
    });
}

/**
 * copies keyframs with an offset array to separate keyframes
 * 
 * @export
 * @param {waapi.IKeyframe[]} keyframes
 */
function expandOffsets(keyframes: ja.ICssKeyframeOptions[]): void {
    const len = keyframes.length;
    for (let i = len - 1; i > -1; --i) {
        const keyframe = keyframes[i];

        if (isArray(keyframe.offset)) {
            keyframes.splice(i, 1);            
            
            const offsets = keyframe.offset as number[];
            const offsetLen = offsets.length;
            for (let j = offsetLen - 1; j > -1; --j) {
                const offsetAmount = offsets[j];
                const newKeyframe: ja.ICssKeyframeOptions = {};
                for (let prop in keyframe) {
                    if (prop !== offsetString) {
                        newKeyframe[prop] = keyframe[prop];
                    }
                }
                newKeyframe.offset = offsetAmount;
                keyframes.splice(i, 0, newKeyframe);                
            }
        }
    }
}


function unwrapPropertiesInKeyframes(source: ja.ICssKeyframeOptions[], target: ja.ICssKeyframeOptions[]): void {
    const len = source.length;
    for (let i = 0; i < len; i++) {
        const sourceKeyframe = source[i];
        let targetKeyframe: waapi.IKeyframe = {};

        for (let propertyName in sourceKeyframe) {
            if (!sourceKeyframe.hasOwnProperty(propertyName)) {
                continue;
            }
            const sourceValue = sourceKeyframe[propertyName];
            if (!isDefined(sourceValue)) {
                continue;
            }
            targetKeyframe[propertyName] = unwrap(sourceValue);
        }
            
        normalizeProperties(targetKeyframe);
        target.push(targetKeyframe);
    }
}

function propsToKeyframes(css: ja.ICssPropertyOptions, keyframes: ja.ICssKeyframeOptions[]): void {
    // create a map to capture each keyframe by offset
    const keyframesByOffset: { [key: number]: ja.ICssKeyframeOptions } = {};
    const cssProps = css as ja.ICssPropertyOptions;

    // iterate over each property split it into keyframes            
    for (let prop in cssProps) {
        if (!cssProps.hasOwnProperty(prop)) {
            continue;
        }

        // unwrap value (changes function into discrete value or array)                    
        const val = unwrap(cssProps[prop]);

        if (isArray(val)) {
            // if the value is an array, split up the offset automatically
            const valAsArray = val as string[];
            const valLength = valAsArray.length;

            for (let i = 0; i < valLength; i++) {
                const offset = i === 0 ? 0 : i === valLength - 1 ? 1 : i / (valLength - 1.0);
                let keyframe = keyframesByOffset[offset];
                if (!keyframe) {
                    keyframe = {};
                    keyframesByOffset[offset] = keyframe;
                }
                keyframe[prop] = val[i];
            }
        } else {
            // if the value is not an array, place it at offset 1
            let keyframe = keyframesByOffset[1];
            if (!keyframe) {
                keyframe = {};
                keyframesByOffset[1] = keyframe;
            }
            keyframe[prop] = val;
        }
    }

    for (let offset in keyframesByOffset) {
        const keyframe = keyframesByOffset[offset];
        keyframe.offset = Number(offset);
        keyframes.push(keyframe);
    }
}


function spaceKeyframes(keyframes: waapi.IKeyframe[]): void {
    // don't attempt to fill animation if less than 2 keyframes
    if (keyframes.length < 2) {
        return;
    }

    const first = keyframes[0];
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }

    const last = keyframes[keyframes.length - 1];
    // ensure last offset
    if (last.offset !== 1) {
        last.offset = 1;
    }

    // explicitly set implicit offsets
    const len = keyframes.length;
    const lasti = len - 1;
    for (let i = 1; i < lasti; i++) {
        const target = keyframes[i];

        // skip entries that have an offset        
        if (isNumber(target.offset)) {
            continue;
        }

        // search for the next offset with a value        
        for (let j = i + 1; j < len; j++) {
            // pass if offset is not set
            if (!isNumber(keyframes[j].offset)) {
                continue;
            }

            // calculate timing/position info
            const startTime = keyframes[i - 1].offset as number;
            const endTime = keyframes[j].offset as number;
            const timeDelta = endTime - startTime;
            const deltaLength = j - i + 1;

            // set the values of all keyframes between i and j (exclusive)
            for (let k = 1; k < deltaLength; k++) {
                // set to percentage of change over time delta + starting time
                keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime;
            }

            // move i past this keyframe since all frames between should be processed
            i = j;
            break;
        }
    }
}

/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
function fixPartialKeyframes(keyframes: waapi.IKeyframe[]): void {
    // don't attempt to fill animation if less than 1 keyframes
    if (keyframes.length < 1) {
        return;
    }

    let first: waapi.IKeyframe =
        head(keyframes, (k: waapi.IKeyframe) => k.offset === 0)
        || head(keyframes, (k: waapi.IKeyframe) => k.offset === nil);
    
    if (first === nil) {
        first = {};
        keyframes.splice(0, 0, first);
    }   
    if (first.offset === nil) {
        first.offset = 0;
    }
    
    let last: waapi.IKeyframe =
        tail(keyframes, (k: waapi.IKeyframe) => k.offset === 1)
        || tail(keyframes, (k: waapi.IKeyframe) => k.offset === nil);
    
    if (last === nil) {
        last = {};
        keyframes.push(last);
    }  
    if (last.offset === nil) {
        last.offset = 0;
    }

    // fill initial keyframe with missing props
    const len = keyframes.length;
    for (let i = 1; i < len; i++) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop !== offsetString && !isDefined(first[prop])) {
                first[prop] = keyframe[prop];
            }
        }
    }

    // fill end keyframe with missing props
    for (let i = len - 2; i > -1; i--) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop !== offsetString && !isDefined(last[prop])) {
                last[prop] = keyframe[prop];
            }
        }
    }

    // sort by offset (should have all offsets assigned)
    keyframes.sort(keyframeOffsetComparer);    
}

function keyframeOffsetComparer(a: waapi.IKeyframe, b: waapi.IKeyframe): number {
    return (a.offset as number) - (b.offset as number);
}

/**
 * Handles transforming short hand key properties into their native form
 */
function normalizeProperties(keyframe: waapi.IKeyframe): void {
    const xIndex = 0;
    const yIndex = 1;
    const zIndex = 2;

    // transform properties
    const scaleArray: number[] = [];
    const skewArray: (number | string)[] = [];
    const translateArray: (number | string)[] = [];
    let cssTransform = '';

    for (let prop in keyframe) {
        const value = keyframe[prop];

        if (!isDefined(value)) {
            keyframe[prop] = nil;
            continue;
        }

        if (prop === easingString) {
            const easing = keyframe[easingString];
            keyframe[easingString] = easings[easing] || easing || nil;
            continue;
        }

        // nullify properties (will get added back if it is supposed to be here)
        keyframe[prop] = nil;  
        
        switch (prop) {
            case scale3d:
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 3) {
                        throw invalidArg(scale3d);
                    }
                    scaleArray[xIndex] = arr[xIndex];
                    scaleArray[yIndex] = arr[yIndex];
                    scaleArray[zIndex] = arr[zIndex];
                    continue;
                }
                if (isNumber(value)) {
                    scaleArray[xIndex] = value;
                    scaleArray[yIndex] = value;
                    scaleArray[zIndex] = value;
                    continue;
                }
                throw invalidArg(scale3d);
            case scale:
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 2) {
                        throw invalidArg(scale);
                    }
                    scaleArray[xIndex] = arr[xIndex];
                    scaleArray[yIndex] = arr[yIndex];
                    continue;
                }
                if (isNumber(value)) {
                    scaleArray[xIndex] = value;
                    scaleArray[yIndex] = value;
                    continue;
                }
                throw invalidArg(scale);
            case scaleX:
                if (isNumber(value)) {
                    scaleArray[xIndex] = value;
                    continue;
                }
                throw invalidArg(scaleX);
            case scaleY:
                if (isNumber(value)) {
                    scaleArray[yIndex] = value;
                    continue;
                }
                throw invalidArg(scaleY);
            case scaleZ:
                if (isNumber(value)) {
                    scaleArray[zIndex] = value;
                    continue;
                }
                throw invalidArg(scaleZ);
            case skew:
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 2) {
                        throw invalidArg(skew);
                    }
                    skewArray[xIndex] = arr[xIndex];
                    skewArray[yIndex] = arr[yIndex];
                    continue;
                }
                if (isNumber(value)) {
                    skewArray[xIndex] = value;
                    skewArray[yIndex] = value;
                    continue;
                }
                throw invalidArg(skew);
            case skewX:
                if (isString(value)) {
                    skewArray[xIndex] = value;
                    continue;
                }
                throw invalidArg(skewX);
            case skewY:
                if (isString(value)) {
                    skewArray[yIndex] = value;
                    continue;
                }
                throw invalidArg(skewY);
            case rotate3d:
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 4) {
                        throw invalidArg(rotate3d);
                    }
                    cssTransform += ` rotate3d(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`;
                    continue;
                }
                throw invalidArg(rotate3d);
            case rotateX:
                if (isString(value)) {
                    cssTransform += ` rotate3d(1, 0, 0, ${value})`;
                    continue;
                }
                throw invalidArg(rotateX);
            case rotateY:
                if (isString(value)) {
                    cssTransform += ` rotate3d(0, 1, 0, ${value})`;
                    continue;
                }
                throw invalidArg(rotateY);
            case rotate:
            case rotateZ:
                if (isString(value)) {
                    cssTransform += ` rotate3d(0, 0, 1, ${value})`;
                    continue;
                }
                throw invalidArg(rotateZ);
            case translate3d:
                if (isArray(value)) {
                    const arr = value as (number | string)[];
                    if (arr.length !== 3) {
                        throw invalidArg(translate3d);
                    }
                    translateArray[xIndex] = arr[xIndex];
                    translateArray[yIndex] = arr[yIndex];
                    translateArray[zIndex] = arr[zIndex];
                    continue;
                }
                if (isString(value) || isNumber(value)) {
                    translateArray[xIndex] = value;
                    translateArray[yIndex] = value;
                    translateArray[zIndex] = value;
                    continue;
                }
                throw invalidArg(rotate3d);
            case translate:
                if (isArray(value)) {
                    const arr = value as (number | string)[];
                    if (arr.length !== 2) {
                        throw invalidArg(translate);
                    }
                    translateArray[xIndex] = arr[xIndex];
                    translateArray[yIndex] = arr[yIndex];
                    continue;
                }
                if (isString(value) || isNumber(value)) {
                    translateArray[xIndex] = value;
                    translateArray[yIndex] = value;
                    continue;
                }
                throw invalidArg(translate);
            case x:
            case translateX:
                if (isString(value) || isNumber(value)) {
                    translateArray[xIndex] = value;
                    continue;
                }
                throw invalidArg(x);
            case y:
            case translateY:
                if (isString(value) || isNumber(value)) {
                    translateArray[yIndex] = value;
                    continue;
                }
                throw invalidArg(y);
            case z:
            case translateZ:
                if (isString(value) || isNumber(value)) {
                    translateArray[zIndex] = value;
                    continue;
                }
                throw invalidArg(z);
            case transform:
                cssTransform += ' ' + value;
                break;
            default:
                keyframe[toCamelCase(prop)] = value;
                break;
        }
    }

    // combine scale
    const isScaleX = scaleArray[xIndex] !== nil;
    const isScaleY = scaleArray[yIndex] !== nil;
    const isScaleZ = scaleArray[zIndex] !== nil;
    if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
        const scaleString = scaleArray.map((s: number) => s || '1').join(',');
        cssTransform += ` scale3d(${scaleString})`;
    } else if (isScaleX && isScaleY) {
        cssTransform += ` scale(${scaleArray[xIndex] || 1}, ${scaleArray[yIndex] || 1})`;
    } else if (isScaleX) {
        cssTransform += ` scaleX(${scaleArray[xIndex]})`;
    } else if (isScaleY) {
        cssTransform += ` scaleX(${scaleArray[yIndex]})`;
    } else if (isScaleZ) {
        cssTransform += ` scaleX(${scaleArray[zIndex]})`;
    } else {
        // do nil
    }

    // combine skew
    const isskewX = skewArray[xIndex] !== nil;
    const isskewY = skewArray[yIndex] !== nil;
    if (isskewX && isskewY) {
        cssTransform += ` skew(${skewArray[xIndex] || 1}, ${skewArray[yIndex] || 1})`;
    } else if (isskewX) {
        cssTransform += ` skewX(${skewArray[xIndex]})`;
    } else if (isskewY) {
        cssTransform += ` skewY(${skewArray[yIndex]})`;
    } else {
        // do nil
    }

    // combine translate
    const istranslateX = translateArray[xIndex] !== nil;
    const istranslateY = translateArray[yIndex] !== nil;
    const istranslateZ = translateArray[zIndex] !== nil;
    if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
        const translateString = translateArray.map((s: string) => s || '1').join(',');
        cssTransform += ` translate3d(${translateString})`;
    } else if (istranslateX && istranslateY) {
        cssTransform += ` translate(${translateArray[xIndex] || 1}, ${translateArray[yIndex] || 1})`;
    } else if (istranslateX) {
        cssTransform += ` translateX(${translateArray[xIndex]})`;
    } else if (istranslateY) {
        cssTransform += ` translateY(${translateArray[yIndex]})`;
    } else if (istranslateZ) {
        cssTransform += ` translateZ(${translateArray[zIndex]})`;
    } else {
        // do nil
    }

    if (cssTransform) {
        keyframe[transform] = cssTransform;
    }
}

