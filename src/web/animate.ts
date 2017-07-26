import { AnimationController, Effect } from '../lib/types';
import { lazy } from '../lib/utils';
import { flr } from '../lib/math';
import { RUNNING } from './constants';

// minimum amount of time left on an animation required to call .play()
const frameSize = flr(1000 / 30);

export function animate(effect: Effect): AnimationController {
  const { keyframes, prop, from, to, target } = effect
  const duration = to - from
  let playbackRate = 1
  
  const getAnimator = lazy(() => {
    const a = (target as any).animate(
      keyframes.map(({ offset, value }) => ({ offset, [prop]: value })),
      {
        duration,
        fill: 'both'
      }
    )
    a.onfinish = () => {
      // prevent restart of animation
      a.pause()
      a.currentTime = playbackRate < 0 ? 0 : duration
    }
    a.pause()
    return a
  })

  return {
    cancel() {
      getAnimator().cancel()
    },
    update(localTime: number, rate: number, isPlaying: boolean) {
      const animator = getAnimator()
      if (flr(animator.currentTime) !== localTime) {
        // sync if paused or seeking
        animator.currentTime = localTime
      }
      if (animator.playbackRate !== rate) {
        // set playbackRate direction/speed
        animator.playbackRate = rate
      }

      const needsToPlay = isPlaying && animator.playState !== RUNNING
      if (needsToPlay) {
        if (rate < 0 && localTime < frameSize) {
          // skip to the 0 if reversed and not enough time to animate
          animator.currentTime = 0 
        } else if (rate >= 0 && localTime > duration - frameSize) {
          // skip to the end if forwards and not enough time to animate
          animator.currentTime = duration  
        } else { 
          // start up animator
          animator.play()  
        }
      }
      
      const needsToPause = !isPlaying && animator.playState === RUNNING
      if (needsToPause) {
        animator.pause()
      }    
      
      playbackRate = rate      
    }
  }
}
