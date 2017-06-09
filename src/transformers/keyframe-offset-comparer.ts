import { Keyframe } from '../types'
export const keyframeOffsetComparer = (a: Keyframe, b: Keyframe) => (a.offset as number) - (b.offset as number)
