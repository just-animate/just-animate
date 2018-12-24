import { ITimelineModel } from '../core/types';
import { _ } from '../utils/constants';
import { inRange } from '../utils/math';
import { finish } from './finish';
import { update } from './update';
import { IReducer, IReducerContext } from '../core/types';

export const tick: IReducer = (
  model: ITimelineModel,
  delta: number,
  _ctx: IReducerContext
) => {
  // calculate running range
  const duration = model.duration;
  const repeat = model.repeat;
  const rate = model.rate;

  // determine the current time, round, and direction
  let time = model.time === _ ? (rate < 0 ? duration : 0) : model.time;
  let round = model.round || 0;
  const isReversed = rate < 0;

  // update the time by adding the delta by the rate of time
  time += delta * rate;

  // check if timeline has finished
  let iterationEnded = false;
  if (!inRange(time, 0, duration)) {
    model.round = ++round;
    time = isReversed ? 0 : duration;
    iterationEnded = true;

    if (model.yoyo) {
      // reverse direction when alternating and the iteration has completed
      model.rate = (model.rate || 0) * -1;
    }

    // reset the clock based on the current direction
    time = model.rate < 0 ? duration : 0;
  }

  // save time and round
  model.time = time;
  model.round = round;

  if (iterationEnded && repeat === round) {
    // end the cycle by calling finish
    finish(model, _, _ctx);
    return;
  }

  // if not the last iteration, call update to update the players
  update(model, _, _ctx);
};
