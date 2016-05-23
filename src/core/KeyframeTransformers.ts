import { isNumber, isString, isArray } from './Helpers';

/**
 * Handles transforming short hand key properties into their native form
 */
export function keyframeTransformer(keyframe: ja.IKeyframe): ja.IKeyframe {
    const x = 0;
    const y = 1;
    const z = 2;

    // transform properties
    const scale = new Array<number>(3);
    const skew = new Array<string | number>(3);
    const rotate = new Array<number>(3);
    const translate = new Array<string | number>(3);

    const output: ja.IKeyframe = {};

    for (let prop in keyframe) {
        const value = keyframe[prop];
        switch (prop) {
            case 'scale3d':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length != 3) {
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
                    if (arr.length != 2) {
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
                    if (arr.length != 3) {
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
                    if (arr.length != 2) {
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
                    if (arr.length != 3) {
                        throw Error('rotate3d requires x, y, & z');
                    }
                    rotate[x] = arr[x];
                    rotate[y] = arr[y];
                    rotate[z] = arr[z];
                    continue;
                }
                if (isNumber(value)) {
                    rotate[x] = value;
                    rotate[y] = value;
                    rotate[z] = value;
                    continue;
                }
                throw Error('rotate3d requires a number or number[]');
            case 'rotate':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length != 2) {
                        throw Error('rotate requires x & y');
                    }
                    rotate[x] = arr[x];
                    rotate[y] = arr[y];
                    continue;
                }
                if (isNumber(value)) {
                    rotate[x] = value;
                    rotate[y] = value;
                    continue;
                }
                throw Error('rotate requires a number or number[]');
            case 'rotateX':
                if (isNumber(value)) {
                    rotate[x] = value;
                    continue;
                }
                throw Error('rotateX requires a number');
            case 'rotateY':
                if (isNumber(value)) {
                    rotate[y] = value;
                    continue;
                }
                throw Error('rotateY requires a number');
            case 'rotateZ':
                if (isNumber(value)) {
                    rotate[z] = value;
                    continue;
                }
                throw Error('rotateZ requires a number');
            case 'translate3d':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length != 3) {
                        throw Error('translate3d requires x, y, & z');
                    }
                    translate[x] = arr[x];
                    translate[y] = arr[y];
                    translate[z] = arr[z];
                    continue;
                }
                if (isNumber(value)) {
                    translate[x] = value;
                    translate[y] = value;
                    translate[z] = value;
                    continue;
                }
                throw Error('translate3d requires a number, string, string[], or number[]');
            case 'translate':
                if (isArray(value)) {
                    const arr = value as number[];
                    if (arr.length != 2) {
                        throw Error('translate requires x & y');
                    }
                    translate[x] = arr[x];
                    translate[y] = arr[y];
                    continue;
                }
                if (isNumber(value)) {
                    translate[x] = value;
                    translate[y] = value;
                    continue;
                }
                throw Error('translate requires a number, string, string[], or number[]');
            case 'translateX':
                if (isNumber(value)) {
                    translate[x] = value;
                    continue;
                }
                throw Error('translateX requires a number or string');
            case 'translateY':
                if (isNumber(value)) {
                    translate[y] = value;
                    continue;
                }
                throw Error('translateY requires a number or string');
            case 'translateZ':
                if (isNumber(value)) {
                    translate[z] = value;
                    continue;
                }
                throw Error('translateZ requires a number or string');
            default:
                output[prop] = value;
                break;
        }
    }

    let transform = '';

    // combine scale
    const isScaleX = scale[x] !== undefined;
    const isScaleY = scale[y] !== undefined;
    const isScaleZ = scale[z] !== undefined;
    if (isScaleX && isScaleZ || isScaleY && isScaleZ) {
        const scaleString = scale.map(s => s || '1').join(',');
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
    const isskewZ = skew[z] !== undefined;
    if (isskewX && isskewZ || isskewY && isskewZ) {
        const skewString = skew.map(s => s || '1').join(',');
        transform += ` skew3d(${skewString})`;
    } else if (isskewX && isskewY) {
        transform += ` skew(${skew[x] || 1}, ${skew[y] || 1})`;
    } else if (isskewX) {
        transform += ` skewX(${skew[x]})`;
    } else if (isskewY) {
        transform += ` skewX(${skew[y]})`;
    } else if (isskewZ) {
        transform += ` skewX(${skew[z]})`;
    } else {
        // do nothing
    }

    // combine rotate
    const isrotateX = rotate[x] !== undefined;
    const isrotateY = rotate[y] !== undefined;
    const isrotateZ = rotate[z] !== undefined;
    if (isrotateX && isrotateZ || isrotateY && isrotateZ) {
        const rotateString = rotate.map(s => s || '1').join(',');
        transform += ` rotate3d(${rotateString})`;
    } else if (isrotateX && isrotateY) {
        transform += ` rotate(${rotate[x] || 1}, ${rotate[y] || 1})`;
    } else if (isrotateX) {
        transform += ` rotateX(${rotate[x]})`;
    } else if (isrotateY) {
        transform += ` rotateX(${rotate[y]})`;
    } else if (isrotateZ) {
        transform += ` rotateX(${rotate[z]})`;
    } else {
        // do nothing
    }

    // combine translate
    const istranslateX = translate[x] !== undefined;
    const istranslateY = translate[y] !== undefined;
    const istranslateZ = translate[z] !== undefined;
    if (istranslateX && istranslateZ || istranslateY && istranslateZ) {
        const translateString = translate.map(s => s || '1').join(',');
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
        output.transform = transform;
    }

    return output;
}
