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
