/**
 * This is a stop-gap an differential update can be put in place
 */

import { ITimelineModel, IReducerContext } from '../core/types'
import { pause } from './pause'
import { play } from './play'
import { _ } from '../utils/constants'
import { all } from '../utils/lists'

export function rebuild(model: ITimelineModel, ctx: IReducerContext) {
  // cancel all current effects
  all(model.players, p => p.cancel())

  // clear players
  model.players = _
 
  // replay/pause
  if (model.timing.playing) {
    play(model, _, ctx)
  } else {
    pause(model, _, ctx)
  }
}
