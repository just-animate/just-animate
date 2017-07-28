import { AnimationController, Effect } from '../lib/types';
import { lazy } from '../lib/utils';
import { abs } from '../lib/math';
import { RUNNING } from './constants';
import { PENDING, FINISH } from '../lib/constants';

// minimum amount of time left on an animation required to call .play()
const frameSize = 17;
const halfFrame = 8

export function animate(effect: Effect): AnimationController {
  const { keyframes, prop, from, to, target } = effect
  const duration = to - from

  const getAnimator = lazy(() => {
    const a = (target as any).animate(
      keyframes.map(({ offset, value }) => ({ offset, [prop]: value })),
      {
        duration,
        delay: 0,
        endDelay: 0,
        fill: 'both'
      }
    )
    a.pause()
    return a
  })

  return {
    cancel() {
      getAnimator().cancel()
    },
    update(localTime: number, rate: number, isPlaying: boolean) { 
      const animator = getAnimator()
      
      if (abs(animator.currentTime -  localTime) > halfFrame) {    
        // sync if paused or seeking
        animator.currentTime = localTime
      }

      if (isPlaying && animator.playbackRate !== rate) {

        // if current time is too close to the end, move it by 1 ms to prevent flickering
        // this is a fix for FireFox
        const currentTime = animator.currentTime
        if (currentTime < 1) {
          animator.currentTime = 1
        } else if (currentTime >= duration - 1) {
          animator.currentTime = duration - 1
        }
        
        // set playbackRate direction/speed
        animator.playbackRate = rate
      }

      const needsToPlay = isPlaying
        && !(animator.playState === RUNNING || animator.playState === FINISH)
        && !(rate < 0 && localTime < frameSize)
        && !(rate >= 0 && localTime > duration - frameSize);
        
      if (needsToPlay) {              
        animator.play()
      }

      const needsToPause = !isPlaying && (animator.playState === RUNNING || animator.playState === PENDING)
      if (needsToPause) {
        animator.pause()
      }
    }
  }
}
