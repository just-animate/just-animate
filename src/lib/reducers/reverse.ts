import { ITimelineModel } from '../core/types' 
import { update } from './update'
import { REVERSE } from '../actions'
import { IReducerContext } from '../core/types'
import { _ } from '../utils/constants'

export function reverse (model: ITimelineModel, _data: any, ctx: IReducerContext) {
  // reverse the playrate by multiplaying by -1
  model.timing.rate *= -1
  
  // update all players.  This has to be done when changing direction because it effects whether the player is in effect
  update(model, _, ctx)
  
  // send reverse event 
  ctx.trigger(REVERSE) 
}
