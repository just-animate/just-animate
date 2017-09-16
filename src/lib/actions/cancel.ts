import { ITimelineModel } from '../core/types'
import { loopOff } from '../core/timeloop'
import { publish } from '../core/events'
import { CANCEL, S_INACTIVE, _ } from '../utils/constants'
import { all } from '../utils/lists'

export const cancel = (model: ITimelineModel) => {
  all(model.players, effect => effect.cancel())

  model.state = S_INACTIVE
  model.time = _
  model.round = _
  model.players = _

  loopOff(model.id)
  publish(model.id, CANCEL, _)
}
