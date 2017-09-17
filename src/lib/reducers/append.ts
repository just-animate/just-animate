import { AddAnimationOptions, AnimationOptions, ITimelineModel } from '../core/types'
import { _ } from '../utils/constants'
import { isDefined } from '../utils/inspect' 
import { list } from '../utils/lists'
import { insert } from './insert'
import { IReducer } from '../core/types'

export const append: IReducer = (model: ITimelineModel, data: AddAnimationOptions | AddAnimationOptions[]) => {
  const cursor = model.cursor
  const opts2 = list(data).map(opt => {
    const { to, from, duration } = opt
    const hasTo = isDefined(to)
    const hasFrom = isDefined(from)
    const hasDuration = isDefined(duration)

    // pretty exaustive rules for importing times
    const opt2 = opt as AnimationOptions
    opt2.to =
      hasTo && (hasFrom || hasDuration)
        ? to
        : hasDuration && hasFrom
          ? from + duration
          : hasTo && !hasDuration ? cursor + to : hasDuration ? cursor + duration : _
    opt2.from =
      hasFrom && (hasTo || hasDuration)
        ? from
      : hasTo && hasDuration ? to - duration : hasTo || hasDuration ? cursor : _
    
    return opt2
  })

  insert(model, opts2);
}
