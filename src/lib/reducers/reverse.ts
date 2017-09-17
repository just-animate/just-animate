import { ITimelineModel } from '../core/types'
import { publish } from './publish' 
import { update } from './update'
import { REVERSE } from '../actions'
import { IReducer } from '../core/types'

export const reverse: IReducer = (model: ITimelineModel) => {
  // reverse the playrate by multiplaying by -1
  model.rate *= -1
  
  // update all players.  This has to be done when changing direction because it effects whether the player is in effect
  update(model)
  
  // send reverse event
  publish(model, REVERSE, model.time)
}
