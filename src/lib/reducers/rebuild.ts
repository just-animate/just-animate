/**
 * This is a stop-gap an differential update can be put in place
 */

import { ITimelineModel, IReducerContext } from '../core/types';
import { pause } from './pause';
import { play } from './play';
import { S_PAUSED, S_PLAYING, _ } from '../utils/constants';
import { all } from '../utils/lists';

export function rebuild(model: ITimelineModel, ctx: IReducerContext) {
  const state = model.state;

  // cancel all current effects
  all(model.players, p => p.cancel());

  // clear players
  model.players = _;

  // tslint:disable-next-line:switch-default
  switch (state) {
    case S_PAUSED:
      pause(model, _, ctx);
      break;
    case S_PLAYING:
      play(model, _, ctx);
      break;
  }
}
