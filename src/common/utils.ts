
/**
 * Wrapper for performance now() with a fallback to Date.now()
 */
export function now(): number {
    return performance && performance.now ? performance.now() : Date.now();
}

/**
 * Wrapper for raf with fallback to setTimeout
 */
export function raf(fn: Function): any {
    return requestAnimationFrame
        ? requestAnimationFrame(fn as FrameRequestCallback)
        : setTimeout(fn, 16.66);
}
