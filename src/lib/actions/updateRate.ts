import { ITimelineModel } from '../core/types'
import { update } from './update' 

export const updateRate = (model: ITimelineModel, rate: number) => {
  // set the rate
  model.rate = rate || 1
  
  // update all players
  update(model)
}
