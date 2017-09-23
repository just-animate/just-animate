import { ITimelineModel, AnimationPlayer } from '../core/types'
import { plugins } from '../core/plugins'
import { toEffects } from '../model/effects'
import { all, push } from '../utils/lists'
import { TargetConfiguration } from '../core/types'
import { resolveRefs } from '../core/references' 
import { calculatePlayers } from './calc-players'

export function setup(model: ITimelineModel) {
  // export the new players into the model
  model.players = []
  all(model.configs, config => setupTarget(model, config))
  calculatePlayers(model)
}

export function setupTarget(model: ITimelineModel, config: TargetConfiguration) {
  const resolvedConfig = resolveRefs(model.refs, config, true) as typeof config
  const effects = toEffects(resolvedConfig)
   
  // determine all needed effects and iterate over them
  all(effects, effect => {
    // call animate() on the appropriate plugin
    const player = plugins[effect.plugin].animate(effect) as AnimationPlayer
    if (player) {
      // transfer the effect calculated from/to to the player
      player.from = effect.from
      player.to = effect.to

      push(model.players, player)
    }
  })
}
