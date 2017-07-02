import * as types from '../types';
import { RUNNING, CANCEL, PAUSE, FINISH, SEEK, TICK, inRange, clamp } from '../utils';

const framePadding = 17

export interface IAnimationController {
    (type: string, time: number, playbackRate: number): void
}

export function createWebAnimation({ keyframes, from, to, target }: types.EffectOptions): IAnimationController {
    // intialize animator
    let animator: any
    return (type: string, time: number, playbackRate: number) => {
        if (!animator) {
            // initialize animator if not initialized
            animator = (target as any).animate(keyframes, {
                duration: to - from,
                fill: 'both'
            })
            animator.cancel()
        }

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

        const duration = to - from
        const currentTime = time - from
        if (type === SEEK && animator.currentTime !== currentTime) {
            // sync if necessary          
            animator.currentTime = clamp(currentTime, 0, duration)
        }

        if (type === TICK && animator.playState !== RUNNING) {
            const sign = (playbackRate || 0) < 0 ? -1 : 1
            const isActive = inRange(currentTime + (framePadding * sign), 0, to - from)

            if (isActive) {
                // sync time
                animator.currentTime = clamp(currentTime, 0, duration)

                // start if ticking and animator is not running
                animator.play()
            }
        }
    }
}
