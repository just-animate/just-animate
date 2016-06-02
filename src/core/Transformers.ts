import { isNumber, isString, isArray, map, extend } from './Helpers';

function replaceCamelCased(match: string, p1: string, p2: string): string {
    return p1 + p2.toUpperCase();
}

/**
 * Handles converting animations options to a usable format
 */
export function animationTransformer(a: ja.IAnimationOptions): ja.IAnimationOptions {
    return {
        keyframes: map(a.keyframes, keyframeTransformer),
        name: a.name,
        timings: extend({}, a.timings)
    };   
}

/**
 * Handles transforming short hand key properties into their native form
 */
export function keyframeTransformer(keyframe: ja.IKeyframe): ja.IKeyframe {
    const x = 0;
    const y = 1;
    const z = 2;

    // transform properties
    const scale = new Array<number>(3);
    const skew = new Array<string | number>(2);
    const translate = new Array<string | number>(3);
    
    const output: ja.IMap<any> = {};
    let transform = '';
 
    for (let prop in keyframe) {
        const value = keyframe[prop];
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
            case 'skew3d':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length !== 3) {
                        throw Error('skew3d requires x, y, & z');
                    }
                    skew[x] = arr[x];
                    skew[y] = arr[y];
                    skew[z] = arr[z];
                    continue;
                }
                if (isNumber(value)) {
                    skew[x] = value;
                    skew[y] = value;
                    skew[z] = value;
                    continue;
                }
                throw Error('skew3d requires a number, string, string[], or number[]');
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
                if (isNumber(value)) {
                    skew[x] = value;
                    continue;
                }
                throw Error('skewX requires a number or string');
            case 'skewY':
                if (isNumber(value)) {
                    skew[y] = value;
                    continue;
                }
                throw Error('skewY requires a number or string');
            case 'skewZ':
                if (isNumber(value)) {
                    skew[z] = value;
                    continue;
                }
                throw Error('skewZ requires a number or string');
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
                    const arr = value as (number|string)[];
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
                    const arr = value as (number|string)[];
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
            case 'translateX':
                if (isString(value) || isNumber(value)) {
                    translate[x] = value;
                    continue;
                }
                throw Error('translateX requires a number or string');
            case 'translateY':
                if (isString(value) || isNumber(value)) {
                    translate[y] = value;
                    continue;
                }
                throw Error('translateY requires a number or string');
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
                const prop2 = prop.replace(/([a-z])-([a-z])/ig, replaceCamelCased);
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
        transform += ` skewX(${skew[y]})`;
    }  else {
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
        transform += ` translateX(${translate[y]})`;
    } else if (istranslateZ) {
        transform += ` translateX(${translate[z]})`;
    } else {
        // do nothing
    }

    if (transform) {
        output['transform'] = transform;
    }

    return output;
}
