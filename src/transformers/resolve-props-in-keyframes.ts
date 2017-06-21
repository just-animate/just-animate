import { css } from 'just-curves'
import { AnimationTargetContext, CssKeyframeOptions, Keyframe } from '../types'
import { cssFunction } from '../utils/strings'
import { _, isDefined, toCamelCase } from '../utils'
import { propertyAliases, transforms } from './resources'
import { resolve } from '.'

const transformPropertyComparer = (a: string[], b: string[]) =>
    transforms.indexOf(a[0]) - transforms.indexOf(b[0])

/**
 * Handles transforming short hand key properties into their native form
 */
const normalizeProperties = (keyframe: Keyframe): void => {
    let cssTransforms: string[][] = []

    for (let prop in keyframe) {
        const value = keyframe[prop]

        // nullify properties so shorthand and handled properties don't end up in the result        
        keyframe[prop] = _

        if (!isDefined(value)) {
            continue
        }

        // get the final property name
        const propAlias = propertyAliases[prop] || prop

        // find out if the property needs to end up on transform
        const transformIndex = transforms.indexOf(propAlias)

        if (transformIndex !== -1) {
            // handle transforms
            cssTransforms.push([propAlias, value])

            // explicitly remove shorthand property
            delete keyframe[prop]
        } else if (propAlias === 'easing') {
            // handle easings, switch out for css function if available, default to ease
            keyframe.easing = css[toCamelCase(value as string)] || value || css.linear
        } else {
            // handle others (change background-color and the like to backgroundColor)
            keyframe[toCamelCase(propAlias)] = value
        }
    }

    if (cssTransforms.length) {
        keyframe.transform = cssTransforms
            .sort(transformPropertyComparer)
            .map(n => cssFunction(n[0], n[1]))
            .join('')
    }
}

/**
 * This calls all keyframe properties that are functions and sets their values
 */
export const resolvePropertiesInKeyframes = (source: CssKeyframeOptions[], target: CssKeyframeOptions[], ctx: AnimationTargetContext) => {
    for (let i = 0, ilen = source.length; i < ilen; i++) {
        const sourceKeyframe = source[i]
        let targetKeyframe: Keyframe = {}

        for (let propertyName in sourceKeyframe) {
            if (!sourceKeyframe.hasOwnProperty(propertyName)) {
                continue
            }
            const sourceValue = sourceKeyframe[propertyName]
            if (!isDefined(sourceValue)) {
                continue
            }
            targetKeyframe[propertyName] = resolve(sourceValue, ctx)
        }

        normalizeProperties(targetKeyframe)
        target.push(targetKeyframe)
    }
}
