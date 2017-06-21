import { css as cssDef, cssFunction } from 'just-curves'
import { assign, convertToMs, getTargets, inRange, isDefined, isFunction, maxBy, missing, toCamelCase } from '../utils'
import { _, ALTERNATE, CANCEL, FATAL, FINISH, FINISHED, IDLE, ITERATION, NORMAL, PAUSE, PAUSED, PENDING, PLAY, RUNNING } from '../utils/resources'
import {
    AnimationDirection,
    AnimationOptions,
    AnimationPlaybackState,
    AnimationTimeContext
} from '../types'
import { Animator, timeloop } from '.'

export class Timeline {
    public duration = 0
    public currentTime: number = _
    public playbackRate = 1
    public playState: AnimationPlaybackState = IDLE
    private _animations: Animator[] = []
    private _ctx: AnimationTimeContext
    private _currentIteration: number = _
    private _direction: AnimationDirection = NORMAL
    private _listeners: { [key: string]: { (ctx: AnimationTimeContext): void }[] }
    private _totalIterations: number = _

    constructor() {
        const self = this
        const ctx = {} as AnimationTimeContext
        self._ctx = ctx
        self._listeners = {}
    }
    public append(options: AnimationOptions) {
        const self = this
        self.from(self.duration, options)
        return self
    }

    public cancel() {
        const self = this
        timeloop.off(self._tick)
        self.currentTime = 0
        self._currentIteration = _
        self.playState = IDLE
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i].cancel()
        }
        self._trigger(CANCEL, self._ctx)
        return self
    }
    public finish() {
        const self = this
        timeloop.off(self._tick)
        self.currentTime = _
        self._currentIteration = _
        self.playState = FINISHED
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i].finish()
        }
        self._trigger(FINISH, self._ctx)
        return self
    }

    public from(fromTime: string | number, opts: AnimationOptions) {
        const self = this
        const startTime = convertToMs(fromTime)

        let endTime: number
        if (isDefined(opts.to)) {
            endTime = convertToMs(opts.to)
        } else if (isDefined(opts.duration)) {
            endTime = startTime + convertToMs(opts.duration)
        } else if (!self.duration) {
            throw missing('duration/to')
        } else {
            endTime = self.duration
        }

        return self._insert(startTime, endTime, opts)
    }

    public on(eventName: string, listener: (ctx: AnimationTimeContext) => void) {
        const self = this
        const { _listeners } = self

        const listeners = _listeners[eventName] || (_listeners[eventName] = [])
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener)
        }

        return self
    }
    public off(eventName: string, listener: (ctx: AnimationTimeContext) => void) {
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
        timeloop.off(self._tick)
        self.playState = PAUSED
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i].pause()
        }
        self._trigger(PAUSE, self._ctx)
        return self
    }
    public play(iterations = 1) {
        const self = this

        self._totalIterations = iterations

        if (!(self.playState === RUNNING || self.playState === PENDING)) {
            self.playState = PENDING
            timeloop.on(self._tick)
            self._trigger(PLAY, self._ctx)
        }
        return self
    }
    public reverse() {
        const self = this
        self.playbackRate = (self.playbackRate || 0) * -1
        return self
    }

    public to(toTime: string | number, opts: AnimationOptions) {
        const self = this
        const endTime = convertToMs(toTime)

        let fromTime: number
        if (isDefined(opts.from)) {
            fromTime = convertToMs(fromTime)
        } else if (isDefined(opts.duration)) {
            fromTime = Math.max(convertToMs(opts.duration), 0)
        } else {
            fromTime = self.duration
        }

        return self._insert(fromTime, endTime, opts)
    }

    private _insert(from: number, to: number, opts: AnimationOptions) {
        const self = this
        const { _animations } = self

        const { transition, css, delay, direction, endDelay, fill, iterationStart, stagger, iterations } = opts
        // set easing to linear by default     
        const easingFn = cssFunction(opts.easing || cssDef.ease)
        const easing = css[toCamelCase(opts.easing)] || opts.easing || cssDef.ease

        const targets = getTargets(opts.targets!)
        for (let index = 0, ilen = targets.length; index < ilen; index++) {
            _animations.push(
                new Animator({
                    transition,
                    css,
                    to,
                    from,
                    delay,
                    direction,
                    easing,
                    easingFn,
                    endDelay,
                    fill,
                    iterationStart,
                    iterations,
                    stagger,
                    target: targets[index],
                    targets,
                    index,
                    onCreate: opts.onCreate,
                    onCancel: opts.onCancel,
                    onFinish: opts.onFinish,
                    onPause: opts.onPause,
                    onPlay: opts.onPlay
                })
            )
        }

        // recalculate the max duration of the timeline
        self.duration = maxBy(self._animations, e => e.endTimeMs)

        return self
    }

    private _trigger = (eventName: string, resolvable: AnimationTimeContext | { (): AnimationTimeContext; }) => {
        const self = this
        const listeners = self._listeners[eventName as string]
        if (listeners) {
            const ctx = isFunction(resolvable)
                ? (resolvable as Function)()
                : resolvable

            for (const listener of listeners) {
                listener(ctx)
            }
        }
        return self
    }
    private _tick = (delta: number) => {
        const self = this
        const playState = self.playState
        const context = self._ctx

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
            const currentTime2 = self.currentTime || 0
            const currentIteration = self._currentIteration
            self.currentTime = currentTime2 === endTime ? startTime : currentTime2
            self._currentIteration = currentIteration === totalIterations ? 0 : currentIteration
            self.playState = RUNNING
        }

        // calculate currentTime from delta
        let currentTime = self.currentTime + delta * playbackRate
        let currentIteration = self._currentIteration || 0

        let isLastFrame = false
        // check if timeline has finished
        if (!inRange(currentTime, startTime, endTime)) {
            isLastFrame = true
            if (self._direction === ALTERNATE) {
                playbackRate = (self.playbackRate || 0) * -1
                self.playbackRate = playbackRate

                isReversed = playbackRate < 0
                startTime = isReversed ? duration : 0
                endTime = isReversed ? 0 : duration
            }

            currentIteration++
            currentTime = startTime

            assign(context, {
                computedOffset: _,
                currentTime,
                delta,
                duration: endTime - startTime,
                index: _,
                iterations: currentIteration,
                offset: _,
                playbackRate,
                target: _,
                targets: _
            })

            self._trigger(ITERATION, context)
        }

        self._currentIteration = currentIteration
        self.currentTime = currentTime

        if (totalIterations === currentIteration) {
            self.finish()
            return
        }

        // start animations if should be active and currently aren't   
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            const animator = self._animations[i]
            if (!animator.isActive(currentTime, playbackRate)) {
                continue
            }
            if (animator.playState === FATAL) {
                // skip to end if there was a fatal error in one of the animators               
                i = ilen
                self.cancel()
                continue
            }

            animator.tick(playbackRate, isLastFrame)
        }
    }
}
