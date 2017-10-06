import { ITimelineModel } from '../core/types'
import { _ } from '../utils/constants'
import { inRange } from '../utils/math'
import { finish } from './finish'
import { update } from './update'
import { IReducerContext } from '../core/types'
import { pause } from './pause'
import { isDefined } from '../utils/inspect'

export function tick(model: ITimelineModel, delta: number, ctx: IReducerContext) {
  const timing = model.timing
  const playerConfig = model.playerConfig

  // calculate running range
  const duration = timing.duration
  const rate = timing.rate
  const repeat = playerConfig.repeat

  // determine the current time, round, and direction
  let time = timing.time === _ ? (rate < 0 ? duration : 0) : timing.time
  let round = timing.round || 0
  const isReversed = rate < 0

  // update the time by adding the delta by the rate of time
  time += delta * rate

  // check if timeline has finished
  let iterationEnded = false
  if (!inRange(time, 0, duration)) {
    timing.round = ++round
    time = isReversed ? 0 : duration
    iterationEnded = true

    if (playerConfig.yoyo) {
      // reverse direction when alternating and the iteration has completed
      timing.rate = (timing.rate || 0) * -1
    }

    // reset the clock based on the current direction
    time = timing.rate < 0 ? duration : 0
  }
 
  if (playerConfig && isDefined(playerConfig.to)) {
    const to = playerConfig.to
    const isInRange = timing.rate > 0 ? inRange(to, timing.time, time) : inRange(to, time, timing.time)
    if (isInRange) {
      time = to
      playerConfig.to = _
      pause(model, _, ctx)
    }
  }

  // save time and round
  timing.time = time
  timing.round = round

  if (iterationEnded && repeat === round) {
    // end the cycle by calling finish
    finish(model, _, ctx)
    return
  }

  // if not the last iteration, call update to update the players
  update(model, _, ctx)
}
