import { ITimelineModel, AnimationPlayer } from '../core/types'
import { plugins } from '../core/plugins'
import { getEffects } from '../model/effects'
import { all, push } from '../utils/lists'
import { max } from '../utils/math'
import { _ } from '../utils/constants'

export const setup = (model: ITimelineModel) => {
  const animations: AnimationPlayer[] = []

  all(getEffects(model), effect => {
    const controller = plugins[effect.plugin].animate(effect) as AnimationPlayer
    if (controller) {
      // controller.config = effect.config
      controller.from = effect.from
      controller.to = effect.to
      push(animations, controller)
    }
  })

  // change duration to max to
  model.duration = max.apply(_, animations.filter(a => isFinite(a.to)).map(a => a.to))
  model.time = isFinite(model.time) ? model.time : model.rate < 0 ? model.duration : 0
  model.players = animations
}
