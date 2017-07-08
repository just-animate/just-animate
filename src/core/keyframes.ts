import * as types from '../types'
import { isFunction, convertToMs, isDefined, indexOf } from '../utils';
import { resolve } from '../transformers';
import { unitHandler, transformHandler } from '../handlers';

const propertyHandlers: types.PropertyHandler[] = [unitHandler, transformHandler]

export function toEffects(targets: types.TargetConfiguration[]): types.EffectOptions[] {
    const result: types.EffectOptions[] = []

    for (let i = 0, ilen = targets.length; i < ilen; i++) {
        const target = targets[i]
        const { from, to, duration, keyframes } = target

        // construct property animation options        
        const props = {} as { [name: string]: types.EffectOptions }
        for (let j = 0, jlen = keyframes.length; j < jlen; j++) {
            const p = keyframes[j]
            const propName = p.prop
            const offset = (p.time - from) / (duration || 1)

            const values = (p.value as types.KeyframeValueResolver[]).map(a =>
                isFunction(a) ? (a as Function)(target.target, p.index) : a as string | number)

            // process handlers
            for (let q = 0, qlen = propertyHandlers.length; q < qlen; q++) {
                const handler = propertyHandlers[q]
                if (isFunction(handler.merge)) {
                    handler.merge(propName, values)
                }
            }

            // take the last value in the array
            const value = values[values.length - 1]

            // get or create property            
            let prop = props[propName]
            if (!prop) {
                prop = {
                    target: target.target,
                    from,
                    to,
                    keyframes: []
                }
                props[propName] = prop
            }
            
            prop.keyframes.push({
                offset, [propName]: value
            })
        }

        for (const propName in props) {
            result.push(props[propName])
        }
    }  
    return result
}

export function addKeyframes(target: types.TargetConfiguration, index: number, options: types.AnimationOptions) {
    const staggerMs = convertToMs(resolve(options.stagger, target, index, true) || 0) as number
    const delayMs = convertToMs(resolve(options.delay, target, index) || 0) as number
    const endDelayMs = convertToMs(resolve(options.endDelay, target, index) || 0) as number

    // todo: incorporate WAAPI delay/endDelay
    const from = staggerMs + delayMs + options.from
    const to = staggerMs + delayMs + options.to + endDelayMs;
    const duration = to - from

    options.css.forEach(keyframe => {
        const time = Math.floor((duration * keyframe.offset) + from)
        addKeyframe(
            target,
            time,
            index,
            keyframe
        )
    })
}

function addKeyframe(target: types.TargetConfiguration, time: number, index: number, keyframe: types.KeyframeOptions) {
    const { keyframes } = target
    for (const propName in keyframe) {
        if (propName === 'offset') {
            continue
        }

        // process handlers
        const propValue = {
            name: propName,
            value: keyframe[propName] as string | number
        }

        for (let q = 0, qlen = propertyHandlers.length; q < qlen; q++) {
            const handler = propertyHandlers[q]
            if (isFunction(handler.convert)) {
                handler.convert(propValue)
            }
        }

        // tslint:disable-next-line:no-null-keyword
        if (!isDefined(propValue.value)) {
            continue
        }

        const { name, value } = propValue
        const indexOfFrame = indexOf(keyframes, k => k.prop === name && k.time === time)
        if (indexOfFrame !== -1) {
            keyframes[indexOfFrame].value.push(value)
            continue
        }
        
        keyframes.push({
            index,
            prop: name,
            time,
            order: 0, // fixme
            value: [value]
        })
    }
}
