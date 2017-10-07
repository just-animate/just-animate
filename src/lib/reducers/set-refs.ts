import { ITimelineModel } from '../core/types'
import { IReducerContext, References } from '../core/types'
import { CONFIG } from '../utils/constants'

export function setReferences(model: ITimelineModel, options: References, ctx: IReducerContext) {
  // replace references
  for (var refName in options) {
    model.refs['@' + refName] = options[refName]
  }

  // trigger a config to let listeners know the configuration has changed
  ctx.needUpdate = model.configs
  ctx.trigger(CONFIG)
}
