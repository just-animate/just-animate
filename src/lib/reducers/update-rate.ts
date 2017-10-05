import { ITimelineModel } from '../core/types'
import { update } from './update' 
import { IReducerContext } from '../core/types'
import { _ } from '../utils/constants'

export function updateRate(model: ITimelineModel, rate: number, ctx: IReducerContext) {
  // set the rate
  model.timing.rate = rate || 1
  
  // update all players
  update(model, _, ctx)
}
