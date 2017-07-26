import { Timeline } from './lib/timeline'
import { forEach, list } from './lib/lists'
import * as types from './lib/types'

/** 
 * Returns a new timeline of animation(s) using the options provided
 * @param options Animtion options or an array of options
 */
export function animate(options?: types.AddAnimationOptions | types.AddAnimationOptions[]) {
  const timeline = new Timeline()
  if (options) {
    forEach(list(options), opt => {
      opt.from = opt.from || 0
      timeline.add(opt)
    })
  }
  return timeline
}

/**s
 * Returns a new sequence of animations in a timeline
 * @param seqOptions an array of animations options
 */
export function sequence(seqOptions: types.AddAnimationOptions[]) {
  const timeline = new Timeline()
  forEach(seqOptions, opt => {
    timeline.add(opt)
  })
  return timeline
}

// export utils and types
export { types }
export { addPlugin, removePlugin } from './lib/plugins'
