import { AddAnimationOptions } from '../types'
import { Timeline } from '../core'

export const sequence = (seqOptions: AddAnimationOptions[]) => {
    const timeline = new Timeline()
    for (let i = 0, ilen = seqOptions.length; i < ilen; i++) {
        timeline.add(seqOptions[i])
    }
    return timeline
}
