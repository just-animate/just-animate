import * as types from '../types'
import { resolve } from '../transformers/'
import { convertToMs, getTargets, inRange, isDefined, isArray, isFunction, indexOf, sortBy, head, SEEK, TICK } from '../utils'
import { _, ALTERNATE, CANCEL, FINISH, FINISHED, IDLE, NORMAL, PAUSE, PAUSED, PENDING, PLAY, RUNNING } from '../utils/resources'
import { createWebAnimation, timeloop, IAnimationController } from '.'
import { inferOffsets } from '../transformers/infer-offsets';

const propKeyframeSort = sortBy<types.PropertyKeyframe>('time')

export class Timeline {
    public duration: number
    public playbackRate: number    
    public playState: types.AnimationPlaybackState
    private targets: types.TargetConfiguration[] 
    private _animations: IAnimationController[]  
    private _currentIteration: number    
    private _currentTime: number
    private _direction: types.AnimationDirection
    private _listeners: { [key: string]: { (): void }[] }
    private _totalIterations: number
    private _isReady: boolean

    public get currentTime() {
        return this._currentTime
    }
    public set currentTime(currentTime: number) {
        const self = this
        self._currentTime = currentTime
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i](SEEK, currentTime, self.playbackRate)
        }
    }
    
    constructor() {
        const self = this
        self.duration = 0
        self._currentTime = _
        self.playbackRate = 1
        self.playState = IDLE
        self._animations = []
        self.targets = []
        self._isReady = false
        self._currentIteration = _
        self._direction = NORMAL
        self._totalIterations = _
        self._listeners = {}
    }

    public add(opts: types.AddAnimationOptions) {
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

    public fromTo(from: number | string, to: number | string, options: types.BaseAnimationOptions) {
        const self = this
        // ensure to/from are in milliseconds (as numbers)
        const options2 = options as types.AnimationOptions
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
            self._addTarget(targets[i], i, options2)
        }

        // sort property keyframes
        self._sortPropKeyframes()

        // recalculate property keyframe times and total duration
        self._calcTimes()

        return self
    }

    public to(toTime: string | number, opts: types.ToAnimationOptions) {
        const self = this
        const to = convertToMs(toTime)

        let fromTime: number
        if (isDefined(opts.from)) {
            fromTime = convertToMs(opts.from)
        } else if (isDefined(opts.duration)) {
            fromTime = to - convertToMs(opts.duration)
        } else {
            fromTime = self.duration
        }

        return self.fromTo(Math.max(fromTime, 0), to, opts)
    }

    public cancel() {
        const self = this
        timeloop.off(self._tick)
        self._currentTime = 0
        self._currentIteration = _
        self.playState = IDLE
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i](CANCEL, 0, self.playbackRate)
        }
        self._trigger(CANCEL)
        self._teardown()
        return self
    }

    public finish() {
        const self = this
        timeloop.off(self._tick)
        self._setup()
        self._currentTime = _
        self._currentIteration = _
        self.playState = FINISHED
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i](FINISH, _, self.playbackRate)
        }
        self._trigger(FINISH) 
        return self
    }

    public on(eventName: string, listener: () => void) {
        const self = this
        const { _listeners } = self

        const listeners = _listeners[eventName] || (_listeners[eventName] = [])
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener)
        }

        return self
    }
    public off(eventName: string, listener: () => void) {
        const self = this
        const listeners = self._listeners[eventName]
        if (listeners) {
            const indexOfListener = listeners.indexOf(listener)
            if (indexOfListener !== -1) {
                listeners.splice(indexOfListener, 1)
            }
        }
        return self
    }

    public pause() {
        const self = this
        const { currentTime, playbackRate } = self
        timeloop.off(self._tick)
        self._setup()
        self.playState = PAUSED
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i](PAUSE, currentTime, playbackRate)
        }
        self._trigger(PAUSE)
        return self
    }

    public play(iterations = 1) {
        const self = this
        self._setup()
        self._totalIterations = iterations

        if (!(self.playState === RUNNING || self.playState === PENDING)) {
            self.playState = PENDING
            timeloop.on(self._tick)
            self._trigger(PLAY)
        }
        return self
    }

    public reverse() {
        const self = this
        self.playbackRate = (self.playbackRate || 0) * -1
        return self
    }

    public _getOptions(): types.EffectOptions[] {
        const self = this
        const { targets } = self
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

    private _addTarget(target: types.AnimationTarget, index: number, options: types.AnimationOptions) {
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
            self._addKeyframes(targetConfig, index, options)
        }
    }

    private _addKeyframes(target: types.TargetConfiguration, index: number, options: types.AnimationOptions) {
        const self = this 
        const staggerMs = convertToMs(resolve(options.stagger, target, index, true) || 0) as number
        const delayMs = convertToMs(resolve(options.delay, target, index) || 0) as number
        const endDelayMs = convertToMs(resolve(options.endDelay, target, index) || 0) as number
        
        // todo: incorporate WAAPI delay/endDelay
        const from = staggerMs + delayMs + options.from
        const to = staggerMs + delayMs + options.to + endDelayMs;
        const duration = to - from
        
        options.css.forEach(keyframe => {
            const time = Math.floor((duration * keyframe.offset) + from)
            self._addKeyframe(
                target,
                time,
                index,
                keyframe
            )
        })
    }

    private _addKeyframe(target: types.TargetConfiguration, time: number, index: number, keyframe: types.KeyframeOptions) {
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
                props = [] as types.PropertyKeyframe[]
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
    
    private _calcTimes() {
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

    private _setup(): void {
        const self = this
        self._animations = self._getOptions().map(createWebAnimation) 
        self._isReady = true
    }

    private _sortPropKeyframes() {
        const self = this
        const { targets } = self
        for (let i = 0, ilen = targets.length; i < ilen; i++) {
            const target = targets[i]
            for (const name in target.props) {
                target.props[name].sort(propKeyframeSort)
            }
        }
    }

    private _teardown(): void {
        const self = this        
        self._animations = []
        self._isReady = false
    }

    private _trigger = (eventName: string) => {
        const self = this
        const listeners = self._listeners[eventName as string]
        if (listeners) {
            for (const listener of listeners) {
                listener()
            }
        }
        return self
    }
    
    private _tick = (delta: number) => {
        const self = this
        const playState = self.playState

        // canceled
        if (playState === IDLE) {
            self.cancel()
            return
        }
        // finished
        if (playState === FINISHED) {
            self.finish()
            return
        }
        // paused
        if (playState === PAUSED) {
            self.pause()
            return
        }
        // running/pending

        // calculate running range
        const duration = self.duration
        const totalIterations = self._totalIterations

        let playbackRate = self.playbackRate
        let isReversed = playbackRate < 0
        let startTime = isReversed ? duration : 0
        let endTime = isReversed ? 0 : duration

        if (self.playState === PENDING) {
            const currentTime2 = self._currentTime || 0
            const currentIteration = self._currentIteration
            self._currentTime = currentTime2 === endTime ? startTime : currentTime2
            self._currentIteration = currentIteration === totalIterations ? 0 : currentIteration
            self.playState = RUNNING
        }

        // calculate currentTime from delta
        let currentTime = self._currentTime + delta * playbackRate
        let currentIteration = self._currentIteration || 0

        let isLastFrame = false
        // check if timeline has finished
        if (!inRange(currentTime, startTime, endTime)) {
            isLastFrame = true
            if (self._direction === ALTERNATE) {
                self.reverse()
                playbackRate = self.playbackRate
                isReversed = playbackRate < 0
                startTime = isReversed ? duration : 0
                endTime = isReversed ? 0 : duration
            }

            currentIteration++
            currentTime = startTime
        }

        self._currentIteration = currentIteration
        self._currentTime = currentTime

        if (totalIterations === currentIteration) {
            self.finish()
            return
        }

        // start animations if should be active and currently aren't   
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i](TICK, currentTime, playbackRate)
        }
    } 
}
