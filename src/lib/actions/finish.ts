import { loopOff } from '../core/timeloop'
import { publish } from '../core/events' 
import { ITimelineModel } from '../core/types'
import { UPDATE, FINISH, S_FINISHED } from '../utils/constants'
import { destroy } from './destroy'
import { update } from './update'

export const finish = (model: ITimelineModel) => {
  // reset iteration counter and set state to finished
  model.round = 0
  model.state = S_FINISHED

  if (!model.yoyo) {
    // reset the time to the start
    model.time = model.rate < 0 ? 0 : model.duration
  }

  // stop auto-updating the players
  loopOff(model.id)
  
  // update the players one more time
  update(model)
  
  // send a publish UPDATE and FINISH
  // update must be sent so the last frame can be processed by things listening for 'update'
  publish(model.id, UPDATE, model.time)
  publish(model.id, FINISH, model.time)

  if (model.destroy) {
    // auto-destroy model if set
    destroy(model)
  }
}
