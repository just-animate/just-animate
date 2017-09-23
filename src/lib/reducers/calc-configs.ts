import { ITimelineModel } from '../core/types'
import { max, min } from '../utils/math'
import { _ } from '../utils/constants'

/**
 * Recalculates the bounds of all animation configurations and the boundaries of the timeline as well
 */
export const calculateConfigs = (model: ITimelineModel) => {
  var maxTo = 0
  var cursor = 0

  var configs = model.configs
  for (var i = 0, ilen = configs.length; i < ilen; i++) {
    var config = configs[i]

    // find min and max bounds of an individual target config
    var times = config.keyframes.map(k => k.time)
    var to = max.apply(_, times)
    var from = min.apply(_, times)
    config.to = to
    config.from = from
    config.duration = to - from

    // update the timeline max and next position if larger than current value
    maxTo = max(to, maxTo)
    cursor = max(to + config.endDelay, cursor)
  }

  // update the next position and
  model.cursor = cursor
  model.duration = maxTo
}
