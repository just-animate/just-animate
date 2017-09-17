import { ITimelineModel } from '../core/types'
import { publish } from '../core/events'
import { loopOff } from '../core/timeloop'
import { S_PAUSED, PAUSE } from '../utils/constants'
import { update } from './update'

export const pause = (model: ITimelineModel) => {
  // set state to paused
  model.state = S_PAUSED

  // stop auto-updating players
  loopOff(model.id)
  
  // update the players to make sure they process the current frame
  // this also ensures that the effects are active if this is called before play
  update(model)
  
  // send pause event
  publish(model.id, PAUSE, model.time)
}
