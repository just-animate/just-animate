import { ITimelineModel } from '../core/types'
import { update } from './update' 

export const updateRate = (model: ITimelineModel, rate: number) => {
  model.rate = rate || 1
  update(model)
}
