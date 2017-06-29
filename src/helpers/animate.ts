import { AddAnimationOptions } from '../types'
import { listify, isDefined } from '../utils'
import { Timeline } from '../core'

/** 
 * Returns a new timeline of animation(s) using the options provided
 * @param options Animtion options or an array of options
 */
export const animate = (options?: AddAnimationOptions | AddAnimationOptions[]) => {
    const timeline = new Timeline()
    if (options) {
        listify(options).forEach(opt => {
            if (!isDefined(opt.from)) {
                opt.from = 0
            }
            timeline.add(opt) 
        })
    }
    return timeline
}
