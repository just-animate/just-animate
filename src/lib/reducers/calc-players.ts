import { ITimelineModel } from '../core/types';
import { max } from '../utils/math';
import { _ } from '../utils/constants';

export function calculatePlayers(model: ITimelineModel) {
  // recalculate duration from players
  model.duration = max.apply(
    _,
    model.players.filter(a => isFinite(a.to)).map(a => a.to)
  );

  // ensure time is within bounds, reset it otherwise
  model.time = isFinite(model.time)
    ? model.time
    : model.rate < 0
    ? model.duration
    : 0;
}
