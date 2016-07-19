import { map } from '../helpers/lists';
import { extend } from '../helpers/objects';
import { toCamelCase } from '../helpers/strings';
import { isDefined, isNumber, isString, isArray } from '../helpers/type';

const x = 0;
const y = 1;
const z = 2;

/**
 * Handles converting animations options to a usable format
 */
export function animationTransformer(a: ja.IAnimationOptions): ja.IAnimationOptions {
    const keyframes = map(a.keyframes, keyframeTransformer);
    return {
        keyframes: normalizeKeyframes(keyframes),
        name: a.name,
        timings: extend({}, a.timings)
    };
}

/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
export function normalizeKeyframes(keyframes: ja.IKeyframeOptions[]): ja.IKeyframeOptions[] {
    const len = keyframes.length;

    // don't attempt to fill animation if less than 2 keyframes
    if (len < 2) {
        return keyframes;
    }

    const first = keyframes[0];
    // ensure first offset    
    if (first.offset !== 0) {
        first.offset = 0;
    }

    const last = keyframes[len - 1];    
    // ensure last offset
    if (last.offset !== 1) {
        last.offset = 1;
    }

    // explicitly set implicit offsets
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

    // fill initial keyframe with missing props
    for (let i = 1; i < len; i++) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop === 'offset' || isDefined(first[prop])) {
                continue;
            }
            first[prop] = keyframe[prop];
        }
    }

    // fill end keyframe with missing props
    for (let i = len - 2; i > -1; i--) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop === 'offset' || isDefined(last[prop])) {
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
export function keyframeTransformer(keyframe: ja.IKeyframeOptions): ja.IKeyframeOptions {
    // transform properties
    const scale = new Array<number>(3);
    const skew = new Array<string | number>(2);
    const translate = new Array<string | number>(3);

    const output: ja.IMap<any> = {};
    let transform = '';

    for (let prop in keyframe) {
        const value = keyframe[prop];

        if (!isDefined(value)) {
            continue;
        }

        switch (prop) {
            case 'scale3d':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 3) {
                        throw Error('scale3d requires x, y, & z');
                    }
                    scale[x] = arr[x];
                    scale[y] = arr[y];
                    scale[z] = arr[z];
                    continue;
                }
                if (isNumber(value)) {
                    scale[x] = value;
                    scale[y] = value;
                    scale[z] = value;
                    continue;
                }
                throw Error('scale3d requires a number or number[]');
            case 'scale':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 2) {
                        throw Error('scale requires x & y');
                    }
                    scale[x] = arr[x];
                    scale[y] = arr[y];
                    continue;
                }
                if (isNumber(value)) {
                    scale[x] = value;
                    scale[y] = value;
                    continue;
                }
                throw Error('scale requires a number or number[]');
            case 'scaleX':
                if (isNumber(value)) {
                    scale[x] = value;
                    continue;
                }
                throw Error('scaleX requires a number');
            case 'scaleY':
                if (isNumber(value)) {
                    scale[y] = value;
                    continue;
                }
                throw Error('scaleY requires a number');
            case 'scaleZ':
                if (isNumber(value)) {
                    scale[z] = value;
                    continue;
                }
                throw Error('scaleZ requires a number');
            case 'skew':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 2) {
                        throw Error('skew requires x & y');
                    }
                    skew[x] = arr[x];
                    skew[y] = arr[y];
                    continue;
                }
                if (isNumber(value)) {
                    skew[x] = value;
                    skew[y] = value;
                    continue;
                }
                throw Error('skew requires a number, string, string[], or number[]');
            case 'skewX':
                if (isString(value)) {
                    skew[x] = value;
                    continue;
                }
                throw Error('skewX requires a number or string');
            case 'skewY':
                if (isString(value)) {
                    skew[y] = value;
                    continue;
                }
                throw Error('skewY requires a number or string');
            case 'rotate3d':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 4) {
                        throw Error('rotate3d requires x, y, z, & a');
                    }
                    transform += ` rotate3d(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`;
                    continue;
                }
                throw Error('rotate3d requires an []');
            case 'rotateX':
                if (isString(value)) {
                    transform += ` rotate3d(1, 0, 0, ${value})`;
                    continue;
                }
                throw Error('rotateX requires a string');
            case 'rotateY':
                if (isString(value)) {
                    transform += ` rotate3d(0, 1, 0, ${value})`;
                    continue;
                }
                throw Error('rotateY requires a string');
            case 'rotate':
            case 'rotateZ':
                if (isString(value)) {
                    transform += ` rotate3d(0, 0, 1, ${value})`;
                    continue;
                }
                throw Error('rotateZ requires a string');
            case 'translate3d':
                if (isArray(value)) {
                    const arr = value as (number | string)[];
                    if (arr.length !== 3) {
                        throw Error('translate3d requires x, y, & z');
                    }
                    translate[x] = arr[x];
                    translate[y] = arr[y];
                    translate[z] = arr[z];
                    continue;
                }
                if (isString(value) || isNumber(value)) {
                    translate[x] = value;
                    translate[y] = value;
                    translate[z] = value;
                    continue;
                }
                throw Error('translate3d requires a number, string, string[], or number[]');
            case 'translate':
                if (isArray(value)) {
                    const arr = value as (number | string)[];
                    if (arr.length !== 2) {
                        throw Error('translate requires x & y');
                    }
                    translate[x] = arr[x];
                    translate[y] = arr[y];
                    continue;
                }
                if (isString(value) || isNumber(value)) {
                    translate[x] = value;
                    translate[y] = value;
                    continue;
                }
                throw Error('translate requires a number, string, string[], or number[]');
            case 'x':
            case 'translateX':
                if (isString(value) || isNumber(value)) {
                    translate[x] = value;
                    continue;
                }
                throw Error('translateX requires a number or string');
            case 'y':
            case 'translateY':
                if (isString(value) || isNumber(value)) {
                    translate[y] = value;
                    continue;
                }
                throw Error('translateY requires a number or string');
            case 'z':
            case 'translateZ':
                if (isString(value) || isNumber(value)) {
                    translate[z] = value;
                    continue;
                }
                throw Error('translateZ requires a number or string');
            case 'transform':
                transform += ' ' + value;
                break;
            default:
                const prop2 = toCamelCase(prop);
                output[prop2] = value;
                break;
        }
    }

    // combine scale
    const isScaleX = scale[x] !== undefined;
    const isScaleY = scale[y] !== undefined;
    const isScaleZ = scale[z] !== undefined;
    if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
        const scaleString = scale.map((s: number) => s || '1').join(',');
        transform += ` scale3d(${scaleString})`;
    } else if (isScaleX && isScaleY) {
        transform += ` scale(${scale[x] || 1}, ${scale[y] || 1})`;
    } else if (isScaleX) {
        transform += ` scaleX(${scale[x]})`;
    } else if (isScaleY) {
        transform += ` scaleX(${scale[y]})`;
    } else if (isScaleZ) {
        transform += ` scaleX(${scale[z]})`;
    } else {
        // do nothing
    }

    // combine skew
    const isskewX = skew[x] !== undefined;
    const isskewY = skew[y] !== undefined;
    if (isskewX && isskewY) {
        transform += ` skew(${skew[x] || 1}, ${skew[y] || 1})`;
    } else if (isskewX) {
        transform += ` skewX(${skew[x]})`;
    } else if (isskewY) {
        transform += ` skewY(${skew[y]})`;
    } else {
        // do nothing
    }

    // combine translate
    const istranslateX = translate[x] !== undefined;
    const istranslateY = translate[y] !== undefined;
    const istranslateZ = translate[z] !== undefined;
    if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
        const translateString = translate.map((s: string) => s || '1').join(',');
        transform += ` translate3d(${translateString})`;
    } else if (istranslateX && istranslateY) {
        transform += ` translate(${translate[x] || 1}, ${translate[y] || 1})`;
    } else if (istranslateX) {
        transform += ` translateX(${translate[x]})`;
    } else if (istranslateY) {
        transform += ` translateY(${translate[y]})`;
    } else if (istranslateZ) {
        transform += ` translateZ(${translate[z]})`;
    } else {
        // do nothing
    }

    if (transform) {
        output['transform'] = transform;
    }

    return output;
}
