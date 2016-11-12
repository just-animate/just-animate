import { Keyframe } from '../waapi';

export function keyframeOffsetComparer(a: Keyframe, b: Keyframe): number {
    return (a.offset as number) - (b.offset as number);
}