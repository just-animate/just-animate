import { ITimelineModel, AnimationPlayer } from '../core/types'
import { plugins } from '../core/plugins'
import { getEffects } from '../model/effects'
import { all, push } from '../utils/lists'
import { max } from '../utils/math'
import { _ } from '../utils/constants'
import { IReducer, IReducerContext } from '../core/types'

export const setup: IReducer = (model: ITimelineModel, _data: any, _ctx: IReducerContext) => {
  const players: AnimationPlayer[] = []

  // determine all needed effects and iterate over them
  all(getEffects(model), effect => {
    // call animate() on the appropriate plugin
    const player = plugins[effect.plugin].animate(effect) as AnimationPlayer
    if (player) {
      // transfer the effect calculated from/to to the player
      player.from = effect.from
      player.to = effect.to
      push(players, player)
    }
  })

  // recalculate duration now that players are on the board
  model.duration = max.apply(_, players.filter(a => isFinite(a.to)).map(a => a.to))
  
  // ensure time is within bounds, reset it otherwise
  model.time = isFinite(model.time) ? model.time : model.rate < 0 ? model.duration : 0
  
  // export the new players into the model
  model.players = players
}
