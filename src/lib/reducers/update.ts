import { ITimelineModel } from '../core/types'
import { publish } from './publish'
import { loopOff } from '../core/timeloop'
import { S_PLAYING, _ } from '../utils/constants'
import { inRange, minMax, flr } from '../utils/math'
import { all } from '../utils/lists'
import { setup } from './setup'
import { UPDATE } from '../actions'
import { IReducer, IReducerContext } from '../core/types'

export const update: IReducer = (model: ITimelineModel, _data: any, _ctx: IReducerContext) => {
  if (model.players === _) {
    // setup players if timeline is inactive 
    setup(model, _, _ctx)
  }

  // check if current state is playing
  const isPlaying = model.state === S_PLAYING
  const time = model.time

  // remove tick from loop if no timelines are active
  if (!isPlaying) {
    loopOff(model.id)
  }

  // update players`
  all(model.players, player => {
    const from = player.from
    const to = player.to 
    
    // a player is considered active if the time is in bounds of from/to
    // this value is calculated to allow the player to know if 0 and 1 are before or after their range
    const isActive = isPlaying && inRange(flr(time), from, to)
    
    // calculate the offset relative to the player
    const offset = minMax((time - from) / (to - from), 0, 1)
    
    // pass to the player, so it can decide how to update
    // note: this gets called for all players whether they are inactive or not
    player.update(offset, model.rate, isActive)
  })

  // send update event
  publish(model, UPDATE, time)
}
