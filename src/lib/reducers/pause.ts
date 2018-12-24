import { ITimelineModel } from '../core/types';
import { loopOff } from '../core/timeloop';
import { S_PAUSED, _ } from '../utils/constants';
import { update } from './update';
import { PAUSE } from '../actions';
import { IReducer, IReducerContext } from '../core/types';

export const pause: IReducer = (
  model: ITimelineModel,
  _data: any,
  ctx: IReducerContext
) => {
  // set state to paused
  model.state = S_PAUSED;

  // stop auto-updating players
  loopOff(model.id);

  // update the players to make sure they process the current frame
  // this also ensures that the effects are active if this is called before play
  update(model, _, ctx);

  // send pause event
  ctx.trigger(PAUSE);
};
