import * as types from '../types';
import { RUNNING, CANCEL, PAUSE, FINISH, SEEK, UPDATE, inRange, clamp, _, lazy } from '../utils';

const framePadding = 0

export interface IAnimationController {
    (type: string, time: number, playbackRate: number): void
}

export function createWebAnimation({ keyframes, from, to, target }: types.EffectOptions): IAnimationController {
    const getAnimator = lazy(() => {
        const a = (target as any).animate(keyframes, {
            duration: to - from,
            fill: 'both'
        })
        a.pause()
        return a
    })

    return (type: string, time: number, playbackRate: number) => {
        const animator = getAnimator();
            
        if (animator.playbackRate !== playbackRate) {
            // set playbackRate direction/speed            
            animator.playbackRate = playbackRate
        }

        if (type === CANCEL) {
            animator.cancel()
            return
        }
        if (type === FINISH) {
            // without pause() WAAPI appears to play the animation again on seek
            animator.finish()
            animator.pause()
            return
        }

        if (type === PAUSE) {
            animator.pause()
        }

        const isForwards = (playbackRate || 0) >= 0
        const duration = to - from
        const currentTime = (time !== _ ? time : isForwards ? 0 : duration) - from
        if (type === PAUSE || type === SEEK) {
            // sync if paused or seeking         
            animator.currentTime = clamp(currentTime, 0, duration)
        }

        if (type === UPDATE && animator.playState !== RUNNING) {
            const sign = isForwards ? 1 : -1
            const isActive = inRange(currentTime + (framePadding * sign), 0, duration)

            if (isActive) {
                // sync time
                animator.currentTime = clamp(currentTime, 0, duration)

                // start if ticking and animator is not running
                animator.play()
            }
        }
    }
}
