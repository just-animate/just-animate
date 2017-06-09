import { listify } from '../utils/lists'
import { Timeline } from '../core'

/** Returns a new timeline of animation(s) using the options provided */
export const animate = (options: ja.AnimationOptions | ja.AnimationOptions) => {
  const timeline = new Timeline()
  listify(options).forEach(opt => timeline.at(0, opt))
  return timeline
}
