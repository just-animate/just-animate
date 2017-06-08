import { deepCopyObject, isArray } from '../utils'
import { keyframeOffsetComparer } from './keyframe-offset-comparer'

/**
 * copies keyframs with an offset array to separate keyframes
 * 
 * @export
 * @param {waapi.IKeyframe[]} keyframes
 */
export const expandOffsets = (keyframes: ja.CssKeyframeOptions[]): void => {
    for (let i = keyframes.length - 1; i > -1; --i) {
        const keyframe = keyframes[i]

        // keyframes with offset as a number don't need any work        
        if (!isArray(keyframe.offset)) {
            continue
        }

        // remove the keyframe from the array        
        keyframes.splice(i, 1)

        // copy frame for each offset        
        const offsets = (keyframe.offset as number[])

        // perform ascending sort so offsets are in order in place
        // this is important when calculating the distance between known offsets
        offsets.sort()

        // insert the offsets starting with the last one, so each subsequent 
        for (let j = offsets.length - 1; j > -1; --j) {

            // create a deep copy of the frame (since we need to do additional processing)
            const newKeyframe = deepCopyObject(keyframe)

            // replace offset propery with the current number
            newKeyframe.offset = offsets[j]

            // insert it in the same position as the original
            // splice pushes the last insert ahead of it [c], [b, c], [a, b, c]
            keyframes.splice(i, 0, newKeyframe)
        }
    }

    // resort by offset    
    keyframes.sort(keyframeOffsetComparer)
}
