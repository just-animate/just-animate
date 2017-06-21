import { _, FATAL, FINISHED, IDLE, PAUSED, RUNNING } from '../utils'
import { isArray, convertToMs } from '../utils'
import {
    Animation, AnimationPlaybackState, AnimationTargetContext, AnimationTimeContext, AnimationTiming, CssKeyframeOptions,
    CssPropertyOptions, Func, Keyframe, Resolvable
} from '../types'
import {
    addTransition, fixOffsets, expandOffsets, fixPartialKeyframes, keyframeOffsetComparer, propsToKeyframes, resolve,
    resolvePropertiesInKeyframes, spaceKeyframes
} from '../transformers'

const framePadding = 17

const createAnimation = (css: CssKeyframeOptions[] | CssPropertyOptions, ctx: AnimationTargetContext, timings: AnimationTiming, isTransition: boolean) => {
    // process css as either keyframes or calculate what those keyframes should be   
    const target = ctx.target as HTMLElement

    let sourceKeyframes: CssKeyframeOptions[]
    if (isArray(css)) {
        // if an array, no processing has to occur
        sourceKeyframes = css as CssKeyframeOptions[]
        expandOffsets(sourceKeyframes)
    } else {
        sourceKeyframes = []
        propsToKeyframes(css as CssPropertyOptions, sourceKeyframes, ctx)
    }

    const targetKeyframes: Keyframe[] = []

    resolvePropertiesInKeyframes(sourceKeyframes, targetKeyframes, ctx)

    if (isTransition) {
        // add computed properties to match "to" properties
        addTransition(targetKeyframes, target)
    }

    if (targetKeyframes.length > 1) {
        // don't attempt to fill animation if less than 2 keyframes
        spaceKeyframes(targetKeyframes)
    }
    if (targetKeyframes.length) {
        // fix first and last offsets
        fixOffsets(targetKeyframes)
    }

    // sort by offset (should have all offsets assigned)
    targetKeyframes.sort(keyframeOffsetComparer)

    if (targetKeyframes.length > 0) {
        // don't attempt to fill animation if less than 1 keyframes
        fixPartialKeyframes(targetKeyframes)
    }

    const animator = (target as any).animate(targetKeyframes, timings)
    animator.cancel()
    return animator
}

/** Implements the IAnimationController interface for the Web Animation API */
export class Animator {
    public endTimeMs: number
    public startTimeMs: number
    private css:  CssKeyframeOptions[] | CssPropertyOptions
    private ctx: AnimationTimeContext
    private easingFn: (n: number) => number
    private timing: AnimationTiming
    private onCancel?: () => void
    private onFinish?: () => void
    private onPause?: () => void
    private onPlay?: () => void
    private _animator: Animation
    private transition: boolean    

    private get animator(): Animation {
        const self = this
        if (self._animator) {
            return self._animator
        }
        const { transition, css, ctx, timing } = self
        self._animator = createAnimation(css, ctx, timing, transition)
        return self._animator
    }

    public get playState() {
        const { animator } = this
        return !animator ? FATAL : animator.playState
    }
    public set playState(value: AnimationPlaybackState) {
        const { animator } = this
        const playState = !animator ? FATAL : animator.playState
        if (playState === value) {
            // do nothing if the play state has not changed
            return
        }
        if (playState === FATAL) {
            animator.cancel()
        } else if (value === FINISHED) {
            animator.finish()
        } else if (value === IDLE) {
            animator.cancel()
        } else if (value === PAUSED) {
            animator.pause()
        } else if (value === RUNNING) {
            animator.play()
        }
    }

    constructor(options: IAnimationOptions) {
        const self = this
        const { transition, css, delay, easing, endDelay, from, index, stagger, target, targets } = options

        const ctx: AnimationTimeContext = {
            index,
            target,
            targets
        }

        // fire create function if provided (allows for modifying the target prior to animating)
        if (options.onCreate) {
            options.onCreate!(ctx)
        }

        const iterations = resolve(options.iterations, ctx) || 1
        const iterationStart = resolve(options.iterationStart, ctx) || 0
        const direction = resolve(options.direction, ctx) || _
        const duration = +options.to - +options.from
        const fill = resolve(options.fill, ctx) || 'none'
        const staggerMs = convertToMs(resolve(stagger, ctx, true) || 0)
        const delayMs = convertToMs(resolve(delay, ctx) || 0)
        const endDelayMs = convertToMs(resolve(endDelay, ctx) || 0)
        const totalTime = delayMs + ((iterations || 1) * duration) + endDelayMs

        // setup instance variables
        self.onCancel = options.onCancel
        self.onFinish = options.onFinish
        self.onPause = options.onPause
        self.onPlay = options.onPlay
        self.endTimeMs = staggerMs + from + totalTime
        self.startTimeMs = staggerMs + from
        self.css = css
        self.ctx = ctx
        self.transition = !!transition
        self.easingFn = options.easingFn

        // setup WAAPI timing object
        self.timing = {
            delay: delayMs,
            endDelay: endDelayMs,
            direction,
            duration,
            easing,
            fill,
            iterations,
            iterationStart,
            totalTime
        }
    }

    public isActive(currentTime: number, playbackRate: number) {
        const self = this
        let { endTimeMs, startTimeMs } = self   
        const isForward = playbackRate >= 0
        
        if (isForward) {
            const paddedForwardTime = currentTime + framePadding
            return startTimeMs <= paddedForwardTime && paddedForwardTime < endTimeMs
        }

        const paddedBackwardTime = currentTime - framePadding      
        return startTimeMs < paddedBackwardTime && paddedBackwardTime <= endTimeMs
    }

    public seek(value: number) {
        const { animator } = this
        if (animator.currentTime !== value) {
            animator.currentTime = value
        }
    }
    public playbackRate(value: number) {
        const { animator } = this
        if (animator.playbackRate !== value) {
            animator.playbackRate = value
        }
    }
    
    public cancel() {
        const self = this
        self.playState = IDLE
        if (self.onCancel) {
            self.onCancel()
        }  
    }

    public finish() {
        const self = this
        self.playState = FINISHED
        if (self.onFinish) {
            self.onFinish()
        }  
    }

    public pause() {
        const self = this
        self.playState = PAUSED
        if (self.onPause) {
            self.onPause()
        }
    }

    public restart() {
        const { animator } = this
        animator.cancel()
        animator.play()
    }

    public tick(playbackRate: number, isLastFrame: boolean) {
        const self = this
        
        if (isLastFrame) {
            self.restart()
        }

        let playedThisFrame = false
        if (self.playState !== RUNNING || isLastFrame) {
            self.playbackRate(playbackRate)
            self.playState = RUNNING
            playedThisFrame = true
        }

        self.playbackRate(playbackRate)
        
        if (!!self.onPlay && playedThisFrame) {
            self.onPlay()
        }
    }
}

export interface IAnimationOptions {
    transition: boolean
    css: CssKeyframeOptions[] | CssPropertyOptions
    direction: Resolvable<string>
    delay: Resolvable<number>
    easing: string
    endDelay: Resolvable<number>
    fill: Resolvable<string>
    from: number
    iterationStart: Resolvable<number>
    iterations: Resolvable<number>
    easingFn: Func<number>
    index: number
    to: number
    target: any
    targets: any[]
    
    stagger: Resolvable<string | number>

    onCancel(): void
    onCreate(ctx: AnimationTimeContext): void
    onFinish(): void
    onPause(): void
    onPlay(): void
}
