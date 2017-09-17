import { ITimelineModel } from '../core/types'
import { publish } from './publish'
import { loopOff } from '../core/timeloop'
import { S_PAUSED } from '../utils/constants'
import { update } from './update'
import { PAUSE } from '../actions'
import { IReducer } from '../core/types'

export const pause: IReducer = (model: ITimelineModel) => {
  // set state to paused
  model.state = S_PAUSED

  // stop auto-updating players
  loopOff(model.id)
  
  // update the players to make sure they process the current frame
  // this also ensures that the effects are active if this is called before play
  update(model)
  
  // send pause event
  publish(model, PAUSE, model.time)
}
