import { ITimelineModel } from '../core/types'
import { update } from './update'
import { IReducerContext } from '../core/types'
import { _ } from '../utils/constants'
import { isString, isDefined } from '../utils/inspect'

export function seek(model: ITimelineModel, time: number | string, ctx: IReducerContext) {
  let currentTime: number
  if (isString(time)) {
    const labelTime = model.labels[time]
    currentTime = isDefined(labelTime) ? labelTime : time as number
  } else {
    currentTime = time as number
  }

  // convert to number (if a numeric string)
  currentTime = +currentTime

  // check if time is a finite number (excluded NaN/Infinity)
  // set to beginning or end depending on the direction of the animation
  model.timing.time = isFinite(currentTime) ? currentTime : model.timing.rate < 0 ? model.timing.duration : 0

  // update all players
  update(model, _, ctx)
}
