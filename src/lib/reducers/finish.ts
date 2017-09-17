import { loopOff } from '../core/timeloop'
import { publish } from './publish' 
import { ITimelineModel } from '../core/types'
import { S_FINISHED } from '../utils/constants'
import { destroy } from './destroy'
import { update } from './update'
import { UPDATE, FINISH } from '../actions'
import { IReducer } from '../core/types'

export const finish: IReducer = (model: ITimelineModel) => {
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
  publish(model, UPDATE, model.time)
  publish(model, FINISH, model.time)

  if (model.destroy) {
    // auto-destroy model if set
    destroy(model)
  }
}
