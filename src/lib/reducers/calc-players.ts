import { ITimelineModel } from '../core/types'
import { max } from '../utils/math'
import { _ } from '../utils/constants'

export function calculatePlayers(model: ITimelineModel) {
  const { players, timing } = model
  // recalculate duration from players
  timing.duration = max.apply(_, players.filter(a => isFinite(a.to)).map(a => a.to))

  // ensure time is within bounds, reset it otherwise
  timing.time = isFinite(timing.time) ? timing.time : timing.rate < 0 ? timing.duration : 0
}
