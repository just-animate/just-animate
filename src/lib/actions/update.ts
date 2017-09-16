import { ITimelineModel } from '../core/types'
import { publish } from '../core/events'
import { loopOff } from '../core/timeloop'
import { S_PLAYING, UPDATE, _ } from '../utils/constants'
import { inRange, minMax, flr } from '../utils/math'
import { all } from '../utils/lists'
import { setup } from './setup'

export const update = (model: ITimelineModel) => {
  // setup effects if required
  if (model.players === _) {
    setup(model)
  }

  // check current state
  const isActive = model.state === S_PLAYING

  // remove tick from loop if no timelines are active
  if (!isActive) {
    loopOff(model.id)
  }

  // update effects`
  all(model.players, effect => {
    const { from, to } = effect
    const isAnimationActive = isActive && inRange(flr(model.time), from, to)
    const offset = minMax((model.time - from) / (to - from), 0, 1)

    effect.update(offset, model.rate, isAnimationActive)
  })

  publish(model.id, UPDATE, model.time)
}
