import { AnimationController, Effect } from '../../types';
import { lazy } from '../../utils/utils';
import { CANCEL, FINISH, PAUSE, SEEK, _, UPDATE } from '../../utils/resources';
import { minMax, inRange, abs } from '../../utils/math';
import { RUNNING, TOLERANCE } from './constants';

export function animateEffect(effect: Effect): AnimationController {
  const { keyframes, from, to, target } = effect
  const getAnimator = lazy(() => {
    const a = (target as any).animate(
      keyframes.map(({offset, name, value}) => ({ offset, [name]: value })),
      {
        duration: to - from,
        fill: 'both'
      }
    )
    a.pause()
    return a
  })

  return (type: string, time: number, playbackRate: number) => {
    const animator = getAnimator()

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
      animator.currentTime = minMax(currentTime, 0, duration)
    }

    if (type === UPDATE && animator.playState !== RUNNING && inRange(currentTime, 0, duration)) {
      const localTime = minMax(currentTime, 0, duration)
      if (abs(animator.currentTime - localTime) > TOLERANCE) {
        // sync time
        animator.currentTime = localTime
      }

      // start if ticking and animator is not running
      animator.play()
    }
  }
}
