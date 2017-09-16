import { ITimelineModel } from '../core/types'
import { publish } from '../core/events'
import { loopOff } from '../core/timeloop'
import { S_PAUSED, PAUSE } from '../utils/constants'
import { update } from './update'

export const pause = (model: ITimelineModel) => {
  model.state = S_PAUSED

  loopOff(model.id)
  update(model)
  publish(model.id, PAUSE, model.time)
}
