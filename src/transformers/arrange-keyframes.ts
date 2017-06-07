import { tail, head } from '../utils';

export const arrangeKeyframes = (keyframes: Keyframe[]): void => {
    // don't arrange frames if there aren't any
    if (keyframes.length < 1) {
        return;
    }

    let first: Keyframe | undefined =
        head(keyframes, (k: Keyframe) => k.offset === 0)
        || head(keyframes, (k: Keyframe) => k.offset === undefined);

    if (first === undefined) {
        first = {};
        keyframes.splice(0, 0, first);
    }
    if (first.offset !== 0) {
        first.offset = 0;
    }

    let last: Keyframe | undefined =
        tail(keyframes, (k: Keyframe) => k.offset === 1)
        || tail(keyframes, (k: Keyframe) => k.offset === undefined);

    if (last === undefined) {
        last = {};
        keyframes.push(last);
    }
    if (last.offset !== 1) {
        last.offset = 0;
    }
};
