import { ITimelineModel } from '../core/types'
import { IReducerContext } from '../core/types'
import { CONFIG } from '../utils/constants'
import { isDefined } from '../utils/inspect'

export function setLabel(model: ITimelineModel, options: { name: string; time?: number }, ctx: IReducerContext) {
  let time = options.time
  if (!isDefined(time)) {
      time = model.cursor
  }

  // set the label
  model.labels[options.name] = time

  // trigger a config to let listeners know the configuration has changed
  ctx.trigger(CONFIG)
}
