import { isDefined, isNumber, isArray } from '../../common/type';
import { toCamelCase } from '../../common/strings';
import { getEasingString } from '../core/easings';
import { head, tail } from '../../common/lists';
import { parseUnit } from '../../common/units';
import { listProps, resolve, deepCopyObject } from '../../common/objects';
import { unsupported } from '../../common/errors';
import * as waapi from './waapi';

const propertyAliases = {
    x: 'translateX',
    y: 'translateY',
    z: 'translateZ'
};

const transforms = [
    'perspective',
    'matrix',
    'translateX',
    'translateY',
    'translateZ',
    'translate',
    'translate3d',
    'x',
    'y',
    'z',
    'skew',
    'skewX',
    'skewY',
    'rotateX',
    'rotateY',
    'rotateZ',
    'rotate',
    'rotate3d',
    'scaleX',
    'scaleY',
    'scaleZ',
    'scale',
    'scale3d'
];

export function initAnimator(timings: waapi.EffectTiming, ctx: ja.AnimationTargetContext<Element>): waapi.Animation {
    // process css as either keyframes or calculate what those keyframes should be   
    const options = ctx.options!;
    const target = ctx.target as HTMLElement;
    const css = options.css;

    let sourceKeyframes: ja.CssKeyframeOptions[];
    if (isArray(css)) {
        // if an array, no processing has to occur
        sourceKeyframes = css as ja.CssKeyframeOptions[];
        expandOffsets(sourceKeyframes);
    } else {
        sourceKeyframes = [];
        propsToKeyframes(css as ja.CssPropertyOptions, sourceKeyframes, ctx);
    }

    const targetKeyframes: waapi.Keyframe[] = [];

    resolvePropertiesInKeyframes(sourceKeyframes, targetKeyframes, ctx);

    if (options.isTransition === true) {
        addTransition(targetKeyframes, target);
    }

    spaceKeyframes(targetKeyframes);
    arrangeKeyframes(targetKeyframes);
    fixPartialKeyframes(targetKeyframes);

    const animator = target['animate'](targetKeyframes, timings);
    animator.cancel();
    return animator;
}


export function addTransition(keyframes: waapi.Keyframe[], target: HTMLElement): void {
    // detect properties to transition
    const properties = listProps(keyframes);

    // copy properties from the dom to the animation
    // todo: check how to do this in IE8, or not?
    const style = window.getComputedStyle(target);

    // create the first frame
    const firstFrame: waapi.Keyframe = { offset: 0 };
    keyframes.splice(0, 0, firstFrame);

    properties.forEach((property: string) => {
        // skip offset property
        if (property === 'offset') {
            return;
        }

        const alias = transforms.indexOf(property) !== -1 ? 'transform' : property;
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
export function expandOffsets(keyframes: ja.CssKeyframeOptions[]): void {
    const len = keyframes.length;
    for (let i = len - 1; i > -1; --i) {
        const keyframe = keyframes[i];

        if (!isArray(keyframe.offset)) {
            continue;
        }

        keyframes.splice(i, 1);

        const offsets = keyframe.offset as number[];
        const offsetLen = offsets.length;

        for (let j = 0; j < offsetLen; j++) {
            const newKeyframe = deepCopyObject(keyframe);
            newKeyframe.offset = offsets[j];
            keyframes.splice(i, 0, newKeyframe);
        }
    }
    
    // resort by offset    
    keyframes.sort(keyframeOffsetComparer);
}

/**
 * This calls all keyframe properties that are functions and sets their values
 */
export function resolvePropertiesInKeyframes(source: ja.CssKeyframeOptions[], target: ja.CssKeyframeOptions[], ctx: ja.AnimationTargetContext<Element>): void {
    const len = source.length;
    for (let i = 0; i < len; i++) {
        const sourceKeyframe = source[i];
        let targetKeyframe: waapi.Keyframe = {};

        for (let propertyName in sourceKeyframe) {
            if (!sourceKeyframe.hasOwnProperty(propertyName)) {
                continue;
            }
            const sourceValue = sourceKeyframe[propertyName];
            if (!isDefined(sourceValue)) {
                continue;
            }
            targetKeyframe[propertyName] = resolve(sourceValue, ctx);
        }

        normalizeProperties(targetKeyframe);
        target.push(targetKeyframe);
    }
}

export function propsToKeyframes(css: ja.CssPropertyOptions, keyframes: ja.CssKeyframeOptions[], ctx: ja.AnimationTargetContext<Element>): void {
    // create a map to capture each keyframe by offset
    const keyframesByOffset: { [key: number]: ja.CssKeyframeOptions } = {};
    const cssProps = css as ja.CssPropertyOptions;

    // iterate over each property split it into keyframes            
    for (let prop in cssProps) {
        if (!cssProps.hasOwnProperty(prop)) {
            continue;
        }

        // resolve value (changes function into discrete value or array)                    
        const val = resolve(cssProps[prop], ctx);

        if (isArray(val)) {
            // if the value is an array, split up the offset automatically
            const valAsArray = val as string[];
            const valLength = valAsArray.length;

            for (let i = 0; i < valLength; i++) {
                const offset = i === 0 ? 0
                    : i === valLength - 1 ? 1
                        : i / (valLength - 1.0);
                
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

    // get list of transform properties in object
    const includedTransforms: string[] = Object
        .keys(cssProps)
        .filter((c: string) => transforms.indexOf(c) !== -1);

    const offsets = Object
        .keys(keyframesByOffset)
        .map((s: ja.CssKeyframeOptions) => Number(s))
        .sort();

    // if prop not present calculate each transform property in list
    // a keyframe at offset 1 should be guaranteed for each property, so skip that one
    for (let i = offsets.length - 2; i > -1; --i) {
        const offset = offsets[i];
        const keyframe = keyframesByOffset[offset];
        
        // foreach keyframe if has transform property
        for (let transform of includedTransforms) {
            if (isDefined(keyframe[transform])) {
                continue;
            }
            // get the next keyframe (should always be one ahead with a good value)
            const endOffset = offsets[i + 1];
            const endKeyframe = keyframesByOffset[endOffset];

            // parse out unit values of next keyframe       
            const envValueUnit = parseUnit(endKeyframe[transform]);
            const endValue = envValueUnit.value;
            const endUnitType = envValueUnit.unit;

            // search downward for the previous value or use defaults  
            let startIndex = 0;
            let startValue = endValue;
            let startOffset = 0;
            let startUnit = undefined as string | undefined;

            for (let j = i - 1; j > -1; --j) {
                const offset1 = offsets[j];
                const keyframe1 = keyframesByOffset[offset1];
                if (isDefined(keyframe1[transform])) {

                    const startValueUnit = parseUnit(keyframe1[transform]);
                    startValue = startValueUnit.value;
                    startUnit = startValueUnit.unit;
                    startIndex = j;
                    startOffset = offsets[j]; 
                    break;
                }
            }

            if (startValue !== 0 && isDefined(startUnit) && isDefined(endUnitType) && startUnit !== endUnitType) {
                throw unsupported('Mixed transform property units');
            }
      
            // iterate forward
            for (let j = startIndex; j < i + 1; j++) {
                const currentOffset = offsets[j];
                const currentKeyframe = keyframesByOffset[currentOffset];

                // calculate offset delta (how much animation progress to apply)
                const offsetDelta = (currentOffset - startOffset) / (endOffset - startOffset);
                const currentValue = startValue + (endValue - startValue) * offsetDelta;
                const currentValueWithUnit = isDefined(endUnitType)
                    ? currentValue + endUnitType
                    : isDefined(startUnit)
                        ? currentValue + startUnit
                        : currentValue;

                currentKeyframe[transform] = currentValueWithUnit;

                // move reference point forward
                startOffset = currentOffset;
                startValue = currentValue;
            }
        }
    }

    // reassemble as array
    for (let offset in keyframesByOffset) {
        const keyframe = keyframesByOffset[offset];
        keyframe.offset = Number(offset);
        keyframes.push(keyframe);
    }

    // resort by offset    
    keyframes.sort(keyframeOffsetComparer);
}


export function spaceKeyframes(keyframes: waapi.Keyframe[]): void {
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

export function arrangeKeyframes(keyframes: waapi.Keyframe[]): void {
    // don't arrange frames if there aren't any
    if (keyframes.length < 1) {
        return;
    }

    let first: waapi.Keyframe | undefined =
        head(keyframes, (k: waapi.Keyframe) => k.offset === 0)
        || head(keyframes, (k: waapi.Keyframe) => k.offset === undefined);

    if (first === undefined) {
        first = {};
        keyframes.splice(0, 0, first);
    }
    if (first.offset !== 0) {
        first.offset = 0;
    }

    let last: waapi.Keyframe | undefined =
        tail(keyframes, (k: waapi.Keyframe) => k.offset === 1)
        || tail(keyframes, (k: waapi.Keyframe) => k.offset === undefined);

    if (last === undefined) {
        last = {};
        keyframes.push(last);
    }
    if (last.offset !== 1) {
        last.offset = 0;
    }

    // sort by offset (should have all offsets assigned)
    keyframes.sort(keyframeOffsetComparer);
}

/**
 * If a property is missing at the start or end keyframe, the first or last instance of it is moved to the end.
 */
export function fixPartialKeyframes(keyframes: waapi.Keyframe[]): void {
    // don't attempt to fill animation if less than 1 keyframes
    if (keyframes.length < 1) {
        return;
    }

    const first = head(keyframes)!;
    const last = tail(keyframes)!;

    // fill initial keyframe with missing props
    const len = keyframes.length;
    for (let i = 1; i < len; i++) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop !== 'offset' && !isDefined(first[prop])) {
                first[prop] = keyframe[prop];
            }
        }
    }

    // fill end keyframe with missing props
    for (let i = len - 2; i > -1; i--) {
        const keyframe = keyframes[i];
        for (let prop in keyframe) {
            if (prop !== 'offset' && !isDefined(last[prop])) {
                last[prop] = keyframe[prop];
            }
        }
    }
}

export function keyframeOffsetComparer(a: waapi.Keyframe, b: waapi.Keyframe): number {
    return (a.offset as number) - (b.offset as number);
}

export function transformPropertyComparer(a: string[], b: string[]): number {
    return transforms.indexOf(a[0]) - transforms.indexOf(b[0]);
}

/**
 * Handles transforming short hand key properties into their native form
 */
export function normalizeProperties(keyframe: waapi.Keyframe): void {
    let cssTransforms: string[][] = [];

    for (let prop in keyframe) {
        const value = keyframe[prop];
        if (!isDefined(value)) {
            keyframe[prop] = undefined;
            continue;
        }

        // nullify properties so shorthand and handled properties don't end up in the result
        keyframe[prop] = undefined;

        // get the final property name
        const propAlias = propertyAliases[prop] || prop;

        // find out if the property needs to end up on transform
        const transformIndex = transforms.indexOf(propAlias);

        if (transformIndex !== -1) {
            // handle transforms
            cssTransforms.push([propAlias, value]);
        } else if (propAlias === 'easing') {
            // handle easings
            keyframe.easing = getEasingString(value);
        } else {
            // handle others (change background-color and the like to backgroundColor)
            keyframe[toCamelCase(propAlias)] = value;
        }
    }

    if (cssTransforms.length) {
        keyframe.transform = cssTransforms
            .sort(transformPropertyComparer)
            .reduce((c: string, n: string[]) => c + ` ${n[0]}(${n[1]})`, '');
    }
}
