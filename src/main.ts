import { timeline } from './lib/timeline'
import { forEach } from './lib/lists'
import { propsPlugin } from './props'
import { addPlugin } from './lib/plugins'
import * as types from './lib/types'
import { ITimeline } from './lib/types'

// register props handler
addPlugin(propsPlugin)

/** 
 * Returns a new timeline of animation(s) using the options provided
 * @param options Animtion options or an array of options
 */
export function animate(
  options?: types.AddAnimationOptions | types.AddAnimationOptions[],
  timeline1: ITimeline = timeline()
) {
  if (options) {
    timeline1.add(options)
  }
  return timeline1
}

/**s
 * Returns a new sequence of animations in a timeline
 * @param seqOptions an array of animations options
 */
export function sequence(seqOptions: types.AddAnimationOptions[], timeline1: ITimeline = timeline()) {
  forEach(seqOptions, opt => timeline1.add(opt))
  return timeline1
}

// export utils and types
export { timeline, addPlugin }
export { removePlugin } from './lib/plugins'
export { interpolate } from './lib/interpolate'
