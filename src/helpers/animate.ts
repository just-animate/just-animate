import { AnimationOptions } from '../types'
import { listify } from '../utils'
import { Timeline } from '../core'

/** 
 * Returns a new timeline of animation(s) using the options provided
 * @param options Animtion options or an array of options
 */
export const animate = (options?: AnimationOptions | AnimationOptions[]) => {
    const timeline = new Timeline()
    if (options) {
        listify(options).forEach(opt => timeline.from(0, opt))
    }
    return timeline
}
