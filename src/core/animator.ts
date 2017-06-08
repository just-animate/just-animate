import { isArray } from '../utils'

import {
    addTransition,
    arrangeKeyframes,
    expandOffsets,
    fixPartialKeyframes,
    keyframeOffsetComparer,
    propsToKeyframes,
    resolvePropertiesInKeyframes,
    spaceKeyframes
} from '../transformers'

/**
 * Implements the IAnimationController interface for the Web Animation API
 * 
 * @export
 * @class KeyframeAnimator
 * @implements {ja.IAnimationController}
 */
export class Animator {
    public totalDuration: number

    private _animator: Animation

    private get animator(): Animation {
        const self = this
        if (self._animator) {
            return self._animator
        }

        const { ctx, timings } = self
        // process css as either keyframes or calculate what those keyframes should be   
        const options = ctx.options!
        const target = ctx.target as HTMLElement
        const css = options.css

        let sourceKeyframes: ja.CssKeyframeOptions[]
        if (isArray(css)) {
            // if an array, no processing has to occur
            sourceKeyframes = css as ja.CssKeyframeOptions[]
            expandOffsets(sourceKeyframes)
        } else {
            sourceKeyframes = []
            propsToKeyframes(css as ja.CssPropertyOptions, sourceKeyframes, ctx)
        }

        const targetKeyframes: Keyframe[] = []

        resolvePropertiesInKeyframes(sourceKeyframes, targetKeyframes, ctx)

        if (options.$transition === true) {
            addTransition(targetKeyframes, target)
        }

        spaceKeyframes(targetKeyframes)
        arrangeKeyframes(targetKeyframes)

        // sort by offset (should have all offsets assigned)
        targetKeyframes.sort(keyframeOffsetComparer)

        fixPartialKeyframes(targetKeyframes)

        const animator = target.animate(targetKeyframes, timings)
        animator.cancel()
        self._animator = animator
        self.totalDuration = timings.totalTime

        return self._animator
    }
    
    public get playState() {
        const { animator } = this 
        return !animator ? 'fatal' : animator.playState
    }
    public set playState(value: ja.AnimationPlaybackState) {
        const { animator } = this
        const playState = !animator ? 'fatal' : animator.playState
        if (playState === value) {
            /* do nothing */
        } else if (playState === 'fatal') {
            animator.cancel()
        } else if (value === 'finished') {
            animator.finish()
        } else if (value === 'idle') {
            animator.cancel()
        } else if (value === 'paused') {
            animator.pause()
        } else if (value === 'running') {
            animator.play()
        }
    }

    constructor(private ctx: ja.AnimationTargetContext<Element>, private timings: ja.AnimationTiming) { }

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
    
    public restart() {
        const { animator } = this
        animator.cancel()
        animator.play()
    }
}
