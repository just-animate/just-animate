import { AnimationController, Effect } from '../lib/core/types'
import { lazy } from '../lib/utils/utils'
import { abs } from '../lib/utils/math'
import { RUNNING } from './constants'
import { PENDING, FINISH } from '../lib/utils/constants'

// minimum amount of time left on an animation required to call .play()
const frameSize = 17

export function animate(effect: Effect): AnimationController {
  const { keyframes, prop, from, to, target } = effect
  const duration = to - from

  const getAnimator = lazy(() => {
    const frames = keyframes.map(({ offset, value, easing }) => ({ offset, [prop]: value, easing }))

    const a = (target as any).animate(frames, {
      duration,
      fill: 'both'
    })
    a.pause()
    return a
  })

  return {
    cancel() {
      getAnimator().cancel()
    },
    update(offset: number, rate: number, isPlaying: boolean) {
      const animator = getAnimator()
      const time = duration * offset

      if (abs(animator.currentTime - time) > 1) {
        // sync if paused or seeking
        animator.currentTime = time
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

      const needsToPlay =
        isPlaying &&
        !(animator.playState === RUNNING || animator.playState === FINISH) &&
        !(rate < 0 && time < frameSize) &&
        !(rate >= 0 && time > duration - frameSize)

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
