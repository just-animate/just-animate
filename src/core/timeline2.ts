import { isFunction } from 'util';

import { AnimationTarget, Keyframe, KeyframeOptions, KeyframeValueResolver } from '../types';
import { convertToMs, head, indexOf, isArray, isDefined, sortBy, getTargets } from '../utils';
import { inferOffsets } from '../transformers/infer-offsets';

const propKeyframeSort = sortBy<PropertyKeyframe>('time')

export interface PropertyKeyframe {
    time: number
    index: number
    value: KeyframeValueResolver | KeyframeValueResolver[]
}

export interface Target {
    target: AnimationTarget
    from: number
    to: number
    duration: number
    props: { [key: string]: PropertyKeyframe[] }
}

export interface BaseAnimationOptions {
    targets: AnimationTarget | AnimationTarget[]
    css: KeyframeOptions[]
}

export interface ToAnimationOptions extends BaseAnimationOptions {
    duration?: number | string
}

export interface AddAnimationOptions extends BaseAnimationOptions {
    from?: number
    to?: number
    duration?: number
}

export interface AnimationOptions extends BaseAnimationOptions {
    from: number
    to: number
    duration: number
}

interface EffectOptions {
    target: AnimationTarget
    keyframes: Keyframe[]
    duration: number
    to: number
    from: number
}

export class Timeline2 {
    targets: Target[] = []
    duration = 0

    public add(opts: AddAnimationOptions) {
        const self = this
        const hasTo = isDefined(opts.to)
        const hasFrom = isDefined(opts.from)
        const hasDuration = isDefined(opts.duration)

        // pretty exaustive rules for importing times
        let from: number, to: number;  
        if (hasFrom && hasTo) {
            from = convertToMs(opts.from)
            to = convertToMs(opts.to)
        } else if (hasFrom && hasDuration) {
            from = convertToMs(opts.from)
            to = from + convertToMs(opts.duration)
        } else if (hasTo && hasDuration) {
            to = convertToMs(opts.to)
            from = to - convertToMs(opts.duration)            
        } else if (hasTo && !hasDuration) {
            from = self.duration
            to = from + convertToMs(opts.to)
        } else if (hasDuration) {
            from = self.duration
            to = from + convertToMs(opts.duration)
        } else {
            throw new Error('Please provide to/from/duration')
        }

        // ensure from/to is not negative
        from = Math.max(from, 0)
        to = Math.max(to, 0)
        
        self.fromTo(from, to, opts)
        return self
    }

    public fromTo(from: number | string, to: number | string, options: BaseAnimationOptions) {
        const self = this
        // ensure to/from are in milliseconds (as numbers)
        const options2 = options as AnimationOptions
        options2.from = convertToMs(from)
        options2.to = convertToMs(to)
        options2.duration = options2.to - options2.from

        // fill in missing offsets
        if (isArray(options2.css)) {
            inferOffsets(options2.css) 
        }

        // add all targets as property keyframes
        const targets = getTargets(options.targets)
        for (let i = 0, ilen = targets.length; i < ilen; i++) {
            self.addTarget(targets[i], i, options2)
        }

        // sort property keyframes
        self.sortPropKeyframes()

        // recalculate property keyframe times and total duration
        self.calcTimes()

        return self
    }

    public to(toTime: string | number, opts: ToAnimationOptions) {
        const self = this
        const endTime = convertToMs(toTime)

        let fromTime: number
        if (isDefined(opts.duration)) {
            fromTime = Math.max(convertToMs(opts.duration), 0)
        } else {
            fromTime = self.duration
        }

        return self.fromTo(fromTime, endTime, opts)
    }

    public getOptions(): EffectOptions[] {
        const self = this
        const { targets } = self
        const result: EffectOptions[] = []

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
                        const values = (p.value as KeyframeValueResolver[]).map(a => 
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
                    duration: target.duration,
                    keyframes: css
                })
            }
        }

        return result
    }

    private sortPropKeyframes() {
        const self = this
        const { targets } = self
        for (let i = 0, ilen = targets.length; i < ilen; i++) {
            const target = targets[i]
            for (const name in target.props) {
                target.props[name].sort(propKeyframeSort)
            }
        }
    }

    private calcTimes() {
        const self = this
        let timelineTo = 0

        for (let i = 0, ilen = self.targets.length; i < ilen; i++) {
            const target = self.targets[i]
            let targetFrom = undefined
            let targetTo = undefined

            for (const name in target.props) {
                const props = target.props[name]
                for (let j = 0, jlen = props.length; j < jlen; j++) {
                    const prop = props[j]
                    if (prop.time < targetFrom || targetFrom === undefined) {
                        targetFrom = prop.time
                    }
                    if (prop.time > targetTo || targetTo === undefined) {
                        targetTo = prop.time
                        if (prop.time > timelineTo) {
                            timelineTo = prop.time
                        }
                    }
                }
            }
            target.to = targetTo
            target.from = targetFrom
            target.duration = targetTo - targetFrom
        }
        self.duration = timelineTo
    }

    private addTarget(target: AnimationTarget, index: number, options: AnimationOptions) {
        const self = this
        let targetConfig = head(self.targets, t2 => t2.target === target)
        if (!targetConfig) {
            targetConfig = {
                from: options.from,
                to: options.to,
                duration: options.to - options.from,
                target,
                props: {}
            }
            self.targets.push(targetConfig)
        }

        if (isArray(options.css)) {
            self.addKeyframes(targetConfig, index, options)
        }
    }

    private addKeyframes(target: Target, index: number, options: AnimationOptions) {
        const self = this
        const { from, to } = options
        options.css.forEach(keyframe => {
            const time = Math.floor(((to - from) * keyframe.offset) + from)
            self.addKeyframe(
                target,
                time,
                index,
                keyframe
            )
        })
    }

    private addKeyframe(target: Target, time: number, index: number, keyframe: KeyframeOptions) {
        for (const name in keyframe) {
            if (name === 'offset') {
                continue
            }

            const value = keyframe[name]
            // tslint:disable-next-line:no-null-keyword
            if (value === null || value === undefined) {
                continue
            }

            let props = target.props[name]
            if (!props) {
                props = [] as PropertyKeyframe[]
                target.props[name] = props
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
            prop.value = [ value as any ]
        }
    }
}

export function animate() {
    return new Timeline2()
}
