import { ITimelineModel } from '../core/types'
import { update } from './update' 
import { IReducer, IReducerContext } from '../core/types'
import { _ } from '../utils/constants'

export const updateRate:  IReducer = (model: ITimelineModel, rate: number, _ctx: IReducerContext) => {
  // set the rate
  model.rate = rate || 1
  
  // update all players
  update(model, _, _ctx)
}
