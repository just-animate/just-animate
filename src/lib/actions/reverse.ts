import { ITimelineModel } from '../core/types'
import { publish } from '../core/events'
import { REVERSE } from '../utils/constants'
import { update } from './update'

export const reverse = (model: ITimelineModel) => {
  // reverse the playrate by multiplaying by -1
  model.rate *= -1
  
  // update all players.  This has to be done when changing direction because it effects whether the player is in effect
  update(model)
  
  // send reverse event
  publish(model.id, REVERSE, model.time)
}
