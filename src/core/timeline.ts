import { css, cssFunction } from 'just-curves'

import {
    _,
    assign,
    unitResolver,
    convertToMs,
    getTargets,
    inRange,
    listify,
    isFunction,
    maxBy,
    parseUnit,
    resolve,
    toCamelCase
} from '../utils'
 
import { Animator, timeloop, dispatcher } from '.'

// fixme: see if this can be removed somehow
/* this controls the amount of time left before the timeline gives up 
on individual animation and calls finish.  If an animation plays after its time, it looks
like it restarts and that causes jank */
const animationPadding = (1.0 / 60) + 7

const ALTERNATE = 'alternate'
const CANCEL = 'cancel'
const FATAL = 'fatal'
const FINISH = 'finish'
const IDLE = 'idle'
const ITERATION = 'iteration'
const NORMAL = 'normal'
const PAUSE = 'pause'
const PENDING = 'pending'
const PLAY = 'play'
const RUNNING = 'running'
const UPDATE = 'update'

export class JATimeline implements ja.ITimeline {

    public trigger: (eventName: string, ctx: ja.AnimationTimeContext) => this
    public on: (eventName: string, listener: { (ctx: ja.AnimationTimeContext): void }) => this
    public off: (eventName: string, listener: { (ctx: ja.AnimationTimeContext): void }) => this

    public _listeners: { [key: string]: { (ctx: ja.AnimationTimeContext): void }[] }
    public duration = 0
    public currentTime: number = _
    public playbackRate = 1    
    public playState: ja.AnimationPlaybackState = IDLE

    private _ctx: ja.AnimationTimeContext
    private _direction: ja.AnimationDirection = NORMAL
    private _currentIteration: number = _

    private _totalIterations: number = _
    private _events: TimelineEvent[] = []

    constructor() {
        const self = this
        const ctx = {} as ja.AnimationTimeContext

        assign(self, dispatcher())

        self.on(CANCEL, () => {
            timeloop.off(self.tick)
            self.currentTime = 0
            self._currentIteration = _
            self.playState = IDLE

            self._events.forEach(evt => evt.animator.playState = IDLE)

            self._events.forEach(evt => {
                ctx.target = evt.target
                ctx.targets = evt.targets
                ctx.index = evt.index

                if (evt.on.cancel) {
                    evt.on.cancel(ctx)
                }
            })
        })
        self.on(FINISH, () => {
            timeloop.off(self.tick)
            self.currentTime = _
            self._currentIteration = _
            self.playState = 'finished'

            self._events.forEach(evt => evt.animator.playState = 'finished')

            self._events.forEach(evt => {
                ctx.target = evt.target
                ctx.targets = evt.targets
                ctx.index = evt.index
                if (evt.on.finish) {
                    evt.on.finish(ctx)
                }
            })
        })
        self.on(PAUSE, () => {
            timeloop.off(self.tick)
            self.playState = 'paused'

            self._events.forEach(evt => evt.animator.playState = 'paused')

            self._events.forEach(evt => {
                ctx.target = evt.target
                ctx.targets = evt.targets
                ctx.index = evt.index
                if (evt.on.pause) {
                    evt.on.pause(ctx)
                }
            })
        })

        self._ctx = ctx
    }

    public append(options: ja.AnimationOptions | ja.AnimationOptions[]): this {
        const self = this
        self.at(self.duration, options)
        return self
    }

    public at(position: string | number, events: ja.AnimationOptions | ja.AnimationOptions[]): this {
        const self = this
        const { _events } = self
        const startTime = convertToMs(parseUnit(position || 0))

        listify(events)
            .forEach(event => {
                // set from and to relative to existing duration    
                event.from = convertToMs(parseUnit(event.from || 0)) + startTime
                event.to = convertToMs(parseUnit(event.to || 0)) + startTime

                // set easing to linear by default     
                const easingFn = cssFunction(event.easing || css.ease)
                event.easing = css[toCamelCase(event.easing)] || event.easing || css.ease

                const delay = event.delay || 0
                const endDelay = event.endDelay || 0

                const targets = getTargets(event.targets!) 
                for (let i = 0, ilen = targets.length; i < ilen; i++) {
                    const target = targets[i]

                    const ctx: ja.AnimationTimeContext = {
                        index: i,
                        target: target,
                        targets: targets
                    }

                    // fire create function if provided (allows for modifying the target prior to animating)
                    if (event.on && isFunction(event.on.create)) {
                        event.on.create!(ctx)
                    }

                    const iterations = resolve(event.iterations, ctx) || 1
                    const iterationStart = resolve(event.iterationStart, ctx) || 0
                    const direction = resolve(event.direction, ctx) || _
                    const duration = +event.to - +event.from
                    const fill = resolve(event.fill, ctx) || 'none'
                    
                    const delayUnit = unitResolver(resolve(delay, ctx) || 0)(i)
                    const endDelayUnit = unitResolver(resolve(endDelay, ctx) || 0)(i)
                    
                    event.delay = convertToMs(delayUnit)                    
                    event.endDelay = convertToMs(endDelayUnit)
                    const totalTime = event.delay + ((iterations || 1) * duration) + event.endDelay

                    // note: don't unwrap easings so we don't break this later with custom easings
                    const easing = css[toCamelCase(event.easing)] || event.easing || css.ease 

                    const animator = new Animator(ctx, {
                        delay: event.delay,
                        direction,                        
                        duration,
                        easing,                        
                        endDelay: event.endDelay,  
                        fill,                        
                        iterationStart,                        
                        iterations,
                        totalTime
                    })

                    _events.push({
                        animator: animator,
                        easingFn: easingFn,
                        endTimeMs: event.from + animator.totalDuration,
                        index: i,
                        on: event.on || {},
                        startTimeMs: event.from,
                        target: target,
                        targets: targets
                    })
                }
            })

        // recalculate the max duration of the timeline
        self.duration = maxBy(self._events, e => e.startTimeMs + e.animator.totalDuration)

        return self
    }

    public cancel(): this {
        const self = this
        self.trigger(CANCEL, self._ctx)
        return self
    }
    public finish(): this {
        const self = this
        self.trigger(FINISH, self._ctx)
        return self
    }
    public pause(): this {
        const self = this
        self.trigger(PAUSE, self._ctx)
        return self
    }
    public play(iterations = 1): this {
        const self = this

        self._totalIterations = iterations

        if (!(self.playState === RUNNING || self.playState === PENDING)) {
            self.playState = PENDING
            timeloop.on(self.tick)
            self.trigger(PLAY, self._ctx)
        }
        return self
    }

    public reverse(): this {
        const self = this
        self.playbackRate = (self.playbackRate || 0) * -1
        return self
    }

    private tick = (delta: number): void => {
        const self = this
        const playState = self.playState
        const context = self._ctx

        // canceled
        if (playState === IDLE) {
            self.trigger(CANCEL, context)
            return
        }
        // finished
        if (playState === 'finished') {
            self.trigger(FINISH, context)
            return
        }
        // paused
        if (playState === 'paused') {
            self.trigger(PAUSE, context)
            return
        }
        // running/pending

        // calculate running range
        const duration1 = self.duration
        const totalIterations = self._totalIterations

        let playbackRate = self.playbackRate as number
        let isReversed = playbackRate < 0
        let startTime = isReversed ? duration1 : 0
        let endTime = isReversed ? 0 : duration1

        if (self.playState === PENDING) {
            const currentTime2 = self.currentTime
            const currentIteration = self._currentIteration
            self.currentTime = currentTime2 === _ || currentTime2 === endTime ? startTime : currentTime2
            self._currentIteration = currentIteration === _ || currentIteration === totalIterations ? 0 : currentIteration
            self.playState = RUNNING
        }

        // calculate currentTime from delta
        let currentTime = self.currentTime + delta * playbackRate
        let currentIteration = self._currentIteration || 0

        let isLastFrame = false
        // check if animation has finished
        if (!inRange(currentTime, startTime, endTime)) {
            isLastFrame = true
            if (self._direction === ALTERNATE) {
                playbackRate = (self.playbackRate || 0) * -1
                self.playbackRate = playbackRate

                isReversed = playbackRate < 0
                startTime = isReversed ? duration1 : 0
                endTime = isReversed ? 0 : duration1
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
            self.trigger(FINISH, context)
            return
        }

        // start animations if should be active and currently aren't   
        for (let i = 0, ilen = self._events.length; i < ilen; i++) {
            const evt = self._events[i]
            const isForward = playbackRate >= 0
            const startTimeMs = isForward ? evt.startTimeMs : evt.startTimeMs + animationPadding
            const endTimeMs = isForward ? evt.endTimeMs : evt.endTimeMs - animationPadding

            const isActive = startTimeMs <= currentTime && currentTime <= endTimeMs
            const animator = evt.animator

            if (!isActive) {
                continue
            }

            const controllerState = animator.playState

            if (controllerState === FATAL) {
                // skip to end if there was a fatal error                
                i = ilen
                self.trigger(CANCEL, context)
                continue
            }

            if (isLastFrame) {
                animator.restart()
            }

            let playedThisFrame = false
            if (controllerState !== RUNNING || isLastFrame) {
                animator.playbackRate(playbackRate)
                animator.playState = RUNNING
                playedThisFrame = true
            }

            animator.playbackRate(playbackRate)

            const shouldTriggerPlay = !!evt.on.play && playedThisFrame
            const shouldTriggerUpdate = !!evt.on.update

            if (shouldTriggerPlay || shouldTriggerUpdate) {
                assign(context, {
                    computedOffset: _,                    
                    currentTime: _,
                    delta: _,
                    duration: _,
                    index: evt.index,                    
                    iterations: _,
                    offset: _,
                    playbackRate: _,
                    target: evt.target,
                    targets: evt.targets
                })
            }

            if (shouldTriggerPlay && evt.on.play) {
                evt.on.play(context)
            }

            if (shouldTriggerUpdate) {
                const relativeDuration = evt.endTimeMs - evt.startTimeMs
                const relativeCurrentTime = currentTime - evt.startTimeMs
                const timeOffset = relativeCurrentTime / relativeDuration

                // set context object values for this update cycle 
                assign(context, {
                    computedOffset: evt.easingFn(timeOffset),                    
                    currentTime: relativeCurrentTime,
                    delta,
                    duration: relativeDuration,
                    iterations: currentIteration,                    
                    offset: timeOffset,
                    playbackRate
                })

                evt.on.update(context)
            }
        }
    }
}

type TimelineEvent = {
    animator: Animator;
    easingFn: ja.Func<number>;
    endTimeMs: number;
    index: number;
    on: { [key: string]: ja.AnimationEventListener };
    startTimeMs: number;
    target: any;
    targets: any[];
}
