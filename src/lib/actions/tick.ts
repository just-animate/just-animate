import { ITimelineModel } from '../core/types'
import { S_STARTING, S_PLAYING, _ } from '../utils/constants'
import { inRange } from '../utils/math'
import { finish } from './finish'
import { update } from './update'

export const tick = (model: ITimelineModel, delta: number) => {
  // calculate running range
  const duration = model.duration
  const repeat = model.repeat
  const rate = model.rate
  const isReversed = rate < 0

  // set time use existing
  let time = model.time === _ ? (rate < 0 ? duration : 0) : model.time

  let iteration = model.round || 0

  if (model.state === S_STARTING) {
    model.state = S_PLAYING

    // reset position properties if necessary
    if (time === _ || (isReversed && time > duration) || (!isReversed && time < 0)) {
      // if at finish, reset to start time
      time = isReversed ? duration : 0
    }
    if (iteration === repeat) {
      // if at finish reset iterations to 0
      iteration = 0
    }
  }

  time += delta * rate

  // check if timeline has finished
  let iterationEnded = false
  if (!inRange(time, 0, duration)) {
    model.round = ++iteration
    time = isReversed ? 0 : duration
    iterationEnded = true

    // reverse direction on alternate
    if (model.yoyo) {
      model.rate = (model.rate || 0) * -1
    }

    // reset the clock
    time = model.rate < 0 ? duration : 0
  }

  // call update
  model.time = time
  model.round = iteration

  if (iterationEnded && repeat === iteration) {
    // end the cycle 
    finish(model)  
    return
  }

  // if not the last iteration reprocess this tick from the new starting point/direction
  update(model)
}
