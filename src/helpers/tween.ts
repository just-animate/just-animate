import { Timeline } from '../core'

/** Returns a new timeline of animation(s) using the options provided */
export const tweenTo = (options: ja.AnimationOptions) => {
  const timeline = new Timeline()
  options.$transition = true
  timeline.append(options)
  return options
}
