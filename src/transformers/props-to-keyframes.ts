import { KeyframeOptions, PropertyOptions, KeyframeValueResolver } from '../types'
import { isArray } from '../utils' 

export function propsToKeyframes (css: PropertyOptions): KeyframeOptions[] {
    // create a map to capture each keyframe by offset
    const keyframes: KeyframeOptions[] = []

    // iterate over each property split it into keyframes            
    for (let prop in css) {
        if (!css.hasOwnProperty(prop)) {
            continue
        }

        // resolve value (changes function into discrete value or array)                    
        const val = css[prop]

        if (isArray(val)) {
            // if the value is an array, split up the offset automatically
            const valAsArray = val as KeyframeValueResolver[]  
            for (let i = 0, ilen = valAsArray.length; i < ilen; i++) {
                const offset = i === 0 ? 0 : i === ilen - 1 ? 1 : i / (ilen - 1.0)
                keyframes.push({ offset, [prop]: val[i] })
            }
        } else {
            keyframes.push({ offset: 1, [prop]: val as KeyframeValueResolver })
        }
    }
    return keyframes
}
