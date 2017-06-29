import { Keyframe } from '../types'
import { isDefined } from '../utils'
import { transforms } from './resources'

export const addTransition = (keyframes: Keyframe[], target: {}): void => {
    // copy properties from the dom to the animation
    // todo: check how to do this in IE8, or not?
    const style = window.getComputedStyle(target as HTMLElement)

    // create the first frame
    const firstFrame: Keyframe = { offset: 0 }

    const props: string[] = []
    for (let i = 0, ilen = keyframes.length; i < ilen; i++) {
        const item = keyframes[i]
        for (let property in item) {
            if (props.indexOf(property) === -1 && property !== 'offset') {
                const alias = transforms.indexOf(property) !== -1 ? 'transform' : property
                const val = style[alias]

                if (isDefined(val)) {
                    firstFrame[alias] = val
                }
            }
        }
    }

    keyframes.splice(0, 0, firstFrame)
}
