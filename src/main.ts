import { timeline } from './lib/timeline'
import { propsPlugin } from './props'
import { addPlugin } from './lib/plugins'
import * as types from './lib/types'

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
export { removePlugin } from './lib/plugins'
export { interpolate } from './lib/interpolate'
