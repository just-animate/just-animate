import { ITimelineModel } from '../core/types';
import { update } from './update';
import { IReducer, IReducerContext } from '../core/types';
import { _ } from '../utils/constants';

export const updateTime: IReducer = (
  model: ITimelineModel,
  time: number,
  ctx: IReducerContext
) => {
  // set the time, set to the beginning if the the time resolves to Infinity or NaN
  const currentTime = +time;
  model.time = isFinite(currentTime)
    ? currentTime
    : model.rate < 0
    ? model.duration
    : 0;

  // update all players
  update(model, _, ctx);
};
