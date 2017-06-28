import { head, indexOf, tail } from "../utils/lists";
import { convertToMs } from "../utils/units";
import { isArray, isDefined } from "../utils/type";

type AnimationTarget = {};

interface PropertyKeyframe<T> {
    time: number
    value: T | { (target: any, index: number, targets: any[]): T }
}

interface Target {
    target: AnimationTarget
    from: number
    to: number
    duration: number
    props: { [key: string]: PropertyKeyframe<any>[] }
}

interface BaseAnimationOptions {
    target: AnimationTarget[]
    css: Keyframe[]
}

interface ToAnimationOptions extends BaseAnimationOptions {
    duration?: number | string
}

interface FromAnimationOptions extends BaseAnimationOptions {
    duration: number | string
}

interface AnimationOptions extends BaseAnimationOptions {
    from: number
    to: number
    duration: number
}

interface EffectOptions {
    target: AnimationTarget
    css: Keyframe[]
    duration: number
    to: number
    from: number
}

interface Keyframe {
    offset?: number
    [key: string]: any
}

function inferOffsets(keyframes: Keyframe[]) {
    if (!keyframes.length) {
        return;
    }

    // search for offset 0 or assume it is the first one in the list
    const first = head(keyframes, k => k.offset === 0) || keyframes[0]
    if (!isDefined(first.offset)) {
        // if no offset is set on first keyframe, it is assumed to be 0
        first.offset = 0
    }

    // search for offset 1 or assume it is the last one in the list
    const last = tail(keyframes, k => k.offset === 1) || keyframes[keyframes.length - 1]
    if (keyframes.length > 1 && !isDefined(last.offset)) {
        // if no offset is set on last keyframe, it is assumed to be 1
        last.offset = 1
    }

    // fill in the rest of the offsets
    for (let i = 1, ilen = keyframes.length; i < ilen; i++) {
        const target = keyframes[i]
        if (isDefined(target.offset)) {
            // skip entries that have an offset   
            continue
        }

        // search for the next offset with a value        
        for (let j = i + 1; j < ilen; j++) {
            // pass if offset is not set
            if (typeof keyframes[j].offset !== 'number') {
                continue
            }

            // calculate timing/position info
            const startTime = keyframes[i - 1].offset
            const endTime = keyframes[j].offset
            const timeDelta = endTime - startTime
            const deltaLength = j - i + 1

            // set the values of all keyframes between i and j (exclusive)
            for (let k = 1; k < deltaLength; k++) {
                // set to percentage of change over time delta + starting time
                keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime
            }

            // move i past this keyframe since all frames between should be processed
            i = j
            break
        }
    }
}

function sortBy<T>(fieldName: keyof T) {
    return (a: T, b: T) => {
        const a1 = a[fieldName], b1 = b[fieldName]
        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0
    }
}

const propKeyframeSort = sortBy<PropertyKeyframe<any>>('time')

export class Timeline2 {
    targets: Target[] = []
    duration = 0

    public append(options: AnimationOptions) {
        const self = this
        self.from(self.duration, options)
        return self
    }

    public from(fromTime: string | number, opts: FromAnimationOptions) {
        const self = this
        const startTime = convertToMs(fromTime)

        let endTime: number
        if (isDefined(opts.duration)) {
            endTime = startTime + convertToMs(opts.duration)
        } else if (!self.duration) {
            throw new Error('duration/to')
        } else {
            endTime = self.duration
        }

        return self.fromTo(startTime, endTime, opts)
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
        for (let i = 0, ilen = options2.target.length; i < ilen; i++) {
            self.addTarget(options2.target[i], options2)
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

    public toAnimations(): EffectOptions[] {
        const self = this
        const { targets } = self
        const result: EffectOptions[] = []

        for (let i = 0, ilen = targets.length; i < ilen; i++) {
            const target = targets[i]
            const { from, duration, props } = target

            for (const name in props) {
                const propKeyframes = props[name]
                const css = propKeyframes.map(p => {
                    return {
                        offset: (p.time - from) / (duration || 1),
                        [name]: p.value
                    }
                });

                result.push({
                    target: target.target,
                    from: target.from,
                    to: target.to,
                    duration: target.duration,
                    css: css
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

    private addTarget(t: AnimationTarget, options: AnimationOptions) {
        const self = this
        let target = head(self.targets, t2 => t2.target === t)
        if (!target) {
            target = {
                from: options.from,
                to: options.to,
                duration: options.to - options.from,
                target: t,
                props: {}
            }
            self.targets.push(target)
        }

        if (isArray(options.css)) {
            self.addKeyframes(target, options)
        }
    }

    private addKeyframes(target: Target, options: AnimationOptions) {
        const self = this
        const { from, to } = options
        options.css.forEach(keyframe => {
            const time = Math.floor(((to - from) * keyframe.offset) + from)
            self.addKeyframe(
                target,
                time,
                keyframe
            )
        })
    }

    private addKeyframe(target: Target, time: number, keyframe: Keyframe) {
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
                props = [] as PropertyKeyframe<any>[]
                target.props[name] = props
            }

            let indexOfTime = indexOf(props, p => p.time === time)
            if (indexOfTime === -1) {
                props.push({ time, value })
            } else {
                const prop = props[indexOfTime]
                prop.value = value
            }
        }
    }
}

export function animate() {
    return new Timeline2()
}
