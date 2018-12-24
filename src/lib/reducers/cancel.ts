import { ITimelineModel } from '../core/types';
import { loopOff } from '../core/timeloop';
import { S_INACTIVE, _ } from '../utils/constants';
import { all } from '../utils/lists';
import { CANCEL } from '../actions';
import { IReducer, IReducerContext } from '../core/types';

export const cancel: IReducer = (
  model: ITimelineModel,
  _data: any,
  ctx: IReducerContext
) => {
  // call cancel on all players
  all(model.players, effect => effect.cancel());

  // set state as inactive and clear time, round, and players
  model.state = S_INACTIVE;
  model.time = _;
  model.round = _;
  model.players = _;

  // stop auto-updating players
  loopOff(model.id);

  // send cancel event
  ctx.trigger(CANCEL);
};
