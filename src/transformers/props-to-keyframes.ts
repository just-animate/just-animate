import { AnimationTargetContext, CssKeyframeOptions, CssPropertyOptions } from '../types'
import { _, isArray, isDefined, parseUnit, unsupported } from '../utils'
import { keyframeOffsetComparer } from './keyframe-offset-comparer'
import { transforms } from './resources'
import { resolve } from '.'

export const propsToKeyframes = (css: CssPropertyOptions, keyframes: CssKeyframeOptions[], ctx: AnimationTargetContext): void => {
    // create a map to capture each keyframe by offset
    const keyframesByOffset: { [key: number]: CssKeyframeOptions } = {}
    const cssProps = css as CssPropertyOptions

    // iterate over each property split it into keyframes            
    for (let prop in cssProps) {
        if (!cssProps.hasOwnProperty(prop)) {
            continue
        }

        // resolve value (changes function into discrete value or array)                    
        const val = resolve(cssProps[prop], ctx)

        if (isArray(val)) {
            // if the value is an array, split up the offset automatically
            const valAsArray = val as string[]
            const valLength = valAsArray.length

            for (let i = 0; i < valLength; i++) {
                const offset = i === 0 ? 0
                    : i === valLength - 1 ? 1
                        : i / (valLength - 1.0)

                let keyframe = keyframesByOffset[offset]
                if (!keyframe) {
                    keyframe = {}
                    keyframesByOffset[offset] = keyframe
                }
                keyframe[prop] = val[i]
            }
        } else {
            // if the value is not an array, place it at offset 1
            let keyframe = keyframesByOffset[1]
            if (!keyframe) {
                keyframe = {}
                keyframesByOffset[1] = keyframe
            }
            keyframe[prop] = val
        }
    }

    // get list of transform properties in object
    const includedTransforms: string[] = Object
        .keys(cssProps)
        .filter((c: string) => transforms.indexOf(c) !== -1)

    const offsets = Object
        .keys(keyframesByOffset)
        .map(s => +s)
        .sort()

    // if prop not present calculate each transform property in list
    // a keyframe at offset 1 should be guaranteed for each property, so skip that one
    for (let i = offsets.length - 2; i > -1; --i) {
        const offset = offsets[i]
        const keyframe = keyframesByOffset[offset]

        // foreach keyframe if has transform property
        for (const transform of includedTransforms) {
            if (isDefined(keyframe[transform])) {
                continue
            }
            // get the next keyframe (should always be one ahead with a good value)
            const endOffset = offsets[i + 1]
            const endKeyframe = keyframesByOffset[endOffset]

            // parse out unit values of next keyframe       
            const envValueUnit = parseUnit(endKeyframe[transform])
            const endValue = envValueUnit.value
            const endUnitType = envValueUnit.unit

            // search downward for the previous value or use defaults  
            let startIndex = 0
            let startValue = endValue
            let startOffset = 0
            let startUnit: string = _

            for (let j = i - 1; j > -1; --j) {
                const offset1 = offsets[j]
                const keyframe1 = keyframesByOffset[offset1]
                if (isDefined(keyframe1[transform])) {

                    const startValueUnit = parseUnit(keyframe1[transform])
                    startValue = startValueUnit.value
                    startUnit = startValueUnit.unit
                    startIndex = j
                    startOffset = offsets[j]
                    break
                }
            }

            if (startValue !== 0 && isDefined(startUnit) && isDefined(endUnitType) && startUnit !== endUnitType) {
                throw unsupported('Mixed transform property units')
            }

            // iterate forward
            for (let j = startIndex; j < i + 1; j++) {
                const currentOffset = offsets[j]
                const currentKeyframe = keyframesByOffset[currentOffset]

                // calculate offset delta (how much animation progress to apply)
                const offsetDelta = (currentOffset - startOffset) / (endOffset - startOffset)
                const currentValue = startValue! + (endValue - startValue) * offsetDelta
                const currentValueWithUnit = isDefined(endUnitType)
                    ? currentValue + endUnitType
                    : isDefined(startUnit)
                        ? currentValue + startUnit
                        : currentValue

                currentKeyframe[transform] = currentValueWithUnit

                // move reference point forward
                startOffset = currentOffset
                startValue = currentValue
            }
        }
    }

    // reassemble as array
    for (let offset in keyframesByOffset) {
        const keyframe = keyframesByOffset[offset]
        keyframe.offset = +offset
        keyframes.push(keyframe)
    }

    // resort by offset    
    keyframes.sort(keyframeOffsetComparer)
}
