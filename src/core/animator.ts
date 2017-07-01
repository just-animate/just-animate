import * as types from '../types';
import { RUNNING, CANCEL, PAUSE, FINISH, SEEK, TICK, inRange } from '../utils';

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
            // cancel and return    
            animator.cancel()    
            return
        }
        if (type === FINISH) {
             // finish animation and pause it so it won't attempt to play when seeking    
            animator.finish()
            animator.pause()
            return
        }

        if (type === PAUSE) {
            // pause the animation and continue processing    
            animator.pause()
        } 
         
        if (type === SEEK && animator.currentTime !== (time - from)) {
            // sync if necessary          
            animator.currentTime = time - from
        } 
        
        const sign = (playbackRate || 0) < 0 ? -1 : 1
        if (inRange(time + (framePadding * sign), 0, to - from)) {
            // don't do anything if not in range
            return
        }
        
        if (type === TICK && animator.playState !== RUNNING) {
            // start if ticking and animator is not running
            animator.play()
        }
    }
}
