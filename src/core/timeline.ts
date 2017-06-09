import { css, cssFunction } from 'just-curves'
import { AnimationDirection, AnimationOptions, AnimationPlaybackState, AnimationTimeContext } from '../types'

import {
    _,
    assign,
    convertToMs,
    getTargets,
    inRange,
    isFunction,
    maxBy,
    parseUnit,
    toCamelCase
} from '../utils'

import { Animator, timeloop } from '.'

const ALTERNATE = 'alternate'
const CANCEL = 'cancel'
const FATAL = 'fatal'
const FINISH = 'finish'
const FINISHED = 'finished'
const IDLE = 'idle'
const ITERATION = 'iteration'
const NORMAL = 'normal'
const PAUSE = 'pause'
const PAUSED = 'paused'
const PENDING = 'pending'
const PLAY = 'play'
const RUNNING = 'running'
const UPDATE = 'update'

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
        self.at(self.duration, options)
        return self
    }
    public at(position: string | number, opts: AnimationOptions) {
        const self = this
        const { _animations } = self
        const startTime = convertToMs(parseUnit(position || 0))

        const { delay, direction, endDelay, fill, iterationStart, iterations } = opts

        // set from and to relative to existing duration    
        const from = convertToMs(parseUnit(opts.from || 0)) + startTime
        const to = convertToMs(parseUnit(opts.to || 0)) + startTime

        // set easing to linear by default     
        const easingFn = cssFunction(opts.easing || css.ease)
        const easing = css[toCamelCase(opts.easing)] || opts.easing || css.ease

        const targets = getTargets(opts.targets!)
        for (let index = 0, ilen = targets.length; index < ilen; index++) {
            const target = targets[index]

            const animator = new Animator({
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
                target,
                targets,
                index,
                onCreate: opts.onCreate,
                onCancel: opts.onCancel,
                onFinish: opts.onFinish,
                onPause: opts.onPause,
                onPlay: opts.onPlay,
                onUpdate: opts.onUpdate
            })

            _animations.push(animator)
        }

        // recalculate the max duration of the timeline
        self.duration = maxBy(self._animations, e => e.endTimeMs)

        return self
    }
    public cancel() {
        const self = this
        timeloop.off(self.tick)
        self.currentTime = 0
        self._currentIteration = _
        self.playState = IDLE
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i].cancel()
        }
        self.trigger(CANCEL, self._ctx)
        return self
    }
    public finish() {
        const self = this
        timeloop.off(self.tick)
        self.currentTime = _
        self._currentIteration = _
        self.playState = FINISHED
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i].finish()
        }
        self.trigger(FINISH, self._ctx)
        return self
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
        timeloop.off(self.tick)
        self.playState = PAUSED
        for (let i = 0, ilen = self._animations.length; i < ilen; i++) {
            self._animations[i].pause()
        }
        self.trigger(PAUSE, self._ctx)
        return self
    }
    public play(iterations = 1) {
        const self = this

        self._totalIterations = iterations

        if (!(self.playState === RUNNING || self.playState === PENDING)) {
            self.playState = PENDING
            timeloop.on(self.tick)
            self.trigger(PLAY, self._ctx)
        }
        return self
    }
    public reverse() {
        const self = this
        self.playbackRate = (self.playbackRate || 0) * -1
        return self
    }
    private trigger = (eventName: string, resolvable: AnimationTimeContext | { (): AnimationTimeContext; }) => {
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
    private tick = (delta: number) => {
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
            const currentTime2 = self.currentTime
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

            self.trigger(ITERATION, context)
        }

        self._currentIteration = currentIteration
        self.currentTime = currentTime

        self.trigger(UPDATE, context)

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

            animator.tick(currentTime, playbackRate, delta, isLastFrame)
        }
    }
}
