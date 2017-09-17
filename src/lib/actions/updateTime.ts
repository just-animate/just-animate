import { ITimelineModel } from '../core/types'
import { update } from './update'

export const updateTime = (model: ITimelineModel, time: number) => {
  // set the time, set to the beginning if the the time resolves to Infinity or NaN
  const currentTime = +time
  model.time = isFinite(currentTime) ? currentTime : model.rate < 0 ? model.duration : 0
  
  // update all players
  update(model)
}
