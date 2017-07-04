import * as types from '../types'
import { isArray, isFunction, convertToMs, isDefined, indexOf, _ } from '../utils';
import { resolve } from '../transformers';
import { lengthHandler, transformHandler } from '../handlers';

const propertyHandlers: types.PropertyHandler[] = [lengthHandler, transformHandler]

export function toEffects(targets: types.TargetConfiguration[]): types.EffectOptions[] {
    const result: types.EffectOptions[] = []

    for (let i = 0, ilen = targets.length; i < ilen; i++) {
        const target = targets[i]
        const { from, duration, props } = target

        for (const name in props) {
            const propKeyframes = props[name]
            const css = propKeyframes.map(p => {
                const offset = (p.time - from) / (duration || 1)
                let value: string | number
                if (isFunction(p.value)) {
                    value = (p.value as Function)(target.target, p.index)
                } else if (!isArray(p.value)) {
                    value = p.value as string | number
                } else {
                    let values = (p.value as types.KeyframeValueResolver[]).map(a =>
                        isFunction(a) ? (a as Function)(target.target, p.index) : a as string | number)

                    // process handlers
                    for (let q = 0, qlen = propertyHandlers.length; q < qlen; q++) {
                        const handler = propertyHandlers[q]
                        if (handler.isHandled(name)) {
                            values = handler.combine(values)
                        }
                    }
                    
                    value = values[values.length - 1]
                }
                return { offset, [name]: value }
            });

            result.push({
                target: target.target,
                from: target.from,
                to: target.to,
                keyframes: css
            })
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
    for (const name in keyframe) {
        if (name === 'offset') {
            continue
        } 
        
        // process handlers
        let value = keyframe[name]
        let name2 = name
        for (let q = 0, qlen = propertyHandlers.length; q < qlen; q++) {
            const handler = propertyHandlers[q]
            if (handler.isHandled(name)) {
                value = handler.toValue(name, value as string | number)
                name2 = handler.toName(name2)
            }
        }
 
        // tslint:disable-next-line:no-null-keyword
        if (value === null || value === _) {
            continue
        }

        let props = target.props[name2]
        if (!props) {
            props = [] as types.PropertyKeyframe[]
            target.props[name2] = props
        }

        const indexOfTime = indexOf(props, p => p.time === time)
        if (indexOfTime === -1) {
            props.push({ time, index, value })
            continue
        }

        const prop = props[indexOfTime]
        if (!isDefined(prop.value)) {
            prop.value = value
            continue
        }
        if (isArray(prop.value)) {
            (prop.value as any[]).push(value)
            continue
        }
        prop.value = [prop.value as any, value]
    }
}
