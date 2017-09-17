import { PlayOptions, ITimelineModel } from '../core/types'
import { loopOn } from '../core/timeloop'
import { publish } from '../core/events'
import { S_PLAYING, PLAY } from '../utils/constants'
import { update } from './update'

export const play = (model: ITimelineModel, options: PlayOptions) => {
  if (options) {
    // transfer options to model
    model.repeat = options.repeat
    model.yoyo = !!options.alternate
    model.destroy = !!options.destroy
  }

  // ensure default play options
  model.repeat = model.repeat || 1
  model.yoyo = model.yoyo || false
  
  // set state to playing
  model.state = S_PLAYING

  // reset current time if out of bounds or first time playing
  const isForwards = model.rate >= 0
  if (isForwards && model.time === model.duration) {
    model.time = 0
  } else if (!isForwards && model.time === 0) {
    model.time = model.duration
  } 

  // start auto-updating players
  loopOn(model.id)
  
  // update the first frame of players, also make active if not already
  update(model)
  
  // send play event
  publish(model.id, PLAY, model.time)
}
