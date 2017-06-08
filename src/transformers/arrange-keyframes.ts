import { _, tail, head } from '../utils'

const ensureFirstKeyframe = (keyframes: Keyframe[]) => {
    // find offset 0 or first with no offset    
    let first: Keyframe =
        head(keyframes, (k: Keyframe) => k.offset === 0)
        || head(keyframes, (k: Keyframe) => k.offset === _)

    // if no offset 0, insert an empty one
    if (first === _) {
        first = {}
        keyframes.splice(0, 0, first)
    }
    
    // set the first frame to offset 0
    if (first.offset !== 0) {
        first.offset = 0
    }
}

const ensureLastKeyframe = (keyframes: Keyframe[]) => {
    // find offset 1 or the last with no offset   
    let last: Keyframe =
        tail(keyframes, (k: Keyframe) => k.offset === 1)
        || tail(keyframes, (k: Keyframe) => k.offset === _)

    // if no offset 1, insert an empty one
    if (last === _) {
        last = {}
        keyframes.push(last)
    }
    // if last offset not 1, set it explicitly
    if (last.offset !== 1) {
        last.offset = 1
    }
}

export const arrangeKeyframes = (keyframes: Keyframe[]) => {
    if (keyframes.length) {
        ensureFirstKeyframe(keyframes)
        ensureLastKeyframe(keyframes)
    }
}
