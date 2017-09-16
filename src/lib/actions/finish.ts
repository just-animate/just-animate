import { loopOff } from '../core/timeloop'
import { publish } from '../core/events' 
import { ITimelineModel } from '../core/types'
import { UPDATE, FINISH, S_FINISHED } from '../utils/constants'
import { destroy } from './destroy'
import { update } from './update'

export const finish = (model: ITimelineModel) => {
  model.round = 0
  model.state = S_FINISHED

  if (!model.yoyo) {
    model.time = model.rate < 0 ? 0 : model.duration
  }

  loopOff(model.id)
  update(model)
  publish(model.id, UPDATE, model.time)
  publish(model.id, FINISH, model.time)

  if (model.destroy) {
    destroy(model)
  }
}
