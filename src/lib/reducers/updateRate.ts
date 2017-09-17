import { ITimelineModel } from '../core/types'
import { update } from './update' 
import { IReducer } from '../core/types'

export const updateRate:  IReducer = (model: ITimelineModel, rate: number) => {
  // set the rate
  model.rate = rate || 1
  
  // update all players
  update(model)
}
