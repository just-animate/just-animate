import * as types from '../types'
import { isFunction, convertToMs, isDefined, indexOf } from '../utils';
import { resolve } from '../transformers';
import { unitHandler, transformHandler } from '../handlers';

const propertyHandlers: types.PropertyHandler[] = [unitHandler, transformHandler]

export function toEffects(targets: types.TargetConfiguration[]): types.Effect[] {
    const result: types.Effect[] = []

    for (var i = 0, ilen = targets.length; i < ilen; i++) {
        const targetConfig = targets[i]
        const { from, to, duration, keyframes, target } = targetConfig

        // construct property animation options        
        var effects: types.PropertyEffects = {}
        for (var j = 0, jlen = keyframes.length; j < jlen; j++) {
            const p = keyframes[j]
            const propName = p.prop
            const offset = (p.time - from) / (duration || 1)
            const value = isFunction(p.value) ? (p.value as Function)(target, p.index) : p.value as string | number

            // get or create property            
            const effect = effects[propName] || (effects[propName] = [])
            effect.push({ offset, value })
        }

        // process handlers
        for (var q = 0, qlen = propertyHandlers.length; q < qlen; q++) {
            propertyHandlers[q](targetConfig, effects)
        }

        for (var propName in effects) {
            var effect = effects[propName]
            if (!effect) {
                continue
            }

            // remap the keyframes field to remove multiple values
            var effect2 = {
                target,
                from,
                to,
                keyframes: effect.map(({ offset, value }) => ({
                    offset,
                    [propName]: value
                }))
            };

            // add to list of Effects
            result.push(effect2)
        }
    }
    return result
}

export function addKeyframes(target: types.TargetConfiguration, index: number, options: types.AnimationOptions) {
    const { css } = options
    const staggerMs = convertToMs(resolve(options.stagger, target, index, true) || 0) as number
    const delayMs = convertToMs(resolve(options.delay, target, index) || 0) as number
    const endDelayMs = convertToMs(resolve(options.endDelay, target, index) || 0) as number

    // todo: incorporate WAAPI delay/endDelay
    const from = staggerMs + delayMs + options.from
    const to = staggerMs + delayMs + options.to + endDelayMs;
    const duration = to - from

    for (var i = 0, ilen = css.length; i < ilen; i++) {
        var keyframe = css[i]
        var time = Math.floor((duration * keyframe.offset) + from)
        addKeyframe(
            target,
            time,
            index,
            keyframe
        )
    }
}

function addKeyframe(target: types.TargetConfiguration, time: number, index: number, keyframe: types.KeyframeOptions) {
    var { keyframes } = target
    for (var name in keyframe) {
        if (name === 'offset') {
            continue
        }

        var value = keyframe[name] as string | number
        if (!isDefined(value)) {
            continue;
        }

        var indexOfFrame = indexOf(keyframes, k => k.prop === name && k.time === time)
        if (indexOfFrame !== -1) {
            keyframes[indexOfFrame].value = value
            continue;
        }

        keyframes.push({
            index,
            prop: name,
            time,
            order: 0, // fixme
            value
        })
    }
}
