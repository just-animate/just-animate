import { PlayOptions, ITimelineModel } from '../core/types'
import { loopOn } from '../core/timeloop'
import { publish } from '../core/events'
import { S_PLAYING, PLAY } from '../utils/constants'
import { update } from './update'

export const play = (model: ITimelineModel, options: PlayOptions) => {
  if (options) {
    model.repeat = options.repeat
    model.yoyo = options.alternate === true
    model.destroy = !!options.destroy
  }

  model.repeat = model.repeat || 1
  model.yoyo = model.yoyo || false
  model.state = S_PLAYING

  // set current time (this will automatically start playing when the state is running)
  const isForwards = model.rate >= 0
  if (isForwards && model.time === model.duration) {
    model.time = 0
  } else if (!isForwards && model.time === 0) {
    model.time = model.duration
  }

  loopOn(model.id)
  update(model)
  publish(model.id, PLAY, model.time)
}
