import { ITimelineModel } from '../core/types'
import { publish } from '../core/events'
import { REVERSE } from '../utils/constants'
import { update } from './update'

export const reverse = (model: ITimelineModel) => {
  model.rate *= -1
  update(model)
  publish(model.id, REVERSE, model.time)
}
