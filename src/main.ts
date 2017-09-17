import * as types from './lib/core/types'
import { timeline } from './lib/timeline'
import { addPlugin } from './lib/core/plugins'
import { propsPlugin } from './props' 

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

// register props plugin
addPlugin(propsPlugin)
