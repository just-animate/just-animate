import {isDefined, isNumber, isString, isArray} from '../helpers/type';
import {toCamelCase} from '../helpers/strings';
import {invalidArg} from '../helpers/errors';

import {scale3d,
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
    translateX,
    translateY,
    translateZ,
    transform
} from './resources';


const offset = 'offset';

export function spaceKeyframes(keyframes: ja.IKeyframeOptions[]): ja.IKeyframeOptions[] {
    // don't attempt to fill animation if less than 2 keyframes
    if (keyframes.length < 2) {
        return keyframes;
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
            const startTime = keyframes[i - 1].offset;
            const endTime = keyframes[j].offset;
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

    return keyframes;
}

/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
export function normalizeKeyframes(keyframes: ja.IKeyframeOptions[]): ja.IKeyframeOptions[] {
    // don't attempt to fill animation if less than 2 keyframes
    if (keyframes.length < 2) {
        return keyframes;
    }

    const first = keyframes[0];
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }

    const last = keyframes[keyframes.length - 1];

    // fill initial keyframe with missing props
    const len = keyframes.length;
    for (let i = 1; i < len; i++) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop === offset || isDefined(first[prop])) {
                continue;
            }
            first[prop] = keyframe[prop];
        }
    }

    // fill end keyframe with missing props
    for (let i = len - 2; i > -1; i--) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop === offset || isDefined(last[prop])) {
                continue;
            }
            last[prop] = keyframe[prop];
        }
    }

    return keyframes;
}

/**
 * Handles transforming short hand key properties into their native form
 */
export function normalizeProperties(keyframe: ja.IKeyframeOptions): ja.IKeyframeOptions {
    const xIndex = 0;
    const yIndex = 1;
    const zIndex = 2;

    // transform properties
    const scaleArray: number[] = [];
    const skewArray: (number | string)[] = [];
    const translateArray: (number | string)[] = [];

    const output: ja.IMap<any> = {};
    let transformString = '';

    for (let prop in keyframe) {
        const value = keyframe[prop];

        if (!isDefined(value)) {
            continue;
        }

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
                    transformString += ` rotate3d(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`;
                    continue;
                }
                throw invalidArg(rotate3d);
            case rotateX:
                if (isString(value)) {
                    transformString += ` rotate3d(1, 0, 0, ${value})`;
                    continue;
                }
                throw invalidArg(rotateX);
            case rotateY:
                if (isString(value)) {
                    transformString += ` rotate3d(0, 1, 0, ${value})`;
                    continue;
                }
                throw invalidArg(rotateY);
            case rotate:
            case rotateZ:
                if (isString(value)) {
                    transformString += ` rotate3d(0, 0, 1, ${value})`;
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
                transformString += ' ' + value;
                break;
            default:
                output[toCamelCase(prop)] = value;
                break;
        }
    }

    // combine scale
    const isScaleX = scaleArray[xIndex] !== undefined;
    const isScaleY = scaleArray[yIndex] !== undefined;
    const isScaleZ = scaleArray[zIndex] !== undefined;
    if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
        const scaleString = scaleArray.map((s: number) => s || '1').join(',');
        transformString += ` scale3d(${scaleString})`;
    } else if (isScaleX && isScaleY) {
        transformString += ` scale(${scaleArray[xIndex] || 1}, ${scaleArray[yIndex] || 1})`;
    } else if (isScaleX) {
        transformString += ` scaleX(${scaleArray[xIndex]})`;
    } else if (isScaleY) {
        transformString += ` scaleX(${scaleArray[yIndex]})`;
    } else if (isScaleZ) {
        transformString += ` scaleX(${scaleArray[zIndex]})`;
    } else {
        // do nothing
    }

    // combine skew
    const isskewX = skewArray[xIndex] !== undefined;
    const isskewY = skewArray[yIndex] !== undefined;
    if (isskewX && isskewY) {
        transformString += ` skew(${skewArray[xIndex] || 1}, ${skewArray[yIndex] || 1})`;
    } else if (isskewX) {
        transformString += ` skewX(${skewArray[xIndex]})`;
    } else if (isskewY) {
        transformString += ` skewY(${skewArray[yIndex]})`;
    } else {
        // do nothing
    }

    // combine translate
    const istranslateX = translateArray[xIndex] !== undefined;
    const istranslateY = translateArray[yIndex] !== undefined;
    const istranslateZ = translateArray[zIndex] !== undefined;
    if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
        const translateString = translateArray.map((s: string) => s || '1').join(',');
        transformString += ` translate3d(${translateString})`;
    } else if (istranslateX && istranslateY) {
        transformString += ` translate(${translateArray[xIndex] || 1}, ${translateArray[yIndex] || 1})`;
    } else if (istranslateX) {
        transformString += ` translateX(${translateArray[xIndex]})`;
    } else if (istranslateY) {
        transformString += ` translateY(${translateArray[yIndex]})`;
    } else if (istranslateZ) {
        transformString += ` translateZ(${translateArray[zIndex]})`;
    } else {
        // do nothing
    }

    if (transformString) {
        output['transform'] = transformString;
    }

    return output;
}

