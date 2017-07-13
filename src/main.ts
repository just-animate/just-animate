import { listify, isDefined } from './utils'
import { addPlugin, Timeline } from './core'
import { waapiPlugin } from './plugins/waapi-plugin'
import * as types from './types'

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
    var optionList = listify(options)
    for (var i = 0, ilen = optionList.length; i < ilen; i++) {
      var opt = optionList[i]
      if (!isDefined(opt.from)) {
        opt.from = 0
      }
      timeline.add(opt)
    }
  }
  return timeline
}

/**
 * Returns a new sequence of animations in a timeline
 * @param seqOptions an array of animations options
 */
export function sequence(seqOptions: types.AddAnimationOptions[]) {
  const timeline = new Timeline()
  for (let i = 0, ilen = seqOptions.length; i < ilen; i++) {
    timeline.add(seqOptions[i])
  }
  return timeline
}

// export utils and types
export { random, shuffle } from './utils'
export { splitText } from './core'
export { types }
