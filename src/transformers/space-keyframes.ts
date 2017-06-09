export function spaceKeyframes(keyframes: Keyframe[]): void {
    const first = keyframes[0]
    // ensure first offset 
    if (first.offset !== 0) {
        first.offset = 0
    }

    const last = keyframes[keyframes.length - 1]
    // ensure last offset
    if (last.offset !== 1) {
        last.offset = 1
    }

    // explicitly set implicit offsets
    const len = keyframes.length
    const lasti = len - 1
    for (let i = 1; i < lasti; i++) {
        const target = keyframes[i]

        // skip entries that have an offset        
        if (typeof target.offset === 'number') {
            continue
        }

        // search for the next offset with a value        
        for (let j = i + 1; j < len; j++) {
            // pass if offset is not set
            if (typeof keyframes[j].offset !== 'number') {
                continue
            }

            // calculate timing/position info
            const startTime = keyframes[i - 1].offset as number
            const endTime = keyframes[j].offset as number
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
