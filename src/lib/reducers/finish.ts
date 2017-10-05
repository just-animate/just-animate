import { loopOff } from '../core/timeloop'
import { ITimelineModel } from '../core/types'
import { _ } from '../utils/constants'
import { destroy } from './destroy'
import { update } from './update'
import { FINISH } from '../actions'
import { IReducerContext } from '../core/types'

export function finish (model: ITimelineModel, _data: any, ctx: IReducerContext) {
  const { playerConfig, timing } = model
  
  // reset iteration counter and set state to finished
  timing.round = 0
  timing.playing = false
  timing.active = true

  if (!playerConfig.yoyo) {
    // reset the time to the start
    timing.time = timing.rate < 0 ? 0 : timing.duration
  }

  // stop auto-updating the players
  loopOff(model.id)
  
  // update the players one more time
  update(model, _, ctx)
  
  // send a publish UPDATE and FINISH
  // update must be sent so the last frame can be processed by things listening for 'update'
  ctx.trigger(FINISH) 

  if (playerConfig.destroy) {
    // auto-destroy model if set
    destroy(model, _, ctx)
  }
}
