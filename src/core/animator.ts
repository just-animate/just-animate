import * as types from '../types';
import { RUNNING } from '../utils';

const framePadding = 17

/** Implements the IAnimationController interface for the Web Animation API */
export class Animator {
    public endTimeMs: number
    public startTimeMs: number
    private keyframes: types.Keyframe[]
    private target: types.AnimationTarget 
    private timing: types.AnimationTiming
    private _animator: types.Animation
    private _playbackRate: number

    private get animator(): types.Animation {
        const self = this
        if (self._animator) {
            return self._animator
        }
        const { target } = self
        const animator = (target as any).animate(self.keyframes, self.timing)
        animator.cancel() 
        self._animator = animator
        return self._animator
    }

    constructor(options: types.EffectOptions) {
        const self = this
        const { keyframes, target, duration, to, from } = options

        // setup instance variables
        self._playbackRate = 1

        self.keyframes = keyframes
        self.target = target
        self.startTimeMs = from
        self.endTimeMs = to

        // setup WAAPI timing object
        self.timing = {
            fill: 'both',
            duration
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
