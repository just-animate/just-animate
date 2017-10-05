import { ITimelineModel } from '../core/types'
import { loopOff } from '../core/timeloop' 
import { _ } from '../utils/constants'
import { all } from '../utils/lists'
import { CANCEL } from '../actions'
import { IReducer, IReducerContext } from '../core/types'

export const cancel: IReducer = (model: ITimelineModel, _data: any, ctx: IReducerContext) => {
  const { timing } = model
  // call cancel on all players
  all(model.players, effect => effect.cancel())

  // set state as inactive and clear time, round, and players
  timing.active = false
  timing.playing = false;
  timing.time = _
  timing.round = _
  model.players = _

  // stop auto-updating players
  loopOff(model.id)

  // send cancel event
  ctx.trigger(CANCEL) 
}
