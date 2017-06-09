import { AnimationOptions } from '../types'
import { listify } from '../utils'
import { Timeline } from '../core'

/** Returns a new timeline of animation(s) using the options provided */
export const animate = (options: AnimationOptions | AnimationOptions) => {
  const timeline = new Timeline()
  listify(options).forEach(opt => timeline.at(0, opt))
  return timeline
}
