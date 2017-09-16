import { ITimelineModel } from '../core/types'
import { update } from './update'

export const updateTime = (model: ITimelineModel, time: number) => {
  const currentTime = +time
  model.time = isFinite(currentTime) ? currentTime : model.rate < 0 ? model.duration : 0
  update(model)
}
