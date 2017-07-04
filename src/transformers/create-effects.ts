import * as types from '../types'
import { isArray, isFunction } from '../utils';

export function createEffects(targets: types.TargetConfiguration[]): types.EffectOptions[] {
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
                    const values = (p.value as types.KeyframeValueResolver[]).map(a =>
                        isFunction(a) ? (a as Function)(target.target, p.index) : a as string | number)

                    // todo: hand off to middleware instead
                    // this is also where transforms need to be merged
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
