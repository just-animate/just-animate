import { _, RUNNING } from '../utils'
import { isArray, convertToMs } from '../utils'
import {
    Animation, AnimationTargetContext, AnimationTimeContext, AnimationTiming, CssKeyframeOptions,
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
    private css: CssKeyframeOptions[] | CssPropertyOptions
    private ctx: AnimationTimeContext
    private easingFn: (n: number) => number
    private timing: AnimationTiming
    private onCancel?: () => void
    private onFinish?: () => void
    private onPause?: () => void
    private onPlay?: () => void
    private _animator: Animation
    private _playbackRate: number
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
        self._playbackRate = 1
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


    public seek(currentTime: number) {
        // convert to time relative to the animation's duration
        const { animator, startTimeMs, endTimeMs } = this
        const relativeTime = Math.min(Math.max(currentTime - startTimeMs, 0), endTimeMs - startTimeMs)
        
        // set if different than the last known value
        if (animator.currentTime !== relativeTime) {
            animator.currentTime = relativeTime
        }
    }
    
    public tick(currentTime: number, isLastFrame: boolean) {
        const self = this
        let { endTimeMs, startTimeMs } = self
        const isForward = this._playbackRate >= 0

        let isActive: boolean;        
        if (isForward) {
            const paddedForwardTime = currentTime + framePadding
            isActive = startTimeMs <= paddedForwardTime && paddedForwardTime < endTimeMs
        } else {
            const paddedBackwardTime = currentTime - framePadding
            isActive = startTimeMs < paddedBackwardTime && paddedBackwardTime <= endTimeMs 
        }

        if (!isActive) {
            return
        }
        
        if (self.animator.playState !== RUNNING || isLastFrame) {
            if (isLastFrame) {
                self.restart()
            }
            
            self.animator.play()
            if (self.onPlay) {
                self.onPlay()
            }
        }
    }
    public playbackRate(value: number) {
        const self = this
        const { animator } = self
        self._playbackRate = value
        if (animator.playbackRate !== value) {
            animator.playbackRate = value
        }
    }

    public cancel() {
        const self = this
        self.animator.cancel()
        if (self.onCancel) {
            self.onCancel()
        }
    }

    public finish() {
        const self = this
        self.animator.finish()
        self.animator.pause()
        if (self.onFinish) {
            self.onFinish()
        }
    }

    public pause() {
        const self = this
        self.animator.pause()
        if (self.onPause) {
            self.onPause()
        }
    }

    public restart() {
        const { animator } = this
        animator.cancel()
        animator.play()
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
