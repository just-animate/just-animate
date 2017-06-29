import { RUNNING, isArray, convertToMs } from '../utils'
import { Animation, AnimationTarget, AnimationTiming, CssKeyframeOptions, 
    CssPropertyOptions, Keyframe, KeyframeValue, KeyframeValueResolver } from '../types'
import {
    addTransition, fixOffsets, fixPartialKeyframes, keyframeOffsetComparer, propsToKeyframes, resolve,
    resolvePropertiesInKeyframes, spaceKeyframes
} from '../transformers'

const framePadding = 17

const createAnimation = (css: CssKeyframeOptions[] | CssPropertyOptions, target: AnimationTarget, index: number, timings: AnimationTiming, isTransition: boolean) => {
    // process css as either keyframes or calculate what those keyframes should be   
    let sourceKeyframes: CssKeyframeOptions[]
    if (isArray(css)) {
        // if an array, no processing has to occur
        sourceKeyframes = css as CssKeyframeOptions[]
    } else {
        sourceKeyframes = []
        propsToKeyframes(css as CssPropertyOptions, sourceKeyframes, target, index)
    }

    const targetKeyframes: Keyframe[] = []

    resolvePropertiesInKeyframes(sourceKeyframes, targetKeyframes, target, index)

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
    private index: number
    private target: AnimationTarget 
    private timing: AnimationTiming
    private _animator: Animation
    private _playbackRate: number
    private transition: boolean

    private get animator(): Animation {
        const self = this
        if (self._animator) {
            return self._animator
        }
        const { transition, css, timing, index, target } = self
        self._animator = createAnimation(css, target, index, timing, transition)
        return self._animator
    }

    constructor(options: IAnimationOptions) {
        const self = this
        const { transition, css, delay, index, easing, endDelay, stagger, target } = options
        const from = options.from as number

        const duration = +options.to - +options.from
        const staggerMs = convertToMs(resolve(stagger, target, index, true) || 0) as number
        const delayMs = convertToMs(resolve(delay, target, index) || 0) as number
        const endDelayMs = convertToMs(resolve(endDelay, target, index) || 0) as number
        const totalTime = delayMs + duration + endDelayMs

        // setup instance variables
        self._playbackRate = 1
        self.endTimeMs = staggerMs + from + totalTime
        self.startTimeMs = staggerMs + from
        self.css = css
        self.target = target
        self.index = index
        self.transition = !!transition 

        // setup WAAPI timing object
        self.timing = {
            delay: delayMs,
            endDelay: endDelayMs,
            fill: 'both',
            duration,
            easing,
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
    }

    public finish() {
        const self = this
        self.animator.finish()
        self.animator.pause()
    }

    public pause() {
        const self = this
        self.animator.pause()
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
    delay: KeyframeValueResolver
    easing: string
    endDelay: KeyframeValueResolver
    from: KeyframeValue
    index: number
    to: KeyframeValue
    target: any
    stagger: KeyframeValueResolver
}
