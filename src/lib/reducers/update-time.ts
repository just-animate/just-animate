import { ITimelineModel } from '../core/types'
import { update } from './update'
import { IReducerContext } from '../core/types'
import { _ } from '../utils/constants'

export function seek(model: ITimelineModel, time: number, ctx: IReducerContext) {
  // set the time, set to the beginning if the the time resolves to Infinity or NaN
  const currentTime = +time
  model.timing.time = isFinite(currentTime) ? currentTime : model.timing.rate < 0 ? model.timing.duration : 0
  
  // update all players
  update(model, _, ctx)
}
