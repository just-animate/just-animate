import * as types from './lib/core/types'
import { timeline } from './lib/timeline'
import { register } from './lib/core/broker'
import { addPlugin } from './lib/core/plugins'
import { propsPlugin } from './props'
import {
  CANCEL,
  DESTROY,
  FINISH,
  PAUSE,
  PLAY,
  REVERSE,
  TICK,
  UPDATE,
  UPDATE_RATE,
  UPDATE_TIME,
  SETUP
} from './lib/utils/constants'
import { cancel } from './lib/actions/cancel'
import { destroy } from './lib/actions/destroy'
import { finish } from './lib/actions/finish'
import { pause } from './lib/actions/pause'
import { play } from './lib/actions/play'
import { reverse } from './lib/actions/reverse'
import { setup } from './lib/actions/setup'
import { tick } from './lib/actions/tick'
import { update } from './lib/actions/update'
import { updateRate } from './lib/actions/updateRate'
import { updateTime } from './lib/actions/updateTime'

// register actions
register(CANCEL, cancel)
register(DESTROY, destroy)
register(FINISH, finish)
register(PAUSE, pause)
register(PLAY, play)
register(REVERSE, reverse)
register(SETUP, setup)
register(TICK, tick)
register(UPDATE, update)
register(UPDATE_RATE, updateRate)
register(UPDATE_TIME, updateTime)

// register props handler
addPlugin(propsPlugin)

/** 
 * Returns a new timeline of animation(s) using the options provided
 * @param options Animtion options or an array of options
 */
export function animate(options?: types.AddAnimationOptions | types.AddAnimationOptions[]) {
  return timeline().add(options)
}

/**s
 * Returns a new sequence of animations in a timeline
 * @param seqOptions an array of animations options
 */
export function sequence(seqOptions: types.AddAnimationOptions[]) {
  return timeline().sequence(seqOptions)
}

// export utils and types
export { timeline, addPlugin }
export { removePlugin } from './lib/core/plugins'
export { interpolate } from './lib/core/interpolate'
