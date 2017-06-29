
import { Keyframe } from '../types';
import { head, tail } from '../utils/lists';
import { isDefined } from '../utils/type';

export function inferOffsets(keyframes: Keyframe[]) {
    if (!keyframes.length) {
        return;
    }

    // search for offset 0 or assume it is the first one in the list
    const first = head(keyframes, k => k.offset === 0) || keyframes[0]
    if (!isDefined(first.offset)) {
        // if no offset is set on first keyframe, it is assumed to be 0
        first.offset = 0
    }

    // search for offset 1 or assume it is the last one in the list
    const last = tail(keyframes, k => k.offset === 1) || keyframes[keyframes.length - 1]
    if (keyframes.length > 1 && !isDefined(last.offset)) {
        // if no offset is set on last keyframe, it is assumed to be 1
        last.offset = 1
    }

    // fill in the rest of the offsets
    for (let i = 1, ilen = keyframes.length; i < ilen; i++) {
        const target = keyframes[i]
        if (isDefined(target.offset)) {
            // skip entries that have an offset   
            continue
        }

        // search for the next offset with a value        
        for (let j = i + 1; j < ilen; j++) {
            // pass if offset is not set
            if (typeof keyframes[j].offset !== 'number') {
                continue
            }

            // calculate timing/position info
            const startTime = keyframes[i - 1].offset
            const endTime = keyframes[j].offset
            const timeDelta = endTime - startTime
            const deltaLength = j - i + 1

            // set the values of all keyframes between i and j (exclusive)
            for (let k = 1; k < deltaLength; k++) {
                // set to percentage of change over time delta + starting time
                keyframes[k - 1 + i].offset = ((k / j) * timeDelta) + startTime
            }

            // move i past this keyframe since all frames between should be processed
            i = j
            break
        }
    }
}
