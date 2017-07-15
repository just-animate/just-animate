import { addPlugin, Timeline } from './core'
import { waapiPlugin } from './plugins/waapi'
import * as types from './types'
import { fromAll, list } from './utils/lists'

// configure plugins
addPlugin(waapiPlugin)

/** 
 * Returns a new timeline of animation(s) using the options provided
 * @param options Animtion options or an array of options
 */
export function animate(
  options?: types.AddAnimationOptions | types.AddAnimationOptions[]
) {
  const timeline = new Timeline()
  if (options) {
    fromAll(list(options), opt => {
      opt.from = opt.from || 0
      timeline.add(opt)
    })
  }
  return timeline
}

/**
 * Returns a new sequence of animations in a timeline
 * @param seqOptions an array of animations options
 */
export function sequence(seqOptions: types.AddAnimationOptions[]) {
  const timeline = new Timeline()
  fromAll(seqOptions, opt => {
    timeline.add(opt)
  })
  return timeline
}

// export utils and types
export { random, shuffle } from './utils/random'
export { splitText } from './core'
export { types }
